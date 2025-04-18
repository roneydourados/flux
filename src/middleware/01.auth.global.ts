export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value && to.path !== "/") {
    return navigateTo("/");
  }
  if (to.path === "/" && loggedIn.value) {
    return navigateTo("/dashboard");
    // if (loggedIn.value && to.path !== "/dashboard" && to.path !== "/site") {
    //   return navigateTo("/dashboard");
    // }
  }
});
