"use client";
import React, { useEffect, useState } from "react";
import {
  getQuizDetail,
  checkRole,
  checkToken,
  deleteQuiz,
} from "../../../../../server/api";
import { convertToTime } from "../../../../../server/utils";
import { Navbar2, Navbar, NavbarSideMD } from "../../../../../components";
import { FaList } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { GiBookshelf } from "react-icons/gi";
import { CiEdit, CiPlay1 } from "react-icons/ci";
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
import { PiPrinterLight } from "react-icons/pi";
import DOMPurify from "dompurify";
import "./style_detail_quiz.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import { RxHamburgerMenu } from "react-icons/rx";
import PreviewQuestion from "../../PreviewQuestions/PreviewQuestion";
import Swal from "sweetalert2";

const EditDraftQuiz = ({ params }) => {
  const [verif, setVerif] = useState(false);
  const [quizDetail, setQuizDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [toggleNavbar, setTogle] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loadingEditQuestion, setLoadingEditQuestion] = useState(false);
  const [flag, setFlag] = useState(false);

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

  useEffect(() => {
    const getQuizDetailData = async () => {
      const quiz = await getQuizDetail(params.id);
      setQuizDetail(quiz);
      setLoading(false);
    };

    getQuizDetailData();
  }, []);

  const handleDelete = async (id) => {
    setLoadingDelete(true);

    try {
      await deleteQuiz(id);

      Swal.fire({
        title: "Sukses!",
        text: "Quiz Berhasil Dihapus",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
  
      setTimeout(function () {
        window.location.href = "/quiz/draft";
      }, 3000);
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "Error!",
        text: "Gagal Menghapus Quiz!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });

      setLoadingDelete(false);
    }
  };

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

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("Embeded copied to clipboard!");
  };

  const handleEditQuestion = async (id, index) => {
    setFlag(true);
    setHoveredIndex(index)
    setLoadingEditQuestion(true);
    window.location.href = `/quiz/draft/edit/question/${id}`;
  };

  const Modal = ({ src, alt, onClose }) => {
    return (
      <div className="modal z-50 min-w-[100vw] min-h-[100vh] bg-black/50 flex justify-center items-center fixed">
        <span
          className="close top-10 right-10 absolute font-roboto text-4xl font-semibold cursor-pointer text-white"
          onClick={onClose}
        >
          &times;
        </span>
        <div className="w-[568px] min-h-[650px] bg-white py-6 px-3 rounded-lg">
          <div className="h-full w-full flex gap-5 flex-col">
            <div className="flex flex-row gap-3">
              <div className="rounded-full  bg-purple-100 p-2 px-3 text-purple-500 flex justify-center items-center">
                <ImEmbed2 size={25} />
              </div>
              <div className="flex flex-col">
                <span className="font-roboto text-base font-semibold">
                  Embeded Quiz
                </span>
                <span className="text-gray-400 font-pacifico font-light">
                  Gunakan kuis ini di mana saja di web
                </span>
              </div>
            </div>
            <div className="block">
              <div className="text-sm font-shojumaru text-gray-500 font-semibold mb-2">
                <span>Preview</span>
              </div>
              <div className="p-2 border-2 rounded-lg pointer-events-none">
                <iframe
                  id="QuizIframe"
                  className="w-full h-[500px] object-fill max-w-screen-md max-h-screen-1/2"
                  src={`/quiz/embed/${src.id}`}
                  type="text/html"
                  scrolling="no"
                ></iframe>
              </div>
            </div>
            <div className="block">
              <div className="text-sm font-shojumaru text-gray-500 font-semibold mb-2">
                <span>Embed Link</span>
              </div>
              <div className="relative p-3 border-2 rounded-lg">
                <p>
                  {`${window.location.origin}/quiz/embed/${src.id}`.substring(
                    0,
                    56
                  )}
                  ...
                </p>
                <button
                  onClick={() =>
                    handleCopy(`${window.location.origin}/quiz/embed/${src.id}`)
                  }
                  className="absolute right-1 top-1 z-50 bg-gray-200 p-2 px-5 rounded-xl cursor-pointer hover:bg-slate-300"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="block">
              <div className="text-sm font-shojumaru text-gray-500 font-semibold mb-2">
                <span>Embed Code</span>
              </div>
              <div className="relative p-1 border-2 rounded-lg flex flex-row">
                <p className="w-[95%]">
                  {`<iframe
                      id="QuizIframe"
                      style="width:100%;display:flex;flex-direction:column;gap:8px;min-height:550px;"
                      src="${window.location.origin}/quiz/embed/${src.id}"
                      type="text/html"
                    ></iframe>`}
                </p>
                <div>
                  <button
                    onClick={() =>
                      handleCopy(`<iframe
                      id="QuizIframe"
                      style="width:100%;display:flex;flex-direction:column;gap:8px;min-height:550px;"
                      src="${window.location.origin}/quiz/embed/${src.id}"
                      type="text/html"
                    ></iframe>`)
                    }
                    className="bg-gray-200 p-2 px-5 rounded-xl cursor-pointer hover:bg-slate-300"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <title>Mathlearn - Draft Detail Quiz</title>
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
          {modalShow && (
            <Modal
              src={quizDetail}
              alt="Embed Quiz"
              onClose={() => setModalShow(false)}
            />
          )}
          <div className="flex flex-row">
            <Navbar path={"/quiz/draft"} />
            <div className="flex flex-col w-full">
              <div className="max-md:hidden">
                <Navbar2 />
              </div>
              <div
                className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}
              >
                <NavbarSideMD
                  path={"/quiz/draft"}
                  setToggle={setTogle}
                  toggle={toggleNavbar}
                />
              </div>
              <button
                className="px-3 pt-3 ml-1 md:hidden"
                onClick={() => setTogle(!toggleNavbar)}
              >
                <RxHamburgerMenu className="text-2xl" />
              </button>
              <div className="items-center flex my-5 flex-col max-md:pt-0">
                <div className="relative min-h-[300px] max-h-[30vh] w-[90%] border-2 border-gray-300 bg-white p-5 rounded-md max-md:w-[97%] max-md:min-h-[230px]">
                  <div className="absolute right-10 top-5 flex gap-3 justify-center items-center max-md:hidden">
                    <div
                      className="border border-gray-200 p-1 hover:bg-gray-50 cursor-pointer flex justify-center items-center"
                      title="Cetak Quiz"
                    >
                      <button
                        onClick={() => {
                          window.open(`/quiz/print/${params.id}`, "_blank");
                        }}
                      >
                        <PiPrinterLight />
                      </button>
                    </div>
                    <div
                      className="border border-gray-200 p-1 hover:bg-gray-50 cursor-pointer  flex justify-center items-center"
                      title="Embeded Quiz"
                    >
                      <button onClick={() => setModalShow(!modalShow)}>
                        <ImEmbed2 />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-row items-center">
                    <img
                      src={quizDetail?.pictureQuiz}
                      alt="Gambar Quiz"
                      className="w-[200px] h-[200px] object-cover max-md:w-32 max-md:h-32"
                    ></img>
                    <div className="flex flex-grow max-md:scale-75 max-md:transform-cpu max-md:-translate-x-7">
                      <div className="flex flex-col ml-5 justify-between max-md:ml-1">
                        <div className="flex flex-row font-roboto font-semibold">
                          <div className="mr-5 bg-gray-300 p-1 px-5 rounded-xl">
                            <p>QUIZ</p>
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
                                ? "MUDAH"
                                : quizDetail?.difficulty === "MEDIUM"
                                ? "SEDANG"
                                : "SULIT"}
                            </p>
                          </div>
                          <div className="p-1 px-5 rounded-xl bg-yellow">
                            <p>DRAFT</p>
                          </div>
                        </div>
                        <a className="mr-10 font-bold font-roboto text-lg my-3">
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
                    </div>
                  </div>
                  <div>
                    <div className="mt-5 flex flex-row justify-between max-md:mt-3">
                      <a className="font-shojumaru font-light text-xs text-gray-400">
                        {getDateDiff(
                          new Date(quizDetail?.createdAt),
                          new Date()
                        )}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row mt-5 gap-3 w-[90%] max-md:w-full max-md:scale-90">
                  <button
                    className="p-3 border-b-4 border-orange-700 rounded-lg bg-orange-500 w-[60%] 
              font-roboto font-bold text-lg text-white hover:bg-orange-400"
                    onClick={() => {
                      window.location.href = `/quiz/draft/edit/${quizDetail?.id}`;
                    }}
                  >
                    <div className="flex flex-row justify-center items-center gap-2">
                      <BiSolidEdit size={25} /> <span>Lanjutkan Edit</span>
                    </div>
                  </button>
                  <button
                    className="p-3 border-b-4 border-red-700 rounded-lg bg-red-500 w-[40%] 
              font-roboto font-bold text-lg text-white hover:bg-red-400"
                    onClick={() => handleDelete(quizDetail?.id)}
                  >
                    <div className="flex flex-row justify-center items-center gap-2">
                      <RiDeleteBinFill size={25} /> <span>Hapus</span>
                    </div>
                  </button>
                </div>
                <div className="flex flex-row justify-between items-center my-7 w-[90%] text-gray-700 max-md:w-full max-md:scale-90">
                  <div className="flex flex-row text-2xl pl-2 ">
                    <FaList className="mr-3" />
                    <div className="flex text-lg font-shojumaru font-medium">
                      <p>{`${quizDetail?.totalQuestions} Pertanyaan`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="bg-white p-1 px-5 rounded-lg font-shojumaru text-base border-2 border-gray-300 mr-2"
                  >
                    {!showAnswer ? (
                      <div className="flex flex-row justify-center items-center gap-2">
                        <FaRegEye size={20} /> <span>Perlihatkan Jawaban</span>
                      </div>
                    ) : (
                      <div className="flex flex-row justify-center items-center gap-2">
                        <FaRegEyeSlash size={20} />{" "}
                        <span>Sembunyikan Jawaban</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex flex-col w-[90%] p-2 rounded-lg mb-40 min-h-[100vh] gap-10 max-md:w-full max-md:scale-95">
                  {quizDetail?.questions.map((question, index) => {
                    const isHovered = hoveredIndex === index;

                    return (
                      <div
                        key={index}
                        className="flex flex-col bg-white p-5 py-7 rounded-xl border-2 border-gray-300 shadow-md hover:bg-white/50"
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                        }}
                        onMouseLeave={() => {
                          if(!flag){
                            setHoveredIndex(null);
                          }
                        }}
                      >
                        <div className="flex flex-row justify-between items-center px-3">
                          {isHovered ? (
                            <div
                              className="flex flex-row-reverse w-full"
                              key={index}
                            >
                              <button
                                className="flex flex-row justify-center items-center gap-2 border-2 border-gray-200 p-1 px-5 rounded-lg hover:bg-gray-100"
                                onClick={() => handleEditQuestion(question.id, index)}
                                disabled={loadingEditQuestion}
                              >
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
                                  <>
                                    <CiEdit
                                      className=" text-gray-500"
                                      size={20}
                                    />{" "}
                                    <p className="font-shojumaru text-sm font-semibold pt-[2px] text-gray-500">
                                      Edit Pertanyaan
                                    </p>
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                        <div
                          className="block px-3 my-5 text-lg max-md:mt-10"
                          id="question"
                        >
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditDraftQuiz;
