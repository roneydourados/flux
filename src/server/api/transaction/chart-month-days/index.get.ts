import { chartMonthDays } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { year, month } = getQuery(event);

    setResponseStatus(event, 200);

    return chartMonthDays({
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      userId: user.id,
    });
  }
});
