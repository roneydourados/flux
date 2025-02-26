import { index } from "@/server/repositories/dashboardRepository";
export default defineEventHandler((event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { initialDate, finalDate } = getQuery(event);

    setResponseStatus(event, 200);

    return index({
      initialDate: String(initialDate),
      finalDate: String(finalDate),
      userId: user.id,
    });
  }
});
