//import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const { createToken /*, tokenData*/ } = useJwtToken();

    let token = "";
    let userData = {
      id: 0,
      name: String(user.name).trim(),
      email: user.email,
      urlFoto: user.picture,
      token: "",
      publicId: "",
    };

    const existsUser = await prisma.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (!existsUser) {
      //cadastrar o usuário localmente
      const localUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          urlFoto: user.picture,
        },
      });

      //cadastrar as categorias padrão
      await prisma.category.createMany({
        data: categoriesDefault.map((category) => ({
          categoryName: category.name,
          icon: category.icon,
          userId: localUser.id,
          color: "",
        })),
      });

      token = createToken({
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        publicId: localUser.publicId,
      });

      userData = {
        ...userData,
        id: localUser.id,
      };
    } else {
      userData = {
        ...userData,
        publicId: existsUser.publicId,
        id: existsUser.id,
      };

      token = createToken({
        id: existsUser.id,
        email: existsUser.email,
        name: existsUser.name,
        publicId: userData.publicId,
      });
    }

    userData = {
      ...userData,
      token,
    };

    await setUserSession(event, {
      user: userData,
      secure: {
        token,
      },
    });

    return sendRedirect(event, "/dashboard");
  },

  onError(event, error) {
    console.error("Erro Google Auth", error);
    return sendRedirect(event, "/");
  },
});
