import React, { useState, useEffect } from "react";
import {
  createForumCommentAPI,
  updateCommentLike,
  updateCommentDislike,
  getCommentRatings,
  checkToken,
} from "../../../server/api";

function CommentRatingButtons({ id, isDeleted, likes, dislikes, isLikes, isDislikes, paramsIdC }) {
  const [liked, setLiked] = useState(isLikes);
  const [disliked, setDisliked] = useState(isDislikes);
  const [likesCom, setLikes] = useState(likes);
  const [dislikesCom, setDislikes] = useState(dislikes);

  // async function getCommentRating() {
  //   try {
  //     const data = await getCommentRatings(id);
  //     setLiked(data?.isLiked);
  //     setDisliked(data?.isDisliked);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }

  async function commentLike() {
    if (await checkToken()) {
      try {
        setLiked(!liked);
        setDisliked(false);
        await updateCommentLike(id);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      window.location.href = "/login";
    }
  }

  async function commentDislike() {
    if (await checkToken()) {
      try {
        setDisliked(!disliked);
        setLiked(false);
        await updateCommentDislike(id);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    setLikes(likes);
    setDislikes(dislikes);
  }, [likes, dislikes]);

  return (
    <>
      <button
        title="Like"
        type="button"
        className={`inline-flex items-center justify-center w-6 h-8 text-4xl ${
          liked ? "text-green-500" : "text-gray-300"
        }`}
        onClick={() => commentLike()}
        disabled={isDeleted}
      >
        ▲
      </button>
      <p className={`inline-flex items-center justify-center text-1xl ml-1`}>
        {likesCom - dislikesCom}{" "}
      </p>

      <button
        title="Dislike"
        type="button"
        className={`inline-flex items-center justify-center w-8 h-8 text-4xl ${
          disliked ? "text-red-500" : "text-gray-300"
        }`}
        onClick={() => commentDislike()}
        disabled={isDeleted}
      >
        ▼
      </button>
    </>
  );
}

export default CommentRatingButtons;
