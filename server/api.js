"use server";

import { cookies } from "next/headers";
import axios from "axios";

const base_url = "https://mathlearns.my.id";

export const createQuizAPI = async (formData) => {
  let response = null;
  let api = null;
  try {
    if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
      try {
        api = await axios.post(
          `${base_url}/mathlearns-web-service/quiz/admin/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": undefined,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const editTitleOrDiffQuiz = async (data, id) => {
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/quiz/admin/edit/quiz?id=${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
            body: data,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const addQuestion = async (formData, id) => {
  let api = null;
  let response = null;
  try {
    if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
      try {
        api = await axios.post(
          `${base_url}/mathlearns-web-service/quiz/admin/add/question?id=${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": undefined,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const editQuestion = async (formData, id) => {
  let api = null;
  let response = null;
  try {
    if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
      try {
        api = await axios.put(
          `${base_url}/mathlearns-web-service/quiz/admin/edit/question?id=${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": undefined,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data;
  } catch (error) {
    throw new Error(error);
  }

  return response;
};

export const getQuestionForAdmin = async (id) => {
  let response = null;
  if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/admin/quiz/question?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Question For Admin Error ");
    }
  }
  return response;
};

export const deleteQuestion = async (id) => {
  let response = null;
  if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/admin/delete/question?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error(" Delete Question Draft Error ");
    }
  }
  return response;
};

export const getQuizDetail = async (id) => {
  let response = null;
  let api = null;
  try {
    if (await checkToken()) {
      api = await fetch(`${base_url}/mathlearns-web-service/quiz/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      });
    } else {
      api = await fetch(`${base_url}/mathlearns-web-service/quiz/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    response = await api.json();
  } catch (error) {
    throw new Error("Get Quiz Detail Error");
  }
  return response;
};

export const getQuizDraft = async () => {
  let response = null;
  if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/admin/quiz/draft`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Quiz Draft Error");
    }
  }
  return response;
};

export const deleteQuiz = async (id) => {
  let response = null;
  if ((await checkToken()) && (await checkRole()) == "ROLE_ADMIN") {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/admin/delete/quiz?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Quiz Draft Error");
    }
  }
  return response;
};

export const takeQuiz = async (id) => {
  let response = null;
  let api = null;
  try {
    if (await checkToken()) {
      api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/take-quiz/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );
    }

    response = await api.json();
  } catch (error) {
    throw new Error("Take Quiz Error");
  }
  return response;
};

export const getQuizQuestion = async (id, currentQuestion) => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/user-question/${id}?page=${currentQuestion}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Quiz Questions Error");
    }
  }
  return response;
};

export const partitionEditQuestion = async (id, data) => {
  let response = null;
  let api = null;
  try {
    if (await checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/quiz/admin/edit/partition/question?id=${id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": "application/json",
            },
            body: data,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = await api.json();
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const duplicateQuestion = async (id) => {
  let response = null;
  let api = null;
  try {
    if (await checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/quiz/admin/duplicate/question?id=${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = await api.json();
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const postPublishQuiz = async (id) => {
  let response = null;
  let api = null;
  console.log(id);
  try {
    if (await checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/quiz/admin/quiz/draft/publish?id=${id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = await api.json();
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const getUserQuiz = async () => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/user-quiz`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get User Quiz Error");
    }
  }
  return response;
};

export const getUserAnswerQuestions = async (id) => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/user-answer-detail/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get User Quiz Error");
    }
  }
  return response;
};

export const postAnswer = async (id, option) => {
  let response = null;
  let url = `${base_url}/mathlearns-web-service/quiz/user-question/answer/${id}${
    option !== "" ? "?option=" + option : ""
  }`;
  if (await checkToken()) {
    try {
      const api = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      });

      response = await api.json();
    } catch (error) {
      throw new Error("Post Question Questions Error");
    }
  }
  return response;
};
export const postFavoriteQuiz = async (id) => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/user-quiz/favorites/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Post Favorite Quiz Error");
    }
  }
  return response;
};

export const getHeaderPoint = async () => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/user/header/point`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {}
  }
  return response;
};

export const getProfile = async () => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Profile Error");
    }
  }
  return response;
};

export const updateImageAvatar = async (formData) => {
  let response = null;
  let api = null;
  try {
    if (await checkToken()) {
      try {
        api = await axios.patch(
          `${base_url}/mathlearns-web-service/user/profile/avatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
              "Content-Type": undefined,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data.body.message;
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const updateProfile = async (data) => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/user/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
          body: JSON.stringify(data),
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Update Profile Error");
    }
  }
  return response;
};

export const changePassword = async (data) => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/user/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
          body: JSON.stringify(data),
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Change Password Error");
    }
  }
  return response;
};

export const checkToken = async () => {
  const check = cookies().get("authToken")?.value ? true : false;
  return check;
};

export const updateLike = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/like?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Update Like Error");
  }
  return response;
};

export const updateDislike = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/dislike?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Update Dislike Error");
  }
  return response;
};

export const getRatings = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/rating?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("GET Rating Error");
  }
  return response;
};

export const favoriteQuiz = async () => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/quiz/user-quiz/favorites`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Favorite Quiz Error");
    }
  }
  return response;
};

export const checkRole = async () => {
  let roleAuthorities = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      const response = await api.json();
      roleAuthorities = response.authorities.filter((authority) =>
        authority.authority.startsWith("ROLE_")
      );
      return roleAuthorities[0].authority;
    } catch (error) {
      return null;
    }
  }
};

export const checkUser = async () => {
  let userId = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      const response = await api.json();
      userId = response.users.s_id;
      return userId;
    } catch (error) {
      return null;
    }
  }
};

export const checkUserName = async () => {
  let userId = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/api/v1/auth/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      const response = await api.json();
      userId = response.users.s_uname;
      return userId;
    } catch (error) {
      return null;
    }
  }
};

export const getMateri = async (keyword, order_by, currentPage) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/material/?keyword=${keyword}&size=10&order_by=${order_by}&page=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Get Materi Error");
  }
  return response;
};

export const getUserFavMateri = async (currentPage) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/material/user/favorite?size=10&page=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Get Materi Favorite Error");
  }
  return response;
};

export const checkUserFav = async (id) => {
  let response = null;
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/material/user/favorite/check?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Check Materi Favorite Error");
    }
  }
  return response;
};

export const materialFav = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/material/fav?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Add Favorite Error");
  }
  return response;
};

export const getForumByUserId = async (page, orderBy, keyword) => {
  let response = null;
  const userId = await checkUser().then((data) => data);
  if (await checkToken()) {
    try {
      const api = await fetch(
        `${base_url}/mathlearns-web-service/forum/userId?userId=${userId}&page=${page}&size=10&order_by=${orderBy}&keyword=${keyword}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      );

      response = await api.json();
    } catch (error) {
      throw new Error("Get Forum Error");
    }
  }
  return response;
};

export const getForum = async (keyword, currentPage, order_by) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/?keyword=${keyword}&page=${currentPage}&order_by=${order_by}&size=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await api.json();
  } catch (error) {
    throw new Error("Get Forum Error");
  }
  return response;
};

export const createForumAPI = async (data) => {
  let response = null;
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await axios.post(
          `${base_url}/mathlearns-web-service/forum/create`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const updateForumAPI = async (id, data) => {
  let response = null;
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await axios.patch(
          `${base_url}/mathlearns-web-service/forum/?id=${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const deleteForumAPI = async (id) => {
  let response = null;
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await axios.delete(
          `${base_url}/mathlearns-web-service/forum/?id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const deleteForumCommentAPI = async (id) => {
  let response = null;
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await axios.delete(
          `${base_url}/mathlearns-web-service/forum/comment?id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const createForumCommentAPI = async (id, replyTo, data) => {
  let response = null;
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await axios.post(
          `${base_url}/mathlearns-web-service/forum/comment/create?id=${id}&replyTo=${replyTo}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data; // Access the data directly
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const updateForumViews = async (id) => {
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/views?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error("Update Views Error");
  }
  return true;
};

export const updateCommentLike = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/comment/like?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Update Like Error");
  }
  return response;
};

export const updateCommentDislike = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/comment/dislike?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("Update Dislike Error");
  }
  return response;
};

export const getCommentRatings = async (id) => {
  let response = null;
  try {
    const api = await fetch(
      `${base_url}/mathlearns-web-service/forum/comment/user/rating?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("authToken")?.value}`,
        },
      }
    );

    response = await api.json();
  } catch (error) {
    throw new Error("GET Rating Error");
  }
  return response;
};

// export const getMaterialDetail = async (id) => {
//   try {
//     const response = await axios.get(
//       `${base_url}/mathlearns-web-service/material/id?id=${id}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         responseType: 'stream',
//       }
//     );

//     return response.data;
//   } catch (error) {
//     // Handle network errors or other exceptions
//     throw new Error(`GET Material Error: ${error.message}`);
//   }
// };

export const createMateriAPI = async (data) => {
  let response = null;
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await axios.post(
          `${base_url}/mathlearns-web-service/material/create`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    response = api.data;
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const editTitleMaterial = async (data, id) => {
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/material/update/partition?id=${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
            body: data,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const addSectionMaterial = async (data, id) => {
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/material/add/section?id=${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
            body: data,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const editSectionMaterial = async (data, id) => {
  let api = null;
  try {
    if (checkToken()) {
      try {
        api = await fetch(
          `${base_url}/mathlearns-web-service/material/update/section?id=${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies().get("authToken")?.value}`,
            },
            body: data,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteSectionMaterial = async (id) => {
  if (checkToken) {
    await axios
      .delete(
        `${base_url}/mathlearns-web-service/material/delete/section?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        if (error.response) {
          return false;
        }
      });
  }
};

export const deleteMaterial = async (id) => {
  if (checkToken) {
    await axios
      .delete(
        `${base_url}/mathlearns-web-service/material/delete/material?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("authToken")?.value}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        if (error.response) {
          return false;
        }
      });
  }
};

export const fetchComments = async (id) => {
  try {
    const api = await fetch(
      `https://mathlearns.my.id/mathlearns-web-service/forum/comment/id?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: cookies().get("authToken")?.value
            ? `Bearer ${cookies().get("authToken")?.value}`
            : ``,
        },
      }
    );

    return await api.json();
  } catch (error) {
    throw new Error("Failed to fetch comments");
  }
};
