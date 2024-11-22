import axios from "axios";

export const useAxios = () => {
  const config = useRuntimeConfig();
  const { user, clear } = useUserSession();

  const baseURL = config.public.apiBaseUrl as string;

  const api = axios.create({
    baseURL,
  });

  //interceptor no request para informar se tem um token a enviar na autenticação do header
  api.interceptors.request.use(
    function (config) {
      const stoken = user.value?.token;

      if (stoken) {
        config.headers.Authorization = `Bearer ${stoken}`;
      }

      return config;
    },
    async function (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        await clear();
        useNuxtApp().$toast.warn("Sessão expirou!");
        navigateTo("/");
      } else {
        return Promise.reject(error);
      }
    }
  );

  api.interceptors.response.use(
    function (response) {
      const config = response.config as any;

      switch (config.method) {
        case "post":
          useNuxtApp().$toast.success("Enviado com sucesso!");
          break;
        case "put":
          useNuxtApp().$toast.success("Enviado com sucesso!");
          break;
        case "patch":
          useNuxtApp().$toast.success("Enviado com sucesso!");
          break;
        case "delete":
          useNuxtApp().$toast.success("Enviado com sucesso!");
          break;
      }

      return response;
    },
    async function (error) {
      const config = error.config;

      switch (config.method) {
        case "post":
          useNuxtApp().$toast.error("Oops ocorreu um erro!");
          break;
        case "put":
          useNuxtApp().$toast.error("Oops ocorreu um erro!");
          break;
        case "patch":
          useNuxtApp().$toast.error("Oops ocorreu um erro!");
          break;
        case "delete":
          useNuxtApp().$toast.error("Oops ocorreu um erro!");
          break;
      }

      if (error.response.status === 401 || error.response.status === 403) {
        await clear();
        useNuxtApp().$toast.warn("Sessão expirou!");
        navigateTo("/");
      } else {
        return Promise.reject(error);
      }
    }
  );

  return { api };
};
