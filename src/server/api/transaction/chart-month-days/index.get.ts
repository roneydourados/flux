import { chartMonthDays } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { initialDate, finalDate } = getQuery(event);

    setResponseStatus(event, 200);

    return chartMonthDays({
      initialDate: String(initialDate),
      finalDate: String(finalDate),
      userId: user.id,
    });
  }
});
