import { ClientProps } from "~/interfaces/Client";
import { update } from "~/server/repositories/clientRepository";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as ClientProps;

  setResponseStatus(event, 200);

  return update(body);
});
