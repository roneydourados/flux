import { deleteTaskOccurrence } from "~/server/repositories/serviceOccurrencesRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await deleteTaskOccurrence(id);
});
