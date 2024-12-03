import { showClientProject } from "~/server/repositories/clientProjectsRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return showClientProject(id);
});
