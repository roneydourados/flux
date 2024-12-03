import { ClientProjectProps } from "~/interfaces/ClientProjects";
import { createClientProject } from "~/server/repositories/clientProjectsRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ClientProjectProps>(event);

  setResponseStatus(event, 200);

  return createClientProject(body);
});
