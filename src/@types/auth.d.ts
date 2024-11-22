// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id?: number;
    name?: string;
    email?: string;
    urlFoto?: string;
    token?: string;
    createdAt?: string;
    updatedAt?: string;
    publicId?: string;
  }

  interface UserSession {
    user: User;
    secure: SecureSessionData;
  }

  interface SecureSessionData {
    token?: string;
  }
}

export {};
