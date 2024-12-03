import { ServiceProps } from "~/interfaces/Service";
import { update } from "~/server/repositories/serviceRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ServiceProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
