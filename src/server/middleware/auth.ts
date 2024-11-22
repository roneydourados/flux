export default defineEventHandler(async (event) => {
  const { verifyToken } = useJwtToken();

  if (event.method.toUpperCase() === "OPTIONS") {
    return;
  }
  // se não contem /api significa que é roda do lado client, então deixar passar!
  const clientSideRoutes = !event.path.includes("/api");

  // se for um endpoint de autenticação então passar
  const oauthPath =
    event.path.includes("/api/auth/google") ||
    event.path.includes("/api/auth/logout") ||
    event.path.includes("/api/_auth/session");

  // se for um endpoint liberado então passar
  if (clientSideRoutes || oauthPath) {
    return;
  }

  // caso contrário verificar se existe autorização
  const headers = getHeaders(event);

  if (!headers.authorization) {
    throw createError({
      statusCode: 403,
      statusMessage: "No Bear Token Unathorized",
    });
  }

  //se existe autorização então validar o token enviado
  try {
    const valid = verifyToken(headers.authorization.split(" ")[1]);

    if (!valid) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unathorized is not valid token",
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unathorized missing token",
    });
  }
});
