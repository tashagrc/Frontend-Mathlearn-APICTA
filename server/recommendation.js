"use server";

import { cookies } from "next/headers";

const base_url = "https://mathlearns.my.id/mathlearns-web-service";

export const checkToken = async () => {
  const check = cookies().get("authToken")?.value ? true : false;
  return check;
};

export const checkUserIsRecommended = async () => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(`${base_url}/quiz/user-recommendation/check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      });

      response = await api.json();
    } catch (error) {
      throw new Error("Check User Recommended Error");
    }
  }
  return response;
};

export const getQuizForTestUser = async (queryString) => {
  let response = null;

  if (await checkToken()) {
    try {
      const api = await fetch(`${base_url}/quiz/user-recommendation/quiz/test?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        }
      });

      response = await api.json();
    } catch (error) {
      console.log(error)
      throw new Error("Error get quiz test", error);
    }
  }
  return response;
};

export const getQuizRecommeded = async (queryString) => {
  let response = null;

  if (await checkToken()) {
    try {
      const api = await fetch(`${base_url}/quiz/user-recommendation/quiz/search?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        }
      });

      response = await api.json();
    } catch (error) {
      console.log(error)
      throw new Error("Error get quiz user", error);
    }
  }
  return response;
};

export const getQuiz = async (queryString) => {
  let response = null;

  try {
    const api = await fetch(`${base_url}/quiz?${queryString}`);

    response = await api.json();
  } catch (error) {
    console.log(error)
    throw new Error("Error get quiz", error);
  }

  return response;
};

export const AddedUserRecommendation = async (body) => {
  let response = null;

  if (await checkToken()) {
    try {
      const api = await fetch(`${base_url}/quiz/user-recommendation/added`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
        body: body
      });

      response = await api.json();
    } catch (error) {
      console.log(error)
      throw new Error("Error get quiz test", error);
    }
  }
  return response;
};