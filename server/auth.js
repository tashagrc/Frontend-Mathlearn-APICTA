"use server";

import { cookies } from "next/headers";
import axios from "axios";

const base_url = "https://mathlearns.my.id";

export const register = async (data) => {
  try {
    try {
      const response = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.body.message;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const reAuthenticate = async () => {
  try {
    try {
      const response = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/register/authenticate?token=${cookies().get("authTokenGen")?.value}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
      if (response.ok) {
        const data = await response.json();
        cookies().set("authToken", data.access_token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1,
          priority: "high",
          path: "/",
          sameSite: "strict"
        });
        cookies().set("refreshToken", data.refresh_token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24,
          priority: "high",
          path: "/",
          sameSite: "strict"
        });
        return true;
      }

    } catch (error) {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const checkAuthGen = async () => {
  return cookies().get("authTokenGen")?.value;
}

export const requestChangePassword = async (email) => {
  try{
    const response = await fetch(
      `${base_url}/mathlearns-web-service/api/v1/auth/request/change/password?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.body.message;
    }
    return null;
  }catch (error) {
    throw new Error(error);
  }
}

export const ChangePassword = async (body, token) => {
  try{
    const response = await fetch(
      `${base_url}/mathlearns-web-service/api/v1/auth/request/change/password?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.body.message;
    }
    return null;
  }catch (error) {
    throw new Error(error);
  }
}

export const authenticate = async (data) => {
  try {
    try {
      const response = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/authenticate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
      if (response.ok) {
        const data = await response.json();
        cookies().set("authToken", data.access_token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1,
          priority: "high",
          path: "/",
          sameSite: "strict"
        });
        cookies().set("refreshToken", data.refresh_token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24,
          priority: "high",
          path: "/",
          sameSite: "strict"
        });
        return true;
      }

    } catch (error) {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const refreshTokenUser = async () => {
  let response = null;
  if (cookies().get("refreshToken")?.value) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("refreshToken")?.value}`,
          },
          priority: "high"
        }
      );

      response = await api.json();
      cookies().set("authToken", response.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1,
        priority: "high",
        path: "/",
        sameSite: "strict"
      });
    } catch (error) {
      throw new Error("Resfresh Token error");
    }
  }
  return response;
};

export const logout = async () => {
  try {
    try {
      const response = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/logout`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get("authToken")?.value}`
          },
        }
      );
      if (response.ok) {
        cookies().set("authToken", "", { expires: new Date(0) });
        cookies().set("refreshToken", "", { expires: new Date(0) });
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } catch (error) {
    throw new Error(error);
  }
};
