import { H3Event } from "h3";
import jwt from "jsonwebtoken";
import { UserProps } from "@/interfaces/User";
import prisma from "~/lib/prisma";

const config = useRuntimeConfig();
const issuer = "app.token.issuer.flux";
const audience = "app.token.audience.flux";
const secret = config.tokenSecret as string;

export const useJwtToken = () => {
  const createToken = ({ email, name, publicId, id }: UserProps) => {
    return jwt.sign(
      {
        id,
        email,
        name,
        publicId,
      },
      secret,
      {
        expiresIn: "7d",
        subject: publicId,
        issuer,
        audience,
      }
    );
  };

  const verifyToken = (token: string) => {
    try {
      jwt.verify(token, secret, {
        issuer,
        audience,
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const tokenData = (token: string) => {
    try {
      return jwt.verify(token, secret ?? "", {
        issuer,
        audience,
      });
    } catch (error) {
      return {
        email: "",
        name: "",
        id: 0,
        urlFoto: "",
        token: "",
      };
    }
  };

  const userLogged = (event: H3Event) => {
    const headers = getHeaders(event);
    const token = headers.authorization?.split(" ")[1] ?? "";

    const user = tokenData(token) as UserProps;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  };

  return { createToken, verifyToken, tokenData, userLogged };
};
