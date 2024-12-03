import { ClientProps } from "~/interfaces/Client";
import { create } from "~/server/repositories/clientRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const body = (await readBody(event)) as ClientProps;

    setResponseStatus(event, 200);

    return create({
      ...body,
      userId: user.id,
    });
  }
});
