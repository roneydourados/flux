import { chartMonthTransactions } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { year } = getQuery(event);

    setResponseStatus(event, 200);

    return chartMonthTransactions({
      year: year ? Number(year) : undefined,
      userId: user.id,
    });
  }
});
