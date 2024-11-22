import { destroy } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  setResponseStatus(event, 201);
  await destroy(id);
});
