import { show } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const id = event.context.params!.id;

    setResponseStatus(event, 200);

    return show(id);
  }
});
