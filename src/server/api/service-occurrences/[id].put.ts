import { ServiceOccurrenceProps } from "~/interfaces/Service";
import { updateTaskOccurrence } from "~/server/repositories/serviceOccurrencesRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const body = await readBody<ServiceOccurrenceProps>(event);

  setResponseStatus(event, 200);

  await updateTaskOccurrence({
    ...body,
    publicId: id,
  });
});
