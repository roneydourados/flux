import dayjs from "dayjs";
import { index } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { initialDate, finalDate, status, categoryId } = getQuery(event);

    setResponseStatus(event, 200);

    return index({
      finalDate: finalDate ? String(finalDate) : dayjs().format("YYYY-MM-DD"),
      initialDate: initialDate
        ? String(initialDate)
        : dayjs().subtract(1, "month").format("YYYY-MM-DD"),
      userId: user.id,
      status: status ? String(status) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
  }
});
