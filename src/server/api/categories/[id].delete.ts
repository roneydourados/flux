import { destroy } from "~/server/repositories/categoryRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  setResponseStatus(event, 201);
  await destroy(id);
});
