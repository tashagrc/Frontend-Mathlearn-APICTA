"use client";
import React, { useState, useEffect, use, useRef } from "react";
import { Navbar, Footer, Navbar2, NavbarSideMD } from "../../components";
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CCardFooter,
} from "@coreui/react";
import { CiHeart } from "react-icons/ci";
import { RiDropdownList } from "react-icons/ri";
import { Button, Modal } from "flowbite-react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getQuizDetail,
  takeQuiz,
  checkToken,
  postFavoriteQuiz,
  checkRole,
  deleteQuiz,
} from "../../server/api";
import LoadingScreen from "react-loading-screen";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./style_quiz.css";
import { BiDotsVertical } from "react-icons/bi";
import { Overlay, Popover } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  checkUserIsRecommended,
  getQuiz,
  getQuizRecommeded,
} from "../../server/recommendation";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [quizData, setQuizData] = useState([]);
  const [leaderboard, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [rec, setRec] = useState("ALL");
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState([]);
  const [size, setSize] = useState(6);
  const [openModal, setOpenModal] = useState(false);
  const [quizs, setQuiz] = useState(null);
  const [loadData, setLoadData] = useState(false);
  const qId = useRef();
  const [loadingModal, setLoadingModal] = useState(true);
  const [verified, setVerified] = useState(true);
  const [recommendation, setRecommendation] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState("");
  const [showIndex, setShowIndex] = useState(null);
  const [toggleNavbar, setTogle] = useState(false);
  const [loadingPart, setLoadingPart] = useState(false);
  const target = useRef({});
  const router = useRouter();

  const checkIsRecommended = async () => {
    try {
      const response = await checkUserIsRecommended();
      setRecommendation(response.body.response);
    } catch (error) {
      console.error("Error during checkIsRecommended:", error);
    }
  };

  const verifyTokenRole = async () => {
    const isAdm = await checkRole();
    setIsAdmin(isAdm);
  };

  const verifyToken = async () => {
    const isTokenValid = await checkToken();
    setVerified(isTokenValid);
  };

  useEffect(() => {
    checkIsRecommended();
    verifyToken();
    verifyTokenRole();
  }, []);

  const fetchQuizData = async (page = 0, keyword = "", difficulty = "") => {
    try {
      if (page <= 0) {
        setLoading(true);
      }

      const queryParams = new URLSearchParams({
        size: size,
        page: page,
        difficulty: difficulty,
        q: keyword,
      }).toString();

      let response = null;

      if (rec == "ALL") {
        response = await getQuiz(queryParams);
      } else if (rec == "RECOMMENDED") {
        response = await getQuizRecommeded(queryParams);
      }

      if (response) {
        setLoad(response.data);

        if (page <= 0) {
          setQuizData(response.data);
        } else {
          setQuizData((oldQuizData) => [...oldQuizData, ...response.data]);
        }

        setLoadingPart(false);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch quiz data");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData(page, keyword, difficulty);
  }, [keyword, difficulty, rec]);

  const fetchQuizDetail = async () => {
    if (loadingModal) {
      try {
        const response = await getQuizDetail(qId.current);
        setQuiz(response);
        setLoadingModal(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    }
  };

  const takeQuizUser = async () => {
    if (loadingModal) {
      try {
        await takeQuiz(qId.current);
        setLoadingModal(false);
      } catch (error) {
        console.error("Error take quiz:", error);
      }
    }
  };

  const userFavoriteQuiz = async () => {
    if (loadingModal) {
      try {
        await postFavoriteQuiz(qId.current);
        setLoadingModal(false);
      } catch (error) {
        console.error("Error take quiz:", error);
      }
    }
  };

  const loadMore = () => {
    setLoadingPart(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchQuizData(nextPage, keyword, difficulty);
  };

  const handleInputChange = (event) => {
    const newKeyword = event.target.value;
    setKeyword(newKeyword);
    setPage(0);
  };

  const handleInputChangeDif = (event) => {
    const newDiff = event.target.value;
    setDifficulty(newDiff);
    setPage(0);
  };

  const handleInputChangeRec = (event) => {
    const newRec = event.target.value;
    setRec(newRec);
    setPage(0);
  };

  const handleInputDiv = async (id) => {
    setOpenModal(true);
    qId.current = id;
    setLoadData(true);
    await fetchQuizDetail();
    setLoadingModal(true);
    setLoadData(false);
  };

  const handleAmbilQuiz = async (id) => {
    if (verified) {
      setOpenModal(true);
      qId.current = id;
      setLoadData(true);
      await takeQuizUser();
      setLoadingModal(true);
      window.location.href = `/quiz/${id}`;
    } else {
      window.location.href = "/login";
    }
  };

  const handleMainQuiz = (id) => {
    window.location.href = `/quiz/${id}`;
  };

  const FavoriteQuiz = async (id) => {
    if (verified) {
      setOpenModal(true);
      qId.current = id;
      setLoadData(true);
      await userFavoriteQuiz();
      await fetchQuizDetail();
      setLoadData(false);
      setLoadingModal(true);
    } else {
      window.location.href = "/login";
    }
  };

  const handleShow = (index) => {
    setShowIndex(showIndex === index ? null : index);
  };

  const handleRemoveQuiz = async (id) => {
    setLoadData(true);
    await deleteQuiz(id);
    await fetchQuizData(page, keyword, difficulty);
    setLoadData(false);
  };

  return (
    <div className="w-full">
      {loadData && (
        <div className="h-full w-full bg-black/60 z-50 fixed">
          <div id="page" className="mt-[25%] mb-[25%] max-md:mt-[100%]">
            <div className="flex items-center justify-center relative">
              <div id="ring"></div>
              <div id="ring"></div>
              <div id="ring"></div>
              <div id="ring"></div>
              <div id="h3" className="font-roboto font-medium text-xl">
                memuat . . .
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row">
        <Navbar path={"/dashboard"} />
        {/* <div className="flex flex-col items-center justify-center mb-40"> */}
        <div className="flex flex-col w-full pb-20">
          <div className="max-md:hidden justify-end flex">
            <Navbar2 />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <div
              className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}
            >
              <NavbarSideMD
                path={"/dashboard"}
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
              <input
                type="text"
                placeholder="Cari Topik Yang Anda Inginkan ..."
                className="md:hidden rounded-md pl-4 w-[270px] h-[40px] border-2 border-orange-500 leading-tight focus:outline-none focus:shadow-outline appearance-none text-gray-500 font-semibold font-roboto"
                value={keyword}
                onChange={handleInputChange}
              />
              <div className="flex flex-row-reverse">
                <select
                  name="difficulty"
                  id="difficulty"
                  className="w-[100px] h-[40px]
                                                              rounded-md border-2 border-orange-500 bg-white leading-tight focus:outline-none 
                                                              focus:shadow-outline appearance-none text-gray-500 font-semibold font-roboto text-center 
                                                              text-sm cursor-pointer
                                                              md:hidden"
                  value={difficulty}
                  onChange={handleInputChangeDif}
                >
                  <option value="">Semua Level</option>
                  <option value="EASY">Mudah</option>
                  <option value="MEDIUM">Sedang</option>
                  <option value="HARD">Sulit</option>
                </select>
              </div>
            </div>
            <h1 className="text-2xl font-semibold max-md:mt-20 max-md:mb-0 mb-5">
              Ayo Belajar Matematika !
            </h1>
            <div className="flex flex-col w-[90%] 2xl:w-[70%] items-end justify-center">
              <div className="flex flex-row-reverse">
                {verified && recommendation && (
                  <>
                    <select
                      name="rec"
                      id="rec"
                      className="w-[250px] h-[35px] 
                                                              shadow rounded-full border-4 border-orange-500 bg-white leading-tight focus:outline-none 
                                                              focus:shadow-outline appearance-none text-gray-500 font-semibold font-roboto mb-3 text-center 
                                                              text-sm mr-4 cursor-pointer
                                                              max-md:hidden"
                      value={rec}
                      onChange={handleInputChangeRec}
                    >
                      <option value="ALL">Semua Quiz</option>
                      <option value="RECOMMENDED">Quiz Rekomendasi</option>
                    </select>
                  </>
                )}
                <select
                  name="difficulty"
                  id="difficulty"
                  className="w-[250px] h-[35px] 
                                                              shadow rounded-full border-4 border-orange-500 bg-white leading-tight focus:outline-none 
                                                              focus:shadow-outline appearance-none text-gray-500 font-semibold font-roboto mb-3 text-center 
                                                              text-sm mr-4 cursor-pointer
                                                              max-md:hidden"
                  value={difficulty}
                  onChange={handleInputChangeDif}
                >
                  <option value="">Semua Level</option>
                  <option value="EASY">Mudah</option>
                  <option value="MEDIUM">Sedang</option>
                  <option value="HARD">Sulit</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Cari Topik Yang Anda Inginkan ..."
                className="max-md:hidden shadow rounded-full mr-2 px-4 w-full h-[50px] border-4 border-orange-500 leading-tight focus:outline-none focus:shadow-outline appearance-none text-gray-500 font-semibold font-roboto"
                value={keyword}
                onChange={handleInputChange}
              />
            </div>
            {/* Conditional rendering based on loading and error states */}
            {loading ? (
              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2">
                {[...Array(6)].map((_, index) => (
                  <CCard
                    key={index} // tambahkan key prop untuk menghindari warning
                    style={{
                      width: "20rem",
                      height: "auto",
                      border: "0",
                      borderRadius: "15px",
                      boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    className="relative hover:shadow-xl hover:transform hover:translate-x-[10px] hover:translate-y-[30px] hover:border-gray-300 h-full w-full translate-y-10 max-md:max-w-[11rem]"
                  >
                    <div className="h-[250px] max-md:h-[150px] w-auto object-contain pt-3 border-2 rounded-t-2xl border-orange-500 bg-gray-300 animate-pulse"></div>
                    <CCardBody className="h-52 max-md:h-36 flex flex-col border-2 rounded-b-2xl border-orange-500">
                      <div className="h-5">
                        <div className="flex flex-row gap-3">
                          <div className="rounded bg-gray-300 text-center font-roboto font-bold p-1 text-sm text-wrap">
                            <div>
                              <Skeleton width={50} height={15} />
                            </div>
                          </div>
                          <div className="rounded text-center font-roboto font-bold p-1 text-sm text-wrap bg-gray-300">
                            <Skeleton width={40} height={15} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="cursor-pointer">
                          <div className="no-underline text-black h-14">
                            <div className="hover:text-blue-500 transition duration-500 ease-in-out mt-5">
                              <Skeleton width={150} height={20} />
                            </div>
                          </div>
                        </div>
                        <div className="h-5 max-md:hidden">
                          <div className="flex flex-row gap-4 items-center">
                            <div className="text-center font-roboto font-semibold p-1 text-sm text-wrap text-gray-400 flex justify-center items-center gap-1">
                              <Skeleton width={25} height={25} />
                              <Skeleton width={80} height={25} />
                            </div>
                            <div className="text-center font-roboto font-semibold p-1 text-sm text-wrap text-gray-400 flex justify-center items-center gap-1">
                              <Skeleton width={25} height={25} />
                              <Skeleton width={80} height={25} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                ))}
              </div>
            ) : (
              quizData && (
                <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2">
                  {quizData.map((quiz, index) => (
                    <div key={index} className="w-full h-max-[25vh]">
                      <CCard
                        style={{
                          width: "20rem",
                          height: "auto",
                          border: "0",
                          borderRadius: "15px",
                          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        className="relative hover:shadow-xl hover:transform hover:translate-x-[10px] hover:translate-y-[30px] hover:border-gray-300 h-full w-full translate-y-10 max-md:max-w-[11rem]"
                      >
                        <CCardImage
                          alt="image not found"
                          orientation="top"
                          src={quiz.pictureQuiz}
                          className="h-[250px] w-auto object-contain pt-3 border-2 rounded-t-2xl border-orange-500 max-md:h-[150px] cursor-pointer"
                          onClick={() => handleInputDiv(quiz.id)}
                        />
                        {isAdmin == "ROLE_ADMIN" && (
                          <div>
                            <button
                              ref={(el) => (target.current[index] = el)}
                              onClick={() => handleShow(index)}
                              className="absolute right-2 top-2 w-[30px] h-[30px] rounded-full bg-orange-500/80 flex justify-center items-center p-1 text-white"
                            >
                              <BiDotsVertical size={30} />
                            </button>
                            <Overlay
                              target={target.current[index]}
                              show={showIndex === index}
                              placement="right"
                            >
                              {(props) => (
                                <Popover
                                  id={`popover-basic-${index}`}
                                  {...props}
                                >
                                  <Popover.Header as="h3">
                                    Tool Tip
                                  </Popover.Header>
                                  <Popover.Body>
                                    <div className="flex flex-col gap-3">
                                      <button
                                        className="bg-blueHover rounded-lg p-3 font-semibold font-pacifico text-white hover:bg-blue"
                                        onClick={() => {
                                          handleShow(index);
                                          window.location.href = `quiz/draft/detail/${quiz.id}`;
                                        }}
                                      >
                                        Lihat Detail Quiz
                                      </button>
                                      <button
                                        className="bg-amber-600 rounded-lg p-3 font-semibold font-pacifico text-white hover:bg-amber-500"
                                        onClick={() => {
                                          handleShow(index);
                                          window.location.href = `quiz/draft/edit/${quiz.id}`;
                                        }}
                                      >
                                        Edit Quiz
                                      </button>
                                      <button
                                        className="bg-red-600 rounded-lg p-3 font-semibold font-pacifico text-white hover:bg-red-500"
                                        onClick={() => {
                                          handleShow(index);
                                          handleRemoveQuiz(quiz.id);
                                        }}
                                      >
                                        Menghapus Quiz
                                      </button>
                                    </div>
                                  </Popover.Body>
                                </Popover>
                              )}
                            </Overlay>
                          </div>
                        )}
                        <CCardBody className="h-52 max-md:h-36 flex flex-col border-2 rounded-b-2xl border-orange-500">
                          <CCardText className="h-5">
                            <div className="flex flex-row gap-3">
                              <div className="rounded bg-gray-300 text-center font-roboto font-bold p-1 text-sm text-wrap max-md:text-[0.6rem]">
                                {quiz.totalQuestions} Pertanyaan
                              </div>
                              <div
                                className={`rounded text-center font-roboto font-bold p-1 text-sm text-wrap max-md:text-[0.6rem] ${
                                  quiz.difficulty === "HARD"
                                    ? "bg-red-500"
                                    : quiz.difficulty === "MEDIUM"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                }`}
                              >
                                {quiz.difficulty == "EASY"
                                  ? "MUDAH"
                                  : quiz.difficulty == "MEDIUM"
                                  ? "SEDANG"
                                  : "SULIT"}
                              </div>
                            </div>
                          </CCardText>
                          <div className="flex flex-col gap-5">
                            <div
                              onClick={() => handleInputDiv(quiz.id)}
                              className="cursor-pointer"
                            >
                              <div className="no-underline text-black h-14">
                                <CCardTitle className="hover:text-blue-500 transition duration-500 ease-in-out max-md:text-xs">
                                  {quiz.title}
                                </CCardTitle>
                              </div>
                            </div>
                            {loadData ? (
                              <div className="absolute"></div>
                            ) : (
                              <Modal
                                dismissible
                                show={openModal}
                                onClose={() => setOpenModal(true)}
                                className="z-50 bg-black/10 flex justify-center items-center" //
                              >
                                <div
                                  className="absolute w-[60%] bg-white translate-x-[35%] translate-y-[50%] border-4 border-orange-500 rounded-3xl
                              max-md:translate-y-[20%] max-md:w-[100%] max-md:translate-x-[0%]"
                                >
                                  <div className="flex items-start justify-between rounded-t border-b-2 p-5 dark:border-orange-400">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-black">
                                      {quizs?.title}
                                    </h3>
                                  </div>
                                  <Modal.Body>
                                    <div className="space-y-6">
                                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Level Kesulitan:{" "}
                                        {quizs?.difficulty == "EASY"
                                          ? "MUDAH"
                                          : quizs?.difficulty == "MEDIUM"
                                          ? "SEDANG"
                                          : "SULIT"}
                                      </p>
                                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Jumlah Pertanyaan:{" "}
                                        {quizs?.totalQuestions}
                                      </p>
                                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Disukai: {quizs?.likes}
                                      </p>
                                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Total Dimainkan: {quizs?.totalPlays}
                                      </p>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <div
                                      className={`grid gap-3 ${
                                        verified && isAdmin === "ROLE_ADMIN"
                                          ? "grid-cols-4"
                                          : "grid-cols-3"
                                      } w-full max-md:grid-cols-3`}
                                    >
                                      {loadData ? (
                                        <div></div>
                                      ) : quizs?.isTaking ? (
                                        <Button
                                          color="gray"
                                          onClick={() =>
                                            handleMainQuiz(quizs?.id)
                                          }
                                          className="bg-green-500 text-white font-roboto font-semibold items-center"
                                        >
                                          Mainkan Quiz
                                        </Button>
                                      ) : (
                                        <Button
                                          color="gray"
                                          onClick={() =>
                                            handleAmbilQuiz(quizs?.id)
                                          }
                                          className="bg-green-500 text-white font-roboto font-semibold items-center"
                                        >
                                          Ambil Quiz
                                        </Button>
                                      )}
                                      {isAdmin == "ROLE_ADMIN" && (
                                        <Button
                                          color="gray"
                                          onClick={() => {
                                            window.location.href = `/quiz/draft/detail/${quizs?.id}`;
                                          }}
                                          className="bg-blueHover text-white font-roboto font-semibold"
                                        >
                                          Quiz Detail
                                        </Button>
                                      )}
                                      {quizs?.favoritesQuiz ? (
                                        <Button
                                          color="gray"
                                          onClick={() =>
                                            FavoriteQuiz(quizs?.id)
                                          }
                                          className="bg-orange-500 text-white font-roboto font-semibold items-center"
                                        >
                                          Hapus Favorite Quiz
                                        </Button>
                                      ) : (
                                        <Button
                                          color="gray"
                                          onClick={() =>
                                            FavoriteQuiz(quizs?.id)
                                          }
                                          className="bg-orange-500 text-white font-roboto font-semibold items-center"
                                        >
                                          Quiz Favorit
                                        </Button>
                                      )}
                                      <Button
                                        color="gray"
                                        onClick={() => setOpenModal(false)}
                                        className="bg-red-500 text-white font-roboto font-semibold max-md:w-[100%] items-center"
                                      >
                                        Tutup
                                      </Button>
                                    </div>
                                  </Modal.Footer>
                                </div>
                              </Modal>
                            )}

                            <CCardText className="h-5">
                              <div className="flex flex-row gap-1 items-center max-md:relative md:hidden absolute transform -translate-y-11">
                                <div className="text-center font-roboto font-semibold p-1 text-[0.58rem] text-wrap text-gray-400 flex justify-center items-center gap-1">
                                  <CiHeart className="text-sm" />
                                  {quiz.likes} Disukai
                                </div>
                                <div
                                  className={`text-center font-roboto font-semibold p-1 text-[0.58rem] text-wrap text-gray-400`}
                                >
                                  {quiz.totalPlays} Dimainkan
                                </div>
                              </div>

                              <div className="flex flex-row gap-3 items-center max-md:hidden">
                                <div className="text-center font-roboto font-semibold p-1 text-sm text-wrap text-gray-400 flex justify-center items-center gap-1">
                                  <CiHeart className="text-3xl" />
                                  {quiz.likes} Disukai
                                </div>
                                <div
                                  className={`text-center font-roboto font-semibold p-1 text-sm text-wrap text-gray-400`}
                                >
                                  {quiz.totalPlays} Dimainkan
                                </div>
                              </div>
                            </CCardText>
                          </div>
                        </CCardBody>
                      </CCard>
                    </div>
                  ))}
                </div>
              )
            )}
            {error && <p>Error: {error}</p>}
            {load.length % size == 0 && !loading ? (
              <div>
                <button
                  onClick={loadMore}
                  className="mt-20 p-3 bg-orange-500 rounded-lg text-white font-roboto w-56 h-16 text-center flex justify-center items-center"
                >
                  {loadingPart ? (
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
                    <span>Tampilkan Lebih Banyak</span>
                  )}
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
