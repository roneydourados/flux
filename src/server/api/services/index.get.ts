import { index } from "~/server/repositories/serviceRepository";
export default defineEventHandler((event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { initialDate, finalDate, clientProjectId, clientId, invoiced } =
      getQuery(event);

    setResponseStatus(event, 200);

    return index({
      initialDate: String(initialDate),
      finalDate: String(finalDate),
      clientProjectId: Number(clientProjectId),
      clientId: Number(clientId),
      invoiced: String(invoiced),
      userId: user.id,
    });
  }
});
