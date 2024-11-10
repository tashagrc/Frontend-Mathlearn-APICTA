"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { getQuizForTestUser } from "../../../../server/recommendation";

const QuizTest = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  const [quizData, setQuizData] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuiz = async (query) => {
      try {
        setLoading(true);
        const queryParam = {
          eduLevel: query.eduLevel,
          preferredDifficulty: query.levelLevel,
        };
        const queryString = new URLSearchParams(queryParam).toString();
        const response = await getQuizForTestUser(queryString);
        setQuizData(response?.body?.data);
        setLoading(false);

        if (response.body.data.length == 0) {
          setTimeout(() => {
            const resultData = {
              userAvgScores: -1,
              query: {
                eduLevel: query.eduLevel,
                preferredCategory: query.categoryLevel,
                preferredDifficulty: query.levelLevel,
                availableTime: query.availableTime,
                userProgress: query.userProgress,
              },
            };
            localStorage.setItem("quizResult", JSON.stringify(resultData));

            router.push("/user/recommendation/calculate");
          }, 1000);
        }
      } catch (error) {
        console.error("Error during get quiz:", error);
        setLoading(false);
      }
    };

    getQuiz(query);
  }, []);

  const handleOptionClick = (isValidOption) => {
    if (isValidOption) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + quizData.questions[currentQuestionIndex].pointValue);
    }
    setSelectedOption(isValidOption);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      const totalQuestions = quizData.questions.length;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);

      const resultData = {
        userAvgScores: percentage >= 50 ? percentage : 50,
        query: {
          eduLevel: query.eduLevel,
          preferredCategory: query.categoryLevel,
          preferredDifficulty: query.levelLevel,
          availableTime: query.availableTime,
          userProgress: query.userProgress,
        },
      };
      localStorage.setItem("quizResult", JSON.stringify(resultData));

      alert(`Quiz selesai! Skor akhir anda adalah: ${percentage}`);

      router.push("/user/recommendation/calculate");
    }
  };

  return (
    <>
      <title>Mathlearn - Rekomendasi Quiz</title>

      <div className="box bg-orange-400 h-[100vh] overflow-hidden max-md:overflow-scroll w-full flex flex-col justify-center items-center">
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {quizData?.title}
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">Mohon tunggu ...</p>
          ) : quizData?.questions && quizData.questions.length > 0 ? (
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-700 mb-4 select-none">
                {quizData.questions[currentQuestionIndex]?.question}
              </p>
              <div className="space-y-2">
                {quizData.questions[currentQuestionIndex]?.options.map(
                  (option) => (
                    <button
                      key={option.optionNumber}
                      className={`block p-3 rounded-lg w-full text-left transition-colors ${
                        selectedOption === option.isValidOption
                          ? option.isValidOption
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : "hover:bg-gray-300 bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handleOptionClick(option.isValidOption)}
                      disabled={selectedOption !== null}
                    >
                      {option.textOption}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Kami tidak menemukan quiz test untuk anda, kami akan menyesuaikan
              quiz sesuai dengan level pendidikan anda
            </p>
          )}

          {quizData?.questions && quizData.questions.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleNextQuestion}
                className="py-3 px-6 bg-blue-600 text-white font-roboto font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 bg-green-500"
                disabled={selectedOption === null}
              >
                {currentQuestionIndex < (quizData?.questions?.length || 0) - 1
                  ? "Next"
                  : "Finish"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export function ForumQuizTestPage() {
  return (
    <Suspense>
      <QuizTest />
    </Suspense>
  );
}

export default ForumQuizTestPage;
