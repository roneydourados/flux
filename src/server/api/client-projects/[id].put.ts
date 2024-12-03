import { ClientProjectProps } from "~/interfaces/ClientProjects";
import { updateClientProject } from "~/server/repositories/clientProjectsRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ClientProjectProps>(event);

  setResponseStatus(event, 200);

  return updateClientProject(body);
});
