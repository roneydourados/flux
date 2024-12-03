import { ServiceProps } from "~/interfaces/Service";
import { create } from "~/server/repositories/serviceRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const body = await readBody<ServiceProps>(event);

    setResponseStatus(event, 200);

    return create({
      ...body,
      userId: user.id,
    });
  }
});
