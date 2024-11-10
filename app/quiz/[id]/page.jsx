"use client";
import React, { useEffect, useState } from "react";
import { getQuizQuestion, postAnswer, checkToken } from "../../../server/api";
import { Navbar2 } from "../../../components";
import DOMPurify from "dompurify";
import "./page.css";
import { TrueAnswer } from "../../../components/VectorImgaeComponen/TrueAnswer";
import { WrongAnswer } from "../../../components/VectorImgaeComponen/WrongAnswer";
import { resolve } from "styled-jsx/css";

const Quiz = ({ params }) => {
  const [questions, setQuestions] = useState({});
  let [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(10);
  let [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [idQuestion, setIdQuestion] = useState("");
  const [verified, setVerified] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [clickOption, setClickOption] = useState(false);
  const [correctOption, setCorrectOption] = useState(null);
  let interval;

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      setVerified(isTokenValid);
      if (!isTokenValid) {
        window.location.href = "/login";
      }
    };

    verifyToken();
  }, [checkToken]);

  const fetchQuizData = async (currentQuestion) => {
    try {
      await new Promise(async (resolve) => {
        const { data, totalQuestions } = await getQuizQuestion(
          params.id,
          currentQuestion
        );
        setQuestions(data);
        setIdQuestion(data ? data[0]?.id : "");
        setTotalQuestion(totalQuestions);
        setLoading(false);
        setTimer(data ? data[0]?.duration / 1000 : 0);
        resolve();
      });

      return () => clearTimeout();
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  useEffect(() => {
    const savedCurrentQuestion = localStorage.getItem(
      `currentQuestion-${params.id}`
    );
    if (savedCurrentQuestion !== null) {
      setCurrentQuestion(parseInt(savedCurrentQuestion));
      fetchQuizData(parseInt(savedCurrentQuestion));
    } else {
      fetchQuizData(currentQuestion);
    }
  }, []);

  useEffect(() => {
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentQuestion < totalQuestion) {
        if (timer < 1) {
          clearInterval(interval);
          setLoading(true);
          setCorrectAnswer(null);
          const nextQuestion = currentQuestion + 1;
          await postAnswer(idQuestion, "");
          await fetchQuizData(nextQuestion);
          setCurrentQuestion(nextQuestion);
        }
      } else {
        localStorage.removeItem(`currentQuestion-${params.id}`);
        setShowScore(true);
      }
    };

    if (!clickOption) {
      fetchData();
    }
  }, [currentQuestion, timer, totalQuestion, idQuestion]);

  useEffect(() => {
    const savedCurrentQuestion = localStorage.getItem(
      `currentQuestion-${params.id}`
    );
    if (savedCurrentQuestion !== null) {
      setCurrentQuestion(parseInt(savedCurrentQuestion));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        currentQuestion >= totalQuestion ||
        isNaN(localStorage.getItem(`currentQuestion-${params.id}`))
      ) {
        localStorage.removeItem(`currentQuestion-${params.id}`);
      }
    }, 500);

    return () => clearTimeout();
  }, [currentQuestion, totalQuestion]);

  useEffect(() => {
    localStorage.setItem(
      `currentQuestion-${params.id}`,
      currentQuestion === 0 &&
        localStorage.getItem(`currentQuestion-${params.id}`) === null
        ? currentQuestion
        : currentQuestion !== 0 &&
          localStorage.getItem(`currentQuestion-${params.id}`) !== null
        ? currentQuestion
        : parseInt(localStorage.getItem(`currentQuestion-${params.id}`))
    );
  }, [currentQuestion]);

  const handleClick = async (
    id,
    selectedOption,
    currentQuestion,
    option,
    index
  ) => {
    clearInterval(interval);
    setCorrectAnswer(null);
    setLoading(true);

    let scores = questions[0].pointValue;
    const correctOption = questions[0].options.find(
      (option) => option.isValidOption
    );
    setCorrectOption(correctOption.textOption);

    new Promise(async (resolve) => {
      await postAnswer(id, option);
      resolve();
    });

    if (selectedOption === correctOption.textOption) {
      setScore(score + scores);
      setTimeout(() => {
        setCorrectAnswer(true);
      }, 0);
    } else {
      setTimeout(() => {
        setCorrectAnswer(false);
      }, 0);
    }

    if (currentQuestion < totalQuestion) {
      await fetchQuizData(currentQuestion);
    } else {
      setTimeout(function () {
        setLoading(false);
        setShowScore(true);
      }, 3000);
    }

    setCurrentQuestion(currentQuestion);
    return () => clearTimeout();
  };

  useEffect(() => {
    const textElement = document.querySelector("text");
    if (textElement) {
      const newTspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan"
      );
      newTspan.setAttribute("x", "-84.22");
      newTspan.setAttribute("y", "12.57");
      newTspan.setAttribute("fill", correctAnswer ? "green" : "red");
      newTspan.textContent = correctAnswer
        ? "Horee Kamu Benar"
        : "Yahhh Jawaban Kamu Salah";

      const oldTspan = textElement.querySelector("tspan");

      textElement.replaceChild(newTspan, oldTspan);
    }
  }, [correctAnswer]);

  const colorBg = [
    "bg-[#E1C9AD]",
    "bg-[#FFDD95]",
    "bg-[#86A7FC]",
    "bg-[#3468C0]",
  ];

  return (
    <>
      <title>Mathlearn - Quiz</title>
      {verified && (
        <div className="box bg-orange-400 h-[100vh] overflow-hidden max-md:overflow-scroll w-full">
          <div className="flex flex-row-reverse gap-5 p-5 max-md:gap-3">
            <div className="rounded-full bg-orange-300">
              {!showScore && !loading && (
                <div className="rounded-full bg-orange-300 flex justify-center items-center w-60 p-1 max-md:w-48">
                  <h2 className="text-lg font-roboto">
                    <strong> sisa waktu: {timer} detik </strong>
                  </h2>
                </div>
              )}
            </div>
            <div className="rounded-full bg-orange-300">
              {!showScore && !loading && (
                <div className="rounded-full bg-orange-300 flex justify-center items-center w-40 p-1  max-md:w-40">
                  <h2 className="text-lg font-roboto">
                    <strong>
                      {" "}
                      Q: {currentQuestion + 1} / {totalQuestion}{" "}
                    </strong>
                  </h2>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center bp-4 text-center">
            <div className="min-h-screen flex flex-col justify-center">
              {loading ? (
                <div className="flex justify-center items-center flex-col gap-7">
                  {correctAnswer != null && (
                    <p
                      className={`text-${
                        correctAnswer ? "green" : "red"
                      }-500 font-roboto font-semibold`}
                    >
                      {correctAnswer ? <TrueAnswer /> : <WrongAnswer />}
                      {/* <div
                        dangerouslySetInnerHTML={{ __html: correctOption }}
                      /> */}
                    </p>
                  )}
                  <div className="wrapper">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                  </div>
                  <div className="scanner">
                    <span>Loading...</span>
                  </div>
                </div>
              ) : showScore || !questions ? (
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-6xl mb-4 font-bold">Selamat!!!</h1>
                  <h4 className="text-xl font-semibold">
                    Kamu telah menyelesaikan Quiz.
                  </h4>
                  <h1 className="text-xl font-semibold mb-1">
                    Score akhir anda adalah
                  </h1>
                  <h2 className="text-xl font-semibold mt-10 rounded-xl bg-orange-300 h-20 w-52 text-center justify-center items-center flex">
                    <p>Score: {score}</p>
                  </h2>
                  <div className="flex flex-row gap-52 max-md:flex-col max-md:gap-0 max-md:mt-10">
                    <button
                      className="bg-blue-500 text-black hover:bg-blue-600 text-lg font-semibold mt-10 rounded-xl bg-orange-300 h-14 w-52 text-center justify-center items-center flex"
                      onClick={() => window.location.reload()}
                    >
                      <p>Ulang</p>
                    </button>
                    <button
                      className="bg-blue-500 text-black rounded-xl hover:bg-blue-600 text-lg font-semibold mt-10 bg-orange-300 h-14 w-52 text-center justify-center items-center flex"
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      <p>Selesai</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-3 w-full">
                    {questions[0].questionImage && (
                      <div className="relative flex px-3 py-3 justify-center items-center bg-black/50 border border-white rounded-md">
                        <img
                          src={questions[0].questionImage}
                          className="object-contain max-w-[300px] max-h-[300px]"
                        ></img>
                      </div>
                    )}
                    <div className="flex flex-col bg-orange-300 border border-white rounded-md p-20 w-full max-md:mt-16 justify-center items-center">
                      <p className="text-4xl mb-4 text-white font-roboto max-md:text-sm">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(questions[0].question, {
                              USE_PROFILES: { mathMl: true, svg: true },
                            }),
                          }}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-7 my-16 text-center max-md:grid-cols-1">
                    {questions[0].options.map((option, index) => (
                      <button
                        className={`block mb-[10px] max-2xl:w-[300px] max-2xl:h-60 cursor-pointer text-amber-950 text-xl text-center justify-center items-center rounded-2xl ${colorBg[index]} py-2 px-4 rounded-md hover:bg-blue-600 h-64 w-[350px] text-black font-light font-roboto`}
                        key={index}
                        onClick={() => {
                          setClickOption(true);
                          handleClick(
                            questions[0].id,
                            option.textOption,
                            currentQuestion + 1,
                            option.optionNumber,
                            index
                          );
                        }}
                      >
                        <p className="text-3xl max-md:text-sm">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(option.textOption, {
                                USE_PROFILES: { mathMl: true, svg: true },
                              }),
                            }}
                          />
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
