import { indexClientProjects } from "~/server/repositories/clientProjectsRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  const { name, clientId } = getQuery(event);
  console.log("🚀 ~ defineEventHandler ~ clientId:", clientId);

  setResponseStatus(event, 200);

  return indexClientProjects(
    clientId ? Number(clientId) : undefined,
    name ? String(name) : undefined,
    user.id
  );
});
