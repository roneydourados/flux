export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value && to.path !== "/") {
    return navigateTo("/");
  }

  if (loggedIn.value && to.path !== "/principal" && to.path !== "/site") {
    return navigateTo("/principal");
  }
});
