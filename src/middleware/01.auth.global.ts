export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value && to.path !== "/") {
    console.log("🚀 ~ 1 if ~ loggedIn.value:", loggedIn.value);
    return navigateTo("/");
  }
  if (to.path === "/" && loggedIn.value) {
    console.log("🚀 ~ 2 if ~ loggedIn.value:", loggedIn.value);
    return navigateTo("/dashboard");
    // if (loggedIn.value && to.path !== "/dashboard" && to.path !== "/site") {
    //   return navigateTo("/dashboard");
    // }
  }
});
