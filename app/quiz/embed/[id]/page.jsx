"use client";
import React, { useEffect, useState } from "react";
import { getQuizDetail, checkToken, takeQuiz } from "../../../../server/api";

const EmbedQuiz = ({ params }) => {
  const [quizDetail, setQuizDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getQuizDetailData = async () => {
      const quiz = await getQuizDetail(params.id);
      setQuizDetail(quiz);
      setLoading(false);
    };

    getQuizDetailData();
  }, []);

  const takeQuizUser = async () => {
    if (loadingModal) {
      try {
        await takeQuiz(params.id);
      } catch (error) {
        console.error("Error take quiz:", error);
      }
    }
  };

  const handlePlayQuiz = async () => {
    const hasToken = await checkToken();
    if (!hasToken) {
      window.location.href = "/login";
    }
    await takeQuizUser();
    window.location.href = `/quiz/${params.id}`;
  };

  return (
    <>
      <title>Mathlearn - Embeded Quiz</title>

      <div
        className="box min-h-[100vh] flex justify-center items-center flex-col gap-7"
        style={{
          backgroundImage: `url(/BackgroundMathlearn.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          src="/Logo.png"
          alt="Gamabar Logo"
          className="w-auto h-[200px]"
        ></img>
        <div className="flex flex-row gap-2 text-2xl font-roboto font-semibold text-white">
          <span>Created By</span>
          <h3>Mathlearns.com</h3>
        </div>
        <div className="flex flex-row gap-2 text-base font-roboto font-semibold text-gray-200">
          <span>{quizDetail?.totalQuestions}</span> Pertanyaan
        </div>
        <button
          className="w-[600px] h-[50px] bg-orange-500 rounded-lg text-white font-roboto text-lg font-bold"
          onClick={handlePlayQuiz}
        >
          Mainkan
        </button>
      </div>
    </>
  );
};

export default EmbedQuiz;
