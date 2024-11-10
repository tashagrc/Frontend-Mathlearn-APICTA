"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import {
  getQuizDetail,
  checkRole,
  checkToken,
  postPublishQuiz,
  partitionEditQuestion,
  duplicateQuestion,
  deleteQuestion,
  editTitleOrDiffQuiz,
} from "../../../../../server/api";
import { convertToTime } from "../../../../../server/utils";
import { MdOutlinePublish } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoCheckboxSharp } from "react-icons/io5";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { BsTrash } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { LuPlay } from "react-icons/lu";
import "./style_edit_quiz.css";
import DOMPurify from "dompurify";
import PreviewQuestion from "../../PreviewQuestions/PreviewQuestion";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";

const EditDraftQuiz = ({ params }) => {
  const [roles, setRoles] = useState(null);
  const [verif, setVerif] = useState(false);
  const [quizDetail, setQuizDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingEditPart, setLoadingEditPart] = useState(false);
  const [loadingEditPartd, setLoadingEditPartd] = useState(false);
  const [loadingDuplicate, setLoadingDuplicate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEditQuestion, setLoadingEditQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [diff, setDifficulty] = useState("EASY");
  const difficult = ["EASY", "MEDIUM", "HARD"];
  const [points, setPoints] = useState("");
  const [durations, setDurations] = useState("");
  const [pointsInit, setPointsInit] = useState({});
  const [durationsInit, setDurationsInit] = useState({});
  const [idQuest, setIdQuest] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [valueTittle, setValueTittle] = useState("");
  const inputRef = useRef(null);

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

  const editQuiz = async (data, id) => {
    await editTitleOrDiffQuiz(data, id);
  };

  useEffect(() => {
    const handleClickOutside = async (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (valueTittle) {
          const data = JSON.stringify({
            title: valueTittle,
            difficulty: "",
          });
          await editQuiz(data, params.id);
        }
        setIsEditable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [valueTittle]);

  useEffect(() => {
    const checkRoleUser = async () => {
      const role = await checkRole();
      setRoles(role);
    };

    checkRoleUser();
  }, [checkRole]);

  useEffect(() => {
    const checkRoleUser = async () => {
      const role = await checkRole();
      return role;
    };

    const checkTokenUser = async () => {
      const token = await checkToken();
      return token;
    };

    if (!checkTokenUser() && checkRoleUser() != "ROLE_ADMIN") {
      window.location.href = "/dashboard";
    } else {
      setVerif(true);
    }
  }, [checkRole, checkToken]);

  const getQuizDetailData = async () => {
    const quiz = await getQuizDetail(params.id);
    const initialPoints = {};
    const initialSurations = {};
    quiz.questions.forEach((question) => {
      initialPoints[question.id] = question.pointValue;
      initialSurations[question.id] = question.duration;
    });
    setPointsInit(initialPoints);
    setDurationsInit(initialSurations);
    setQuizDetail(quiz);
    setLoading(false);
  };

  useEffect(() => {
    getQuizDetailData();
  }, [getQuizDetail]);

  useEffect(() => {
    setDifficulty(quizDetail?.difficulty);
  }, [quizDetail]);

  const editDifficulty = async (event) => {
    if (diff) {
      const data = JSON.stringify({
        title: "",
        difficulty: event,
      });
      setDifficulty(event);
      await editQuiz(data, params.id);
    }
  }

  const handlePostPublish = async (id) => {
    setLoadingPublish(true);
    await postPublishQuiz(id);

    setTimeout(function () {
      alert("Quiz Berhasil Di Publikan");
      window.location.href = "/dashboard";
    }, 3000);
  };

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
  };

  useEffect(() => {
    if ((durations && idQuest) != "") {
      setLoadingEditPartd(true);
      editPartQuestion(idQuest, "", durations);
      setDurations("");
      setIdQuest("");
      setLoadingEditPartd(false);
    }
  }, [durations, setLoadingEditPartd]);

  useEffect(() => {
    if ((points && idQuest) != "") {
      setLoadingEditPart(true);
      setPoints("");
      setIdQuest("");
      editPartQuestion(idQuest, points, "");
      setLoadingEditPart(false);
    }
  }, [points, setLoadingEditPart]);

  const editPartQuestion = async (id, point, duration) => {
    const dataJson = {
      duration: duration != "" ? duration : "",
      pointValue: point != "" ? point : "",
    };
    await partitionEditQuestion(id, JSON.stringify(dataJson));
    await getQuizDetailData();
  };

  const duplicate = async (id) => {
    setLoadingDuplicate(true);
    const response = await duplicateQuestion(id);
    await getQuizDetailData();

    setLoadingDuplicate(false);
    alert("Quiz berhasil di-duplikat");
  };

  const deleteQ = async (id) => {
    setLoadingDelete(true);
    await deleteQuestion(id);
    await getQuizDetailData();

    setLoadingDelete(false);
    alert("Quiz berhasil dihapus");
  };

  const handleDuplicate = async (id) => {
    duplicate(id);
  };

  const handleDelete = async (id) => {
    deleteQ(id);
  };

  const handleEditQuestion = async (id) => {
    setLoadingEditQuestion(true);
    window.location.href = `/quiz/draft/edit/question/${id}`;
  };

  const Modal = ({ questions, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [show, setShow] = useState(false);

    const goToNextQuestion = () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    };

    const goToPreviousQuestion = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      }
    };

    return (
      <div className="modal z-50 min-w-[100vw] min-h-[100vh] bg-black/50 flex justify-center items-center fixed flex-col">
        <div className="block bg-black px-5 rounded-lg max-2xl:scale-95">
          <div className="flex justify-between my-3">
            <div className="text-white bg-gray-500/40 p-3 rounded-lg px-5 font-pacifico font-semibold">
              {`${currentQuestionIndex + 1}`}
              <sub>{`/${questions.length}`}</sub>
            </div>
            <div className="text-white bg-gray-500/40 p-3 rounded-lg font-pacifico font-semibold">
              Tampilan Jika Dilihat Pengunjung
            </div>
            <span
              className="close font-roboto text-4xl font-semibold cursor-pointer text-white p-1 px-3 rounded-lg"
              onClick={onClose}
            >
              &times;
            </span>
          </div>
          <PreviewQuestion
            question={questions[currentQuestionIndex]}
            showAnswer={show}
          />
          <div className="flex mt-4 gap-3 mb-3 justify-between">
            <div className="gap-3 flex">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`text-white bg-gray-500/40 p-3 rounded-lg font-pacifico ${
                  currentQuestionIndex === 0 && `opacity-70`
                }`}
              >
                Previous
              </button>
              <button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`text-white bg-gray-500/40 p-3 rounded-lg font-pacifico ${
                  currentQuestionIndex === questions.length - 1 && `opacity-70`
                }`}
              >
                Next
              </button>
            </div>
            <button
              onClick={() => setShow(!show)}
              className="text-white bg-gray-500/40 p-3 rounded-lg font-pacifico"
            >
              {show ? (
                <span>Sembunyikan Jawaban</span>
              ) : (
                <span>Perlihatkan Jawaban</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <title>Mathlearn - Draft Edit Quiz</title>
      {!verif ? (
        <div></div>
      ) : (
        <div className="flex flex-col items-center w-full min-h-[100vh] bg-gray-100">
          {modalShow && (
            <Modal
              questions={quizDetail.questions}
              onClose={() => setModalShow(false)}
            />
          )}
          {(loading || loadingPublish) && (
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
          <div className="w-full flex flex-row justify-between items-center bg-white shadow-md p-3 sticky top-0 max-md:z-10">
            <div className="flex flex-row items-center gap-3 w-full">
              <div
                title="Kembali"
                className="p-2 rounded-md border border-gray-300 cursor-pointer"
                onClick={() => {
                  window.location.href = `/quiz/draft/detail/${quizDetail?.id}`;
                }}
              >
                <IoChevronBackSharp size={20} />
              </div>
              <input
                ref={inputRef}
                title="Judul Quiz"
                type="text"
                value={valueTittle === "" ? quizDetail?.title : valueTittle}
                onChange={(e) => setValueTittle(e.target.value)}
                readOnly={!isEditable}
                disabled={roles != "ROLE_ADMIN"}
                onClick={() => setIsEditable(true)}
                onBlur={() => setIsEditable(false)}
                className="font-roboto text-lg font-semibold max-md:text-base w-full px-3 outline-none cursor-pointer hover:bg-black/10 mr-5 py-1"
              ></input>
            </div>
            <div className="flex flex-row justify-center items-center gap-3 max-md:hidden">
              <select
                value={diff}
                onChange={(e) => {
                  editDifficulty(e.target.value);
                }}
                className="p-[6px] bg-orange-500 border-b-4 border-orange-700 rounded-lg px-6 font-roboto text-base font-semibold text-white
                    flex flex-row justify-center items-center gap-2 hover:bg-orange-400 outline-none cursor-pointer"
              >
                {difficult.map((difficult, index) => (
                  <option key={index} value={difficult}>
                    {difficult == "EASY"
                      ? "MUDAH"
                      : difficult == "MEDIUM"
                      ? "SEDANG"
                      : "SULIT"}
                  </option>
                ))}
              </select>
              <button
                className="p-1 bg-orange-500 border-b-4 border-orange-700 rounded-lg px-5 font-roboto text-base font-semibold text-white
                    flex flex-row justify-center items-center gap-2 hover:bg-orange-400"
                onClick={() => setModalShow(!modalShow)}
              >
                <LuPlay size={20} />
                <span className="pt-[1px]">Preview</span>
              </button>
              {!quizDetail?.publicQuiz && (
                <button
                  className="p-1 bg-orange-500 border-b-4 border-orange-700 rounded-lg px-5 font-roboto text-base font-semibold text-white
                    flex flex-row justify-center items-center gap-2 hover:bg-orange-400"
                  onClick={() => handlePostPublish(quizDetail?.id)}
                >
                  <MdOutlinePublish size={20} />
                  <span className="pt-[1px]">Sebarkan</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col w-[1000px] p-3 mt-20 max-md:w-full max-md:mt-10">
            <div className="flex justify-between max-md:scale-95 mx-2 max-md:w-full">
              <div className="flex flex-row  items-center gap-3 max-md:gap-1 max-md:w-full">
                <span className="font-roboto font-semibold text-lg max-md:text-[1rem] text-gray-700">
                  {quizDetail?.totalQuestions} Pertanyaan
                </span>
                <span className="font-roboto font-medium text-lg max-md:text-[1rem] text-gray-500">
                  (
                  {quizDetail?.questions?.reduce(
                    (total, question) => total + question.pointValue,
                    0
                  )}{" "}
                  Point)
                </span>
              </div>
              <a
                href={`/quiz/draft/add/question/${quizDetail?.id}`}
                className="bg-orange-200 border-2 border-orange-400 p-2 px-5 rounded-base
                font-roboto font-semibold text-orange-400 flex justify-center items-center gap-2 rounded-lg max-md:scale-75 max-md:w-full max-md:text-[1rem] max-md:px-2"
              >
                <IoMdAdd size={25} />
                <span>Tambah Pertanyaan</span>
              </a>
            </div>

            <div
              id="question"
              className="mt-5 w-[100%] p-2 rounded-lg py-5 flex flex-col gap-10 my-10"
            >
              {quizDetail?.questions.map((question, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col bg-white p-5 py-7 rounded-xl border-2 border-gray-300 shadow-md"
                  >
                    <div className="flex flex-row justify-between items-center px-3">
                      <div className="flex flex-row justify-center items-center gap-2 max-md:hidden">
                        <IoIosCheckboxOutline
                          className=" text-green-400"
                          size={20}
                        />{" "}
                        <p className="font-shojumaru text-sm font-medium pt-[2px]">
                          {index + 1}. Pilihan Ganda
                        </p>
                      </div>
                      <div className="flex flex-row gap-3 max-md:grid max-md:grid-cols-1 max-md:w-full">
                        <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                          {loadingEditPartd ? (
                            <div class="loader">
                              <div class="bar1"></div>
                              <div class="bar2"></div>
                              <div class="bar3"></div>
                              <div class="bar4"></div>
                              <div class="bar5"></div>
                              <div class="bar6"></div>
                              <div class="bar7"></div>
                              <div class="bar8"></div>
                              <div class="bar9"></div>
                              <div class="bar10"></div>
                              <div class="bar11"></div>
                              <div class="bar12"></div>
                            </div>
                          ) : (
                            <div className="flex">
                              <MdOutlineTimer
                                className=" text-gray-500"
                                size={20}
                              />{" "}
                              <p className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500">
                                <select
                                  id="durationsSelect"
                                  value={durationsInit[question.id] / 1000}
                                  onChange={(e) => {
                                    setDurationsInit({
                                      ...durationsInit,
                                      [question.id]: e.target.value * 1000,
                                    });
                                    setDurations(e.target.value * 1000);
                                    setIdQuest(question.id);
                                  }}
                                  className="focus:outline-none cursor-pointer w-32 max-md:w-60"
                                >
                                  {[...Array(60).keys()].map((i) => (
                                    <option key={i} value={(i + 1) * 10}>
                                      {(i + 1) * 10 < 60
                                        ? `${(i + 1) * 10} detik`
                                        : convertSecondsToMinutesAndSeconds(
                                            (i + 1) * 10
                                          )}
                                    </option>
                                  ))}
                                </select>
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                          {loadingEditPart ? (
                            <div class="loader">
                              <div class="bar1"></div>
                              <div class="bar2"></div>
                              <div class="bar3"></div>
                              <div class="bar4"></div>
                              <div class="bar5"></div>
                              <div class="bar6"></div>
                              <div class="bar7"></div>
                              <div class="bar8"></div>
                              <div class="bar9"></div>
                              <div class="bar10"></div>
                              <div class="bar11"></div>
                              <div class="bar12"></div>
                            </div>
                          ) : (
                            <div className="flex">
                              <IoIosCheckmarkCircleOutline
                                className=" text-gray-500"
                                size={20}
                              />{" "}
                              <p className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500">
                                <select
                                  id="pointSelect"
                                  value={pointsInit[question.id]}
                                  onChange={(e) => {
                                    setPointsInit({
                                      ...pointsInit,
                                      [question.id]: e.target.value,
                                    });
                                    setPoints(e.target.value);
                                    setIdQuest(question.id);
                                  }}
                                  className="focus:outline-none cursor-pointer w-32 max-md:w-60"
                                >
                                  {[...Array(50).keys()].map((i) => (
                                    <option key={i} value={(i + 1) * 10}>
                                      {(i + 1) * 10} point
                                    </option>
                                  ))}
                                </select>
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                          {loadingDuplicate ? (
                            <div class="loader">
                              <div class="bar1"></div>
                              <div class="bar2"></div>
                              <div class="bar3"></div>
                              <div class="bar4"></div>
                              <div class="bar5"></div>
                              <div class="bar6"></div>
                              <div class="bar7"></div>
                              <div class="bar8"></div>
                              <div class="bar9"></div>
                              <div class="bar10"></div>
                              <div class="bar11"></div>
                              <div class="bar12"></div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDuplicate(question.id)}
                              className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500"
                            >
                              <HiOutlineDocumentDuplicate size={20} />
                            </button>
                          )}
                        </div>
                        <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                          {loadingEditQuestion ? (
                            <div class="loader">
                              <div class="bar1"></div>
                              <div class="bar2"></div>
                              <div class="bar3"></div>
                              <div class="bar4"></div>
                              <div class="bar5"></div>
                              <div class="bar6"></div>
                              <div class="bar7"></div>
                              <div class="bar8"></div>
                              <div class="bar9"></div>
                              <div class="bar10"></div>
                              <div class="bar11"></div>
                              <div class="bar12"></div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditQuestion(question.id)}
                              className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500 flex gap-1"
                            >
                              <p>Edit</p>
                              <CiEdit size={20} />
                            </button>
                          )}
                        </div>
                        <div className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg">
                          {loadingDelete ? (
                            <div class="loader">
                              <div class="bar1"></div>
                              <div class="bar2"></div>
                              <div class="bar3"></div>
                              <div class="bar4"></div>
                              <div class="bar5"></div>
                              <div class="bar6"></div>
                              <div class="bar7"></div>
                              <div class="bar8"></div>
                              <div class="bar9"></div>
                              <div class="bar10"></div>
                              <div class="bar11"></div>
                              <div class="bar12"></div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDelete(question.id)}
                              className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500"
                            >
                              <BsTrash size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 md:hidden mt-10">
                      <IoIosCheckboxOutline
                        className=" text-green-400"
                        size={20}
                      />{" "}
                      <p className="font-shojumaru text-sm font-medium pt-[2px]">
                        {index + 1}. Pilihan Ganda
                      </p>
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
                            USE_PROFILES: {
                              mathMl: true,
                              svg: true,
                              html: true,
                            },
                          }),
                        }}
                      />
                    </div>
                    <span className="px-3 font-shojumaru text-sm font-semibold text-gray-500">
                      Kunci Jawaban
                    </span>
                    <div className="grid grid-cols-2 gap-5 px-3 py-3">
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
                                        html: true,
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
            {!quizDetail?.publicQuiz && (
              <button
                className="p-1 bg-orange-500 border-b-4 border-orange-700 rounded-lg px-5 font-roboto text-base font-semibold text-white
                    flex flex-row justify-center items-center gap-2 hover:bg-orange-400 md:hidden mb-5"
                onClick={() => handlePostPublish(quizDetail?.id)}
              >
                <MdOutlinePublish size={20} />
                <span className="pt-[1px]">Sebarkan</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditDraftQuiz;
