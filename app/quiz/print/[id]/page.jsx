"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  checkRole,
  checkUserName,
  getQuizDetail,
  getUserAnswerQuestions,
} from "../../../../server/api";
import { FaList } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiMathOperationsLight } from "react-icons/pi";
import { FaShare } from "react-icons/fa";
import "./style_print_quiz.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import DOMPurify from "dompurify";
import { useReactToPrint } from "react-to-print";

export const PrintQuiz = ({ params }) => {
  const [quizDetail, setQuizDetail] = useState(null);
  const [uName, setUname] = useState(null);
  const [isCust, setIsCust] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnswerKeyVisible, setIsAnswerKeyVisible] = useState(false);
  const [isAnswerOptionVisible, setIsAnswerOptionVisible] = useState(true);
  const [isCredential, setIsCredential] = useState(true);
  const [isAnswer, setIsAnswer] = useState(false);
  const [isPoint, setIsPoint] = useState(false);
  const [border, setBorder] = useState(true);
  const [fontSize, setFontSize] = useState("M");
  const [zoomLevel, setZoomLevel] = useState(1);
  const componentRef = useRef();

  useEffect(() => {
    const getQuizDetailData = async () => {
      let quiz = null;
      if ((await checkRole()) == "ROLE_ADMIN") {
        quiz = await getQuizDetail(params.id);
      } else if ((await checkRole()) == "ROLE_CUSTOMER") {
        quiz = await getUserAnswerQuestions(params.id);
        setUname(await checkUserName());
        setIsCust(true);
      }
      setQuizDetail(quiz);
      setLoading(false);
    };

    getQuizDetailData();
  }, []);

  const handleToggleAnswerKey = () => {
    setIsAnswerKeyVisible(!isAnswerKeyVisible);
  };

  const handleToggleAnswerOption = () => {
    setIsAnswerOptionVisible(!isAnswerOptionVisible);
  };

  const handleToggleCredential = () => {
    setIsCredential(!isCredential);
  };

  const handleToggleAnswer = () => {
    setIsAnswer(!isAnswer);
  };

  const handleTogglePoint = () => {
    setIsPoint(!isPoint);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleZoomChange = (zoomIn) => {
    setZoomLevel((prevZoomLevel) => {
      let newZoomLevel = zoomIn ? prevZoomLevel + 0.1 : prevZoomLevel - 0.1;
      newZoomLevel = Math.min(Math.max(newZoomLevel, 0.5), 2);
      return parseFloat(newZoomLevel.toFixed(1));
    });
  };

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
  };

  const fontSizeClasses = {
    S: "text-sm",
    M: "text-base",
    L: "text-lg",
    XL: "text-xl",
  };

  const fontSizeOptions = ["S", "M", "L", "XL"];

  const countTotalDuration =
    quizDetail?.questions?.reduce(
      (total, question) => total + question.duration,
      0
    ) / 1000;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setBorder(false);
    },
    onAfterPrint: () => {
      setBorder(true);
    },
  });

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("Quiz Print copied to clipboard!");
  };

  return (
    <>
      <title>Mathlearn - Cetak Quiz</title>
      <div className="app-container">
        {loading && (
          <div className="h-full w-full bg-black/60 z-50 fixed">
            <div id="page" className="mt-[25%] mb-[25%]">
              <div className="flex items-center justify-center relative">
                <div id="ring"></div>
                <div id="ring"></div>
                <div id="ring"></div>
                <div id="ring"></div>
                <div id="h3" className="font-roboto font-medium text-xl">
                  loading
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="z-0 absolute w-screen h-screen max-w-full">
          <div id={params.id}>
            <div className="h-screen overflow-hidden flex flex-col w-full">
              <div className="header">
                <header className="flex items-center justify-between md:justify-start h-12 p-4 md:pl-10 text-sm border-b-2 border-gray-500/10 bg-light text-black font-roboto font-normal">
                  <div className="flex items-center justify-start grow gap-3 font-semibold md:font-normal">
                    <img
                      src="/Logo.png"
                      alt="MathLearn Logo"
                      className="h-10"
                    />
                    <div className="w-[1px] h-6 bg-gray-500/20 hidden md:block"></div>
                    <span>Mencetak Lembar Kerja Quiz</span>
                  </div>
                </header>
              </div>
              <div className="wrapper flex-grow h-full">
                <main className="content flex h-full">
                  {/* Section Preview Print */}
                  <section className="preview-section w-full">
                    <div className="flex flex-col h-full relative">
                      <div className="inline-settings hidden md:flex">
                        <div className="w-full relative border-b-2 border-gray-500/10 h-10 bg-light py-2 px-10 text-xs text-black">
                          <div className="flex items-center justify-between relative z-5 w-full h-full">
                            <div className="flex items-center gap-6">
                              {/* Answer Keys */}
                              <div className="flex items-center gap-2 h-full">
                                <span>Kunci Jawaban</span>
                                <button
                                  onClick={handleToggleAnswerKey}
                                  className={`${
                                    isAnswerKeyVisible
                                      ? "bg-orange-300"
                                      : "bg-gray-300"
                                  } relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300`}
                                >
                                  <span
                                    className={`${
                                      isAnswerKeyVisible
                                        ? "translate-x-4"
                                        : "translate-x-1"
                                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300`}
                                  />
                                </button>
                              </div>
                              {/* Answer Option */}
                              <div className="flex items-center gap-2 h-full">
                                <span>Perlihatkan Opsi Quiz</span>
                                <button
                                  onClick={handleToggleAnswerOption}
                                  className={`${
                                    isAnswerOptionVisible
                                      ? "bg-orange-300"
                                      : "bg-gray-300"
                                  } relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300`}
                                >
                                  <span
                                    className={`${
                                      isAnswerOptionVisible
                                        ? "translate-x-4"
                                        : "translate-x-1"
                                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300`}
                                  />
                                </button>
                              </div>
                              {/* Credential User */}
                              {isCust && (
                                <div className="flex items-center gap-2 h-full">
                                  <span>Perlihatkan Kredensial</span>
                                  <button
                                    onClick={handleToggleCredential}
                                    className={`${
                                      isCredential
                                        ? "bg-orange-300"
                                        : "bg-gray-300"
                                    } relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300`}
                                  >
                                    <span
                                      className={`${
                                        isCredential
                                          ? "translate-x-4"
                                          : "translate-x-1"
                                      } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300`}
                                    />
                                  </button>
                                </div>
                              )}
                              {/* Answer User */}
                              {isCust && (
                                <div className="flex items-center gap-2 h-full">
                                  <span>Perlihatkan Jawaban Kamu</span>
                                  <button
                                    onClick={handleToggleAnswer}
                                    className={`${
                                      isAnswer ? "bg-orange-300" : "bg-gray-300"
                                    } relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300`}
                                  >
                                    <span
                                      className={`${
                                        isAnswer
                                          ? "translate-x-4"
                                          : "translate-x-1"
                                      } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300`}
                                    />
                                  </button>
                                </div>
                              )}
                              {/* Point User */}
                              {(isCust && isAnswer) && (
                                <div className="flex items-center gap-2 h-full">
                                  <span>Perlihatkan Nilai Kamu</span>
                                  <button
                                    onClick={handleTogglePoint}
                                    className={`${
                                      isPoint ? "bg-orange-300" : "bg-gray-300"
                                    } relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300`}
                                  >
                                    <span
                                      className={`${
                                        isPoint
                                          ? "translate-x-4"
                                          : "translate-x-1"
                                      } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300`}
                                    />
                                  </button>
                                </div>
                              )}
                              {/* Font Size */}
                              <div className="flex items-center gap-2 h-full">
                                <span>Ukuran Font</span>
                                <div className="flex gap-2">
                                  {fontSizeOptions.map((size) => (
                                    <button
                                      key={size}
                                      onClick={() => handleFontSizeChange(size)}
                                      className={`px-2 py-1 border rounded w-8 ${
                                        fontSize === size
                                          ? "bg-orange-300 text-black"
                                          : "bg-gray-50"
                                      }`}
                                    >
                                      {size}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {/* Zoom */}
                              <div className="flex items-center gap-2 h-full">
                                <span>Zoom</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleZoomChange(true)}
                                    className={`px-2 py-1 border rounded w-8 ${
                                      zoomLevel >= 2
                                        ? "bg-gray-50"
                                        : "bg-gray-100"
                                    } `}
                                    disabled={zoomLevel >= 2}
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => handleZoomChange(false)}
                                    className={`px-2 py-1 border rounded w-8 ${
                                      zoomLevel <= 0.5
                                        ? "bg-gray-50"
                                        : "bg-gray-100"
                                    } `}
                                    disabled={zoomLevel <= 0.5}
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={() => setZoomLevel(1)}
                                    className="px-2 py-1 border rounded bg-gray-100"
                                  >
                                    Reset
                                  </button>
                                  <button className="px-2 py-1 border rounded bg-gray-100">
                                    {parseInt(zoomLevel * 100)} %
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grow overflow-scroll relative bg-gray-200 mb-12">
                        <div
                          ref={componentRef}
                          className="w-[1000px] mx-auto my-4 h-fit p-2 bg-white flex items-start justify-center transition-transform duration-200 relative"
                          style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: "top center",
                          }}
                        >
                          <div
                            className={`rounded-lg w-full ${
                              border ? "border-2" : "border-0"
                            } border-gray-500/10`}
                          >
                            {/* Header Worksheet */}
                            <div className="flex justify-between px-8 py-6 bg-gray-50 rounded-tl-lg rounded-tr-lg shadow">
                              <div className="flex flex-col gap-4 w-60">
                                <div className="flex gap-2 items-center font-semibold md:font-normal text-sm font-roboto">
                                  <img
                                    src="/Logo.png"
                                    alt="MathLearn Logo"
                                    className="h-20"
                                  />
                                  <div className="w-[1px] h-10 bg-gray-500/20 hidden md:block"></div>
                                  <span>Lembar Kerja Quiz</span>
                                </div>
                                <div className="atr flex flex-col gap-1 text-xs">
                                  <span className="font-roboto font-bold">
                                    {quizDetail?.title}
                                  </span>
                                  <span>
                                    {`Total pertanyaan: ${quizDetail?.totalQuestions}`}
                                  </span>
                                  <span>
                                    Total durasi penyelesaian:
                                    {"  "}
                                    {countTotalDuration < 60
                                      ? countTotalDuration
                                      : convertSecondsToMinutesAndSeconds(
                                          countTotalDuration
                                        )}
                                  </span>
                                  <span>Penyedia: MathLearn.com</span>
                                </div>
                              </div>
                              <div className="insert-field font-roboto text-sm flex flex-col items-end gap-5">
                                <div className="flex gap-1 items-center">
                                  <span className="">Nama: </span>
                                  <div className="w-64 rounded bg-white h-6 border-2 border-gray-500/20 px-3">
                                    {isCust && isCredential && uName}
                                  </div>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <span>Tanggal: </span>
                                  <div className="w-64 rounded bg-white h-6 border-2 border-gray-500/20 px-3">
                                    {isCust &&
                                      quizDetail?.userQuizs[0] &&
                                      isCredential &&
                                      new Date(
                                        quizDetail?.userQuizs[0]?.createdAt
                                      ).toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                  </div>
                                </div>
                                <div className="relative flex gap-1 items-center">
                                  {(isCust && isAnswer && isPoint) && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="100%"
                                      height="100"
                                      viewBox="2.162 3.524 258 198.521"
                                    >
                                      <path
                                        fill={
                                          quizDetail?.userQuizs[0].percentage >
                                          70
                                            ? "green"
                                            : "red"
                                        }
                                        d="M128.046 202.045c-21.157-1.144-42.412-1.593-63.123-6.547-18.995-4.542-34.663-14.573-47.592-28.584-6.937-7.516-11.636-16.462-13.575-26.317-4.012-20.401-.343-39.709 9.798-58.05 9.462-17.115 22.041-31.71 37.536-43.817 11.97-9.355 25.384-16.667 39.794-21.972 9.536-3.507 19.162-7.059 29.058-9.307 23.789-5.406 47.764-5.399 71.363 1.071 19.51 5.352 36.621 14.729 49.003 30.879.938 1.22 1.537 2.685 1.703 4.57-7.869-1.781-11.24-9.078-17.747-13.427-1.194-.943-1.976-1.35-2.758-1.757-1.974-1.436-3.948-2.873-6.377-4.834-1.585-.94-2.715-1.352-3.848-1.767-.476-.052-.955-.106-1.827-.469-.394-.312-3.481-1.64-4.968-2.133-2.265-.897-4.508-1.35-6.963-1.887-.215-.086-.65-.221-.757-.252-.108-.027-5.973-3.927-9.451-1.923-14.817-4.421-29.765-5.694-45.238-3.363-28.811 4.339-55.16 14.094-78.256 31.5-11.431 8.618-19.001 11.775-15.276 6.586-.58-.402-1.161-.802-1.743-1.206-4.473 5.728-8.948 11.456-13.423 17.183-10.802 14.011-17.973 29.537-19.834 47.002-1.961 18.387 3.957 34.544 17.42 47.496 7.561 7.274 15.892 14.211 25.023 19.408 6.525 3.712 14.852 4.946 22.566 6.089 9.813 1.457 19.823 2.315 29.743 2.264 6.859-.032 13.739-1.882 20.551-3.205 5.907-1.151 11.7-2.847 17.6-4.034 5.046-1.015 10.173-1.645 15.553-1.995.574 1.52 8.523 1.531 9.458 1.184 3.191-1.188 6.064-3.168 9.455-4.974 7.589-4.134 14.789-8.146 21.987-12.156 36.075-24.764 56.809-56.718 50.359-101.416.493-.213.987-.426 1.48-.641 1.001 1.51 2.701 2.94 2.888 4.539 1.044 8.883 3.386 18.017 2.213 26.677-3.412 25.231-14.841 46.83-33.66 65.076-20.109 19.493-43.758 32.37-71.012 39.486-1.43.373-2.949.435-5.185.581-.967-.104-1.171-.146-1.427-.562-2.347-5.692 3.271-2.179 1.353.156-1.131 1.374 2.352-1.417.683.222-.095.774-16.135 1.49-18.289 1.39-1.2.575-2.011 1.222-3.105 2.06-.572.517-.862.847-1.153 1.176z"
                                        opacity="1"
                                      ></path>
                                      <text
                                        style={{ whiteSpace: "pre" }}
                                        x="30"
                                        y="135"
                                        fill={
                                          quizDetail?.userQuizs[0].percentage >
                                          70
                                            ? "green"
                                            : "red"
                                        }
                                        fontFamily="freehand"
                                        fontSize="6rem"
                                        fontWeight="bold"
                                        fontStyle={"italic"}
                                      >
                                        {quizDetail?.userQuizs[0].percentage.toFixed(
                                          1
                                        )}
                                      </text>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Content Worksheet */}
                            <div
                              className={`px-8 py-6 flex flex-col relative  break-after-auto`}
                            >
                              {quizDetail?.questions.map((question, index) => {
                                return (
                                  <div
                                    className={`question relative w-full ${fontSizeClasses[fontSize]} flex flex-col mt-8 break-inside-auto break-before auto break-after auto`}
                                  >
                                    <div
                                      className={`q-content flex gap-4 items-baseline relative ${fontSizeClasses[fontSize]}`}
                                    >
                                      <div className="q-number flex items-start justify-end">
                                        {index + 1}.
                                      </div>
                                      <div className="flex flex-col gap-4 flex-grow">
                                        {/* Questions */}
                                        <div className="flex items-start gap-4 flex-col">
                                          {question.questionImage && (
                                            <img
                                              src={question.questionImage}
                                              alt={question.imageName}
                                              className="object-contain max-w-64 min-w-64"
                                            ></img>
                                          )}
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: DOMPurify.sanitize(
                                                question.question,
                                                {
                                                  USE_PROFILES: {
                                                    mathMl: true,
                                                    svg: true,
                                                    html: true,
                                                  },
                                                }
                                              ),
                                            }}
                                          />
                                        </div>
                                        {isCust &&
                                          isAnswer &&
                                          (() => {
                                            let answerMessage = null;

                                            question.options.some((option) => {
                                              if (
                                                question.userQuestions[0]
                                                  .answer !== null &&
                                                option.optionNumber ===
                                                  question.userQuestions[0]
                                                    .answer
                                              ) {
                                                answerMessage = (
                                                  <>
                                                    <div className="w-full border-b-2 border-gray-300 border-dashed mb-5"></div>
                                                    <p className="px-3 font-roboto text-sm font-semibold pt-[2px] text-gray-500 flex flex-row mb-3">
                                                      Jawaban Kamu: &nbsp;
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              option.textOption,
                                                              {
                                                                USE_PROFILES: {
                                                                  mathMl: true,
                                                                  svg: true,
                                                                },
                                                              }
                                                            ),
                                                        }}
                                                      />
                                                    </p>
                                                  </>
                                                );
                                                return true;
                                              }
                                              return false;
                                            });

                                            if (
                                              !answerMessage &&
                                              question.userQuestions[0]
                                                .answer === null
                                            ) {
                                              answerMessage = (
                                                <>
                                                  <div className="w-full border-b-2 border-gray-300 border-dashed mb-5"></div>
                                                  <p className="px-3 font-shojumaru text-sm font-semibold pt-[2px] text-gray-500 flex flex-row mb-3">
                                                    Jawaban Kamu: Kamu Tidak
                                                    Menjawab Soal
                                                  </p>
                                                </>
                                              );
                                            }
                                            return answerMessage;
                                          })()}
                                        {/* Options */}
                                        <div className="option">
                                          {isAnswerOptionVisible ? (
                                            <div className="grid grid-cols-2 gap-5 px-3">
                                              {question.options.map(
                                                (option, index) => {
                                                  return (
                                                    <div
                                                      key={index}
                                                      className={`flex flex-row justify-start items-center gap-2 border-2 ${
                                                        option.isValidOption &&
                                                        isAnswerKeyVisible
                                                          ? "border-green-500"
                                                          : "border-gray-200"
                                                      } p-1 px-5 rounded-lg h-32`}
                                                    >
                                                      {" "}
                                                      <p
                                                        className={`font-shojumaru ${fontSizeClasses[fontSize]} font-semibold pt-[2px] text-gray-500 flex gap-3`}
                                                      >
                                                        <span>
                                                          {String.fromCharCode(
                                                            97 + index
                                                          ) + ")"}
                                                        </span>
                                                        <div
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              DOMPurify.sanitize(
                                                                option.textOption,
                                                                {
                                                                  USE_PROFILES:
                                                                    {
                                                                      mathMl: true,
                                                                      svg: true,
                                                                      html: true,
                                                                    },
                                                                }
                                                              ),
                                                          }}
                                                        />
                                                      </p>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          ) : (
                                            <div>
                                              <span
                                                className={`font-roboto ${fontSizeClasses[fontSize]} font-semibold pt-[2px] text-gray-500 flex gap-3`}
                                              >
                                                Jawab Dibawah:{" "}
                                              </span>
                                              <div className="w-full h-48 border-2 border-gray-200"></div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <aside className="information">
                    <div className="md:flex flex-col w-[20vw] h-full bg-light md:border-x-2 border-gray-500/10 p-4 md:px-4 md:py-10 gap-3 md:gap-6 hidden">
                      <h1 className="font-bold text-xl max-w-[105] break-words">
                        {quizDetail?.title}
                      </h1>
                      <div className="flex-wrap flex gap-3 text-xs text-gray-500">
                        <div class="flex gap-1 justify-center items-center">
                          <FaList />
                          <span>{`${quizDetail?.totalQuestions} Pertanyaan`}</span>
                        </div>
                        <div class="flex gap-1 justify-center items-center">
                          <CiPlay1 />
                          <span>{`${quizDetail?.totalPlays} Dimainkan`}</span>
                        </div>
                        <div class="flex gap-1 justify-center items-center">
                          <GiLevelEndFlag />
                          <span>{`${quizDetail?.difficulty}`}</span>
                        </div>
                        <div class="flex gap-1 justify-center items-center">
                          <PiMathOperationsLight />
                          <span>{`Matematika`}</span>
                        </div>
                      </div>
                      <div className="button-bottom flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            handlePrint();
                          }}
                          className="w-full py-3 bg-orange-500 text-white font-bold rounded-md transition-colors duration-200 ease-in-out hover:bg-orange-400"
                        >
                          <span>Cetak Quiz/Download Quiz</span>
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(
                              `${window.location.origin}/quiz/print/${params.id}`
                            )
                          }
                          className="w-full py-3 bg-gray-400 text-white font-bold rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-300"
                        >
                          <div className="flex justify-center items-center gap-1">
                            <FaShare />
                            <span>Bagikan Quiz</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </aside>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintQuiz;
