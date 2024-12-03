import { index } from "~/server/repositories/clientRepository";
export default defineEventHandler((event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { name } = getQuery(event);

    setResponseStatus(event, 200);

    return index(name ? String(name) : undefined, user.id);
  }
});
