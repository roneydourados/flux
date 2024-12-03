import { destroy } from "~/server/repositories/serviceRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await destroy(id);
});
