import { deleteClientProject } from "~/server/repositories/clientProjectsRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  await deleteClientProject(id);
});
