"use client";
import React, { useEffect, useState } from "react";
import {
  getUserAnswerQuestions,
  checkToken,
  deleteQuiz,
} from "../../../../../server/api";
import { convertToTime } from "../../../../../server/utils";
import { Navbar2, Navbar, NavbarSideMD } from "../../../../../components";
import { FaList } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { GiBookshelf } from "react-icons/gi";
import { CiPlay1 } from "react-icons/ci";
import { ImEmbed2 } from "react-icons/im";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoCheckboxSharp } from "react-icons/io5";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { FaListCheck } from "react-icons/fa6";
import DOMPurify from "dompurify";
import "./style_detail_quiz.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiPrinterLight } from "react-icons/pi";

const DetailAnswer = ({ params }) => {
  const [verif, setVerif] = useState(false);
  const [quizDetail, setQuizDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [toggleNavbar, setTogle] = useState(false);

  useEffect(() => {
    setInterval(() => {
      const checkTokenUser = async () => {
        const token = await checkToken();
        return token;
      };

      if (!checkTokenUser()) {
        window.location.href = "/dashboard";
      }
    }, 60000);
  });

  useEffect(() => {
    const checkTokenUser = async () => {
      const token = await checkToken();
      return token;
    };

    if (!checkTokenUser()) {
      window.location.href = "/dashboard";
    } else {
      setVerif(true);
    }
  }, [checkToken]);

  useEffect(() => {
    const getQuizDetailData = async () => {
      const quiz = await getUserAnswerQuestions(params.id);
      setQuizDetail(quiz);
      setLoading(false);
    };

    getQuizDetailData();
  }, []);

  function getDateDiff(createdDate, currentDate) {
    var diff = currentDate.getTime() - createdDate.getTime();
    var oneDay = 24 * 60 * 60 * 1000;
    var oneWeek = 7 * oneDay;
    var oneMonth = 30 * oneDay;

    if (diff > oneMonth) {
      var months = Math.floor(diff / oneMonth);
      return months > 1 ? months + " bulan lalu" : "Bulan lalu";
    } else if (diff > oneWeek) {
      var weeks = Math.floor(diff / oneWeek);
      return weeks > 1 ? weeks + " minggu lalu" : "Minggu lalu";
    } else if (diff > oneDay) {
      var days = Math.floor(diff / oneDay);
      return days > 1 ? days + " hari lalu" : "Kemarin";
    } else {
      return "Kurang dari sehari yang lalu";
    }
  }

  return (
    <>
      <title>Mathlearn - Profil Pengguna - Soal dan Kunci Jawaban</title>
      {!verif ? (
        <div></div>
      ) : (
        <div className="w-full min-h-[100vh] bg-gray-100 box">
          {(loading || loadingDelete) && (
            <div className="h-full w-full bg-black/60 z-50 fixed">
              <div id="page" className="mt-[25%] mb-[25%] max-md:mt-[100%]">
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
          <div className="flex flex-row">
            {/* <div className="md:hidden mt-7"></div> */}
            <Navbar path={"/profile"} />
            <div className="flex flex-col w-full">
              <div className="max-md:hidden">
                <Navbar2 />
                <div
                  className={`md:hidden ${
                    toggleNavbar == false ? "hidden" : ""
                  }`}
                >
                  <NavbarSideMD
                    path={"/profile"}
                    setToggle={setTogle}
                    toggle={toggleNavbar}
                  />
                </div>
                <div className="fixed flex flex-row md:hidden top-0 z-10 justify-center items-center gap-1 bg-gray-300 border-b-2 border-gray-100 py-2 w-full shadow-sm h-fit">
                  <button
                    className="p-0 ml-1"
                    onClick={() => setTogle(!toggleNavbar)}
                  >
                    <RxHamburgerMenu className="text-2xl" />
                  </button>
                </div>
              </div>

              <div className="items-center flex my-10 max-md:my-5 flex-col max-md:w-full max-md:px-3 w-full">
                <div className="w-full">
                  <button
                    className="bg-grey-200 p-2 px-4 my-3 ml-1 shadow-lg rounded-xl flex justify-center items-center text-center hover:bg-blue md:hidden"
                    onClick={() => window.history.back()}
                  >
                    <div>◁◁</div>
                  </button>
                </div>
                <div className="relative min-h-[300px] max-h-[30vh] w-[90%] border-2 border-gray-300 bg-white p-5 rounded-md max-md:w-full max-md:min-h-[150px] overflow-hidden">
                  <div className="flex flex-row items-center max-md:max-h-[100px]">
                    <img
                      src={quizDetail?.pictureQuiz}
                      alt="Gambar Quiz"
                      className="w-[200px] h-[200px] object-cover max-md:w-24 max-md:h-24"
                    ></img>
                    <div className="flex flex-grow max-md:scale-[47%] max-md:transform-cpu max-md:-translate-x-56 max-md:ml-[15px]">
                      <div className="flex flex-col ml-5 justify-between gap-7">
                        <div className="flex flex-row font-roboto font-semibold">
                          <div className="mr-5 bg-gray-300 p-1 px-5 rounded-xl">
                            <p>Quiz</p>
                          </div>
                          <div
                            className={`mr-5 p-1 px-5 rounded-xl ${
                              quizDetail?.difficulty === "EASY"
                                ? "bg-green-500"
                                : quizDetail?.difficulty === "MEDIUM"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          >
                            <p>
                              {quizDetail?.difficulty === "EASY"
                                ? "Mudah"
                                : quizDetail?.difficulty === "MEDIUM"
                                ? "Sedang"
                                : "Susah"}
                            </p>
                          </div>
                          <div className="mr-5 p-1 px-5 rounded-xl bg-yellow w-40 flex justify-center items-center">
                            <p>Quiz Kamu</p>
                          </div>
                          <div className="mr-5 p-1 px-5 rounded-xl bg-yellow flex justify-center items-center w-40 gap-2 z-10">
                            <IoIosCheckmarkCircleOutline size={20} />{" "}
                            <p>{quizDetail?.userQuizs[0]?.scores} Point</p>
                          </div>
                          <div className="p-1 px-5 rounded-xl bg-yellow flex justify-center items-center w-52 gap-2 z-10">
                            <button
                              className="flex items-center justify-center gap-3"
                              onClick={() => {
                                window.open(`/quiz/print/${params.id}`, "_blank");
                              }}
                            >
                              <PiPrinterLight size={20}/>
                              <span>Cetak Quiz Kamu</span>
                            </button>
                          </div>
                        </div>
                        <a className="font-bold font-roboto text-lg my-3">
                          {quizDetail?.title}
                        </a>
                        <div className="flex flex-row items-center mt-1">
                          <div className="flex flex-row items-center mr-14">
                            <CiPlay1 className="mr-2" />
                            <div className="flex text-sm font-shojumaru font-semibold items-center">
                              <span className="pt-[1px]">
                                {`${quizDetail?.totalPlays} Dimainkan`}
                              </span>
                            </div>
                          </div>
                          <GiGraduateCap className="mr-3 pt-[1px]" />
                          <GiBookshelf className="pb-[1px]" />
                        </div>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="198.521"
                        viewBox="2.162 3.524 258 198.521"
                        className="md:absolute top-12 right-10 w-64 
                    max-md:w-52 transform-cpu max-md:-translate-x-52 max-md:translate-y-10"
                      >
                        <path
                          fill={
                            quizDetail?.userQuizs[0].percentage > 70
                              ? "green"
                              : "red"
                          }
                          d="M128.046 202.045c-21.157-1.144-42.412-1.593-63.123-6.547-18.995-4.542-34.663-14.573-47.592-28.584-6.937-7.516-11.636-16.462-13.575-26.317-4.012-20.401-.343-39.709 9.798-58.05 9.462-17.115 22.041-31.71 37.536-43.817 11.97-9.355 25.384-16.667 39.794-21.972 9.536-3.507 19.162-7.059 29.058-9.307 23.789-5.406 47.764-5.399 71.363 1.071 19.51 5.352 36.621 14.729 49.003 30.879.938 1.22 1.537 2.685 1.703 4.57-7.869-1.781-11.24-9.078-17.747-13.427-1.194-.943-1.976-1.35-2.758-1.757-1.974-1.436-3.948-2.873-6.377-4.834-1.585-.94-2.715-1.352-3.848-1.767-.476-.052-.955-.106-1.827-.469-.394-.312-3.481-1.64-4.968-2.133-2.265-.897-4.508-1.35-6.963-1.887-.215-.086-.65-.221-.757-.252-.108-.027-5.973-3.927-9.451-1.923-14.817-4.421-29.765-5.694-45.238-3.363-28.811 4.339-55.16 14.094-78.256 31.5-11.431 8.618-19.001 11.775-15.276 6.586-.58-.402-1.161-.802-1.743-1.206-4.473 5.728-8.948 11.456-13.423 17.183-10.802 14.011-17.973 29.537-19.834 47.002-1.961 18.387 3.957 34.544 17.42 47.496 7.561 7.274 15.892 14.211 25.023 19.408 6.525 3.712 14.852 4.946 22.566 6.089 9.813 1.457 19.823 2.315 29.743 2.264 6.859-.032 13.739-1.882 20.551-3.205 5.907-1.151 11.7-2.847 17.6-4.034 5.046-1.015 10.173-1.645 15.553-1.995.574 1.52 8.523 1.531 9.458 1.184 3.191-1.188 6.064-3.168 9.455-4.974 7.589-4.134 14.789-8.146 21.987-12.156 36.075-24.764 56.809-56.718 50.359-101.416.493-.213.987-.426 1.48-.641 1.001 1.51 2.701 2.94 2.888 4.539 1.044 8.883 3.386 18.017 2.213 26.677-3.412 25.231-14.841 46.83-33.66 65.076-20.109 19.493-43.758 32.37-71.012 39.486-1.43.373-2.949.435-5.185.581-.967-.104-1.171-.146-1.427-.562-2.347-5.692 3.271-2.179 1.353.156-1.131 1.374 2.352-1.417.683.222-.095.774-16.135 1.49-18.289 1.39-1.2.575-2.011 1.222-3.105 2.06-.572.517-.862.847-1.153 1.176z"
                          opacity="1"
                        ></path>
                        <text
                          style={{ whiteSpace: "pre" }}
                          x="35"
                          y="135"
                          fill={
                            quizDetail?.userQuizs[0].percentage > 70
                              ? "green"
                              : "red"
                          }
                          fontFamily="freehand"
                          fontSize="6rem"
                          fontWeight="bold"
                          fontStyle={"italic"}
                        >
                          {quizDetail?.userQuizs[0].percentage.toFixed(1)}
                        </text>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="mt-5 flex flex-row justify-between">
                      <a className="font-shojumaru font-light text-xs text-gray-400">
                        {getDateDiff(
                          new Date(quizDetail?.createdAt),
                          new Date()
                        )}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center my-7 w-[90%] px-2 text-gray-700 max-md:w-full max-md:gap-3">
                  <div className="flex flex-row text-2xl">
                    <FaList className="mr-3 max-md:text-xs max-md:mr-1" />
                    <div className="flex text-lg font-shojumaru font-medium max-md:text-xs">
                      <p>{`${quizDetail?.totalQuestions} Pertanyaan`}</p>
                    </div>
                  </div>
                  <div className="flex flex-row text-2xl">
                    <FaListCheck className="mr-3 max-md:text-xs max-md:mr-1" />
                    <div className="flex text-lg font-shojumaru font-medium max-md:text-xs">
                      <p>{`${quizDetail?.userQuizs[0]?.correctAnswer} Jawaban Yang Benar`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="bg-white p-1 py-2 px-5 rounded-lg font-shojumaru text-base border-2 border-gray-300 w-64 max-md:w-36 max-md:p-0 max-md:py-2"
                  >
                    {!showAnswer ? (
                      <div className="flex flex-row justify-center items-center gap-2 max-md:gap-1 max-md:text-xs">
                        <FaRegEye className="max-md:text-xs text-2xl" />{" "}
                        <span className="text-lg max-md:text-xs">
                          Perlihatkan Jawaban
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-row justify-center items-center gap-2 max-md:gap-1 max-md:text-xs">
                        <FaRegEyeSlash className="max-md:text-xs text-2xl" />{" "}
                        <span className="text-lg max-md:text-xs">
                          Sembunyikan Jawaban
                        </span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex flex-col w-[90%] p-2 rounded-lg mb-40 min-h-[100vh] gap-10 max-md:w-full">
                  {quizDetail?.questions.map((question, index) => {
                    let borderClass = "border-gray-300";

                    if (
                      showAnswer &&
                      question.userQuestions[0].answer !== null
                    ) {
                      let isCorrect = false;

                      const userAnswer = question.userQuestions[0].answer;

                      const selectedOption = question.options.find(
                        (option) => option.optionNumber === userAnswer
                      );

                      if (selectedOption && selectedOption.isValidOption) {
                        isCorrect = true;
                      }

                      borderClass = isCorrect
                        ? "border-green-300"
                        : "border-red-300";
                    }

                    return (
                      <div
                        key={index}
                        className={`flex flex-col bg-white p-5 py-7 rounded-xl border-2 shadow-md ${borderClass}`}
                      >
                        <div className="flex flex-row justify-between items-center px-3">
                          <div className="flex flex-row justify-center items-center gap-2">
                            <IoIosCheckboxOutline
                              className=" text-green-400"
                              size={20}
                            />{" "}
                            <p className="font-shojumaru text-sm font-medium pt-[2px]">
                              {index + 1}. Pilihan Ganda
                            </p>
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                              <MdOutlineTimer
                                className=" text-gray-500"
                                size={20}
                              />{" "}
                              <p className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500">
                                {convertToTime(question.duration)}
                              </p>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                              <IoIosCheckmarkCircleOutline
                                className=" text-gray-500"
                                size={20}
                              />{" "}
                              <p className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500">
                                {question.pointValue} Point
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="block px-3 my-5 text-lg" id="question">
                          {question.questionImage && (
                            <img
                              src={question.questionImage}
                              alt={question.imageName}
                              className="object-contain max-h-[300px] w-auto my-3"
                            ></img>
                          )}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(question.question, {
                                USE_PROFILES: { mathMl: true, svg: true },
                              }),
                            }}
                          />
                        </div>

                        {showAnswer &&
                          (() => {
                            let answerMessage = null;

                            question.options.some((option) => {
                              if (
                                question.userQuestions[0].answer !== null &&
                                option.optionNumber ===
                                  question.userQuestions[0].answer
                              ) {
                                answerMessage = (
                                  <>
                                    <div className="w-full border-b-2 border-gray-300 border-dashed mb-5"></div>
                                    <p className="px-3 font-roboto text-sm font-semibold pt-[2px] text-gray-500 flex flex-row mb-3">
                                      Jawaban Kamu: &nbsp;
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: DOMPurify.sanitize(
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
                              question.userQuestions[0].answer === null
                            ) {
                              answerMessage = (
                                <>
                                  <div className="w-full border-b-2 border-gray-300 border-dashed mb-5"></div>
                                  <p className="px-3 font-shojumaru text-sm font-semibold pt-[2px] text-gray-500 flex flex-row mb-3">
                                    Jawaban Kamu: Kamu Tidak Menjawab Soal
                                  </p>
                                </>
                              );
                            }
                            return answerMessage;
                          })()}
                        <div className="grid grid-cols-2 gap-5 px-3">
                          {question.options.map((option, index) => {
                            return (
                              <div
                                key={index}
                                className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg h-32"
                              >
                                {option.isValidOption && showAnswer ? (
                                  <IoCheckboxSharp
                                    className=" text-green-500"
                                    size={20}
                                  />
                                ) : !option.isValidOption && showAnswer ? (
                                  <RiCheckboxBlankFill
                                    className=" text-red-500"
                                    size={20}
                                  />
                                ) : (
                                  <RiCheckboxBlankFill
                                    className=" text-gray-500"
                                    size={20}
                                  />
                                )}{" "}
                                <p className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
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
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailAnswer;
