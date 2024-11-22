import { useJwtToken } from "@/server/utils/jwtToken";
import { getCategories } from "@/server/repositories/categoryRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const { name } = getQuery(event);

    setResponseStatus(event, 200);

    const searchName = name ? String(name) : undefined;

    return getCategories(user.id, searchName);
  }
});
