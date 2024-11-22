import moment from "moment";
import { CategoryProps } from "~/interfaces/Category";

import { create } from "~/server/repositories/categoryRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const body = await readBody<CategoryProps>(event);

    setResponseStatus(event, 200);

    return create({
      ...body,
      userId: user.id,
    });
  }
});
