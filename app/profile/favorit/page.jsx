"use client";
import React, { useState, useEffect } from "react";
import { Navbar2, Tab, Navbar, NavbarSideMD } from "../../../components";
import {
  checkToken,
  favoriteQuiz,
  takeQuiz,
  getUserFavMateri,
} from "../../../server/api";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import "./style.css";
import DOMPurify from "dompurify";

const Favorite = () => {
  const [loading, setLoading] = useState(true);
  const [loadingFav, setLoadingFav] = useState(true);
  const [favorite, setFavorite] = useState(null);
  const [favoriteMaterial, setFavoriteMaterial] = useState(null);
  const [currFav, setCurrFav] = useState("quiz");
  const [toggleNavbar, setTogle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [items, setItem] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const getfavoriteQuiz = async () => {
    const response = await favoriteQuiz();
    setFavorite(response);
    setLoading(false);
  };

  const fetchMaterialFav = async () => {
    try {
      const response = await getUserFavMateri(currentPage);
      setFavoriteMaterial(response.data);
      setMaxPage(response.totalPages + 1);
      setLoadingFav(false);
    } catch (error) {
      console.error("Error fetching material content:", error.message);
    }
  };

  useEffect(() => {
    Promise.all([fetchMaterialFav(), getfavoriteQuiz()])
      .then(([materialFavResult, favoriteQuizResult]) => {
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((nextPage) => Math.min(maxPage - 1, nextPage + 1));
  };

  const quizzesWithUserQuizs = favorite?.filter((quiz) => quiz.userQuizs);

  const quizzesWithoutUserQuizs = favorite?.filter((quiz) => !quiz.userQuizs);

  const handleMainQuiz = (id) => {
    setLoadingModal(true);
    window.location.href = `/quiz/${id}`;
  };

  const handleAmbilQuiz = async (id) => {
    setLoadingModal(true);
    try {
      await takeQuiz(id);
      window.location.href = `/quiz/${id}`;
      setLoadingModal(false);
    } catch (error) {
      console.error("Error take quiz:", error);
      setLoadingModal(false);
    }
  };

  const FavQuiz = (items) => {
    items.userQuizs ? handleMainQuiz(items.id) : handleAmbilQuiz(items.id);
  };

  const renderQuizItem = (item, index) => (
    <>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(true)}
        className="z-50 bg-black/10 flex justify-center items-center" //
      >
        <div className="absolute w-[25%] bg-white translate-x-[150%] translate-y-[90%] border-4 border-orange-500 rounded-3xl max-md:w-[100%] max-md:-translate-x-[0%]">
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {items?.userQuizs ? "Mainkan Quiz" : "Ambil Quiz"}
              </h3>
            </div>
          </Modal.Body>

          <Modal.Footer className="flex justify-center gap-5">
            <Button
              onClick={() => {
                setOpenModal(false);
                FavQuiz(items);
              }}
              className="bg-red-500"
            >
              {items?.userQuizs ? "Iya, Mainkan Quiz" : "Iya, Ambil Quiz"}
            </Button>
            <Button
              className="bg-gray-500 text-white"
              onClick={() => setOpenModal(false)}
            >
              Tidak, kembali
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <div
        key={item.id}
        className="block cursor-pointer"
        onClick={() => {
          setItem(item);
          setOpenModal(true);
        }}
      >
        <div
          key={index}
          className="bg-white p-5 border-b border-gray-300 flex flex-row justify-start w-full"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex justify-between items-center">
              <img
                src={item.pictureQuiz}
                alt="Quiz Image"
                className="self-center flex-shrink-0 w-24 h-24 rounded-full md:justify-self-start object-center object-cover"
              />
              <span className="font-bold max-md:w-full max-md:mr-0 2xl:hidden pl-5">
                {item.title.length > 30
                  ? `${item.title.substring(0, 38)}...`
                  : item.title}
              </span>
              <span className="font-bold max-md:w-full max-md:mr-0 max-2xl:hidden pl-5">
                {item.title.length > 150
                  ? `${item.title.substring(0, 150)}...`
                  : item.title}
              </span>
            </div>
            <div className="flex justify-end max-md:hidden">
              <span
                className={`mr-4 px-6 py-2 rounded-3xl font-bold max-md:mr-0 max-md:w-full max-md:rounded-lg ${
                  item.difficulty === "HARD"
                    ? "bg-red-500"
                    : item.difficulty === "MEDIUM"
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
              >
                {item.difficulty === "HARD"
                  ? "SULIT"
                  : item.difficulty === "MEDIUM"
                  ? "SEDANG"
                  : "MUDAH"}
              </span>
              <span className="mr-4 px-6 py-2 rounded-3xl font-bold bg-grey max-md:mr-0 max-md:w-full max-md:rounded-lg">
                {item.totalQuestions} Pertanyaan
              </span>
              <span className="mr-4 px-6 py-2 rounded-3xl font-bold bg-grey max-md:mr-0 max-md:w-full max-md:rounded-lg">
                {item.totalPlays} Dimainkan{" "}
              </span>
              <span className="mr-4 px-6 py-2 rounded-3xl font-bold bg-grey max-md:mr-0 max-md:w-full max-md:rounded-lg">
                {item.likes} Suka
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <title>Mathlearn - Profil Pengguna - Favorit Quiz</title>
      {loadingModal && (
        <div className="h-full w-full bg-black/60 z-50 fixed">
          <div id="page" className="mt-[25%] mb-[25%] max-md:mt-[100%]">
            <div className="flex items-center justify-center relative">
              <div id="ring"></div>
              <div id="ring"></div>
              <div id="ring"></div>
              <div id="ring"></div>
              <div id="h3-load" className="font-roboto font-medium text-xl">
                memuat . . .
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
          </div>
          <div className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}>
            <NavbarSideMD
              path={"/profile"}
              setToggle={setTogle}
              toggle={toggleNavbar}
            />
          </div>
          <div className="w-full justify-center items-center flex my-2 mb-20 flex-col max-md:ml-0 max-md:px-3 max-md:my-5">
            <div className="md:hidden w-full px-3 mb-5">
              <button
                className="p-0 ml-1"
                onClick={() => setTogle(!toggleNavbar)}
              >
                <RxHamburgerMenu className="text-2xl" />
              </button>
            </div>
            <div className="w-[90%] max-md:w-full">
              <Tab path={"/profile/favorit"} />
              <div className="relative mt-10 pb-2 border-solid border-4 border-orange-400 rounded-xl bg-gray-100">
                <div className="flex items-center p-3 pl-6 pr-6">
                  <div className="flex flex-1">
                    <button
                      className={`mr-5 ${currFav === "quiz" && "font-bold"}`}
                      onClick={() => {
                        setCurrFav("quiz");
                      }}
                      disabled={loading}
                    >
                      Quiz Favorit
                    </button>
                    <p>|</p>
                    <button
                      className={`ml-5 mr-5 ${
                        currFav === "material" && "font-bold"
                      }`}
                      onClick={() => {
                        setCurrFav("material");
                      }}
                      disabled={loadingFav}
                    >
                      Materi Favorit
                    </button>
                  </div>
                </div>
                {currFav === "quiz" ? (
                  loading ? (
                    <div className="h-screen w-full relative">
                      <div
                        id="page"
                        className="mt-[25%] mb-[25%] max-md:mt-[100%]"
                      >
                        <div className="flex items-center justify-center relative">
                          <div id="ring"></div>
                          <div id="ring"></div>
                          <div id="ring"></div>
                          <div id="ring"></div>
                          <div
                            id="h3"
                            className="font-roboto font-medium text-l"
                          >
                            loading . . .
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : favorite.length > 0 ? (
                    <>
                      <div className="gap-5 flex flex-col">
                        <div className="p-3 pl-6 pr-6">
                          <h2 className="font-bold mb-4">Sudah Dimainkan</h2>
                          {quizzesWithUserQuizs.length > 0 ? (
                            quizzesWithUserQuizs.map(renderQuizItem)
                          ) : (
                            <div className="bg-white p-10 border-b border-gray-300 text-center font-bold font-roboto">
                              Tidak Ada Quiz Favorit Yang Sudah Dimainkan
                            </div>
                          )}
                        </div>
                        <div className="p-3 pl-6 pr-6">
                          <h2 className="font-bold mb-4">Belum Dimainkan</h2>
                          {quizzesWithoutUserQuizs.length > 0 ? (
                            quizzesWithoutUserQuizs.map(renderQuizItem)
                          ) : (
                            <div className="bg-white p-10 border-b border-gray-300 text-center font-bold font-roboto">
                              Tidak Ada Quiz Favorit Yang Belum Dimainkan
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white p-10 border-b border-gray-300 text-center font-bold font-roboto">
                      <span>Tidak Ada Quiz Yang Difavoritkan</span>
                    </div>
                  )
                ) : (
                  <div>
                    {loadingFav ? (
                      <div className="h-screen w-full relative">
                        <div
                          id="page"
                          className="mt-[25%] mb-[25%] max-md:mt-[100%]"
                        >
                          <div className="flex items-center justify-center relative">
                            <div id="ring"></div>
                            <div id="ring"></div>
                            <div id="ring"></div>
                            <div id="ring"></div>
                            <div
                              id="h3"
                              className="font-roboto font-bold text-lg"
                            >
                              memuat . . .
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : favoriteMaterial.length > 0 ? (
                      favoriteMaterial.map((item, index) => (
                        <a
                          key={item.id}
                          className="block"
                          href={`/materi/${item.id}`}
                        >
                          <div
                            key={index}
                            className="bg-white p-5 border-b border-gray-300 flex flex-row justify-between text-black"
                          >
                            <div className="flex items-center justify-between py-5">
                              <div className="flex flex-grow">
                                <div className="flex flex-col ml-5">
                                  <p className="mr-10 font-bold">
                                    {item.title}
                                  </p>
                                  <p className="mr-10">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                          item.description,
                                          {
                                            USE_PROFILES: {
                                              html: true,
                                              svg: true,
                                              mathMl: true,
                                            },
                                          }
                                        ),
                                      }}
                                    />
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-5">
                              <div className="border-gray-300 text-center flex flex-wrap justify-center items-center">
                                <p className="mr-10 ">
                                  Dibuat pada:{" "}
                                  {new Date(item.createdAt)
                                    .toLocaleDateString("en-EN", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                    })
                                    .replace("at", "")
                                    .replace("PM", "")
                                    .replace("AM", "")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="bg-white p-10 border-b border-gray-300 text-center font-roboto font-bold">
                        <span>Tidak Ada Materi Yang Difavoritkan</span>
                      </div>
                    )}
                    {/* Pagination */}
                    {favoriteMaterial.length > 0 && (
                      <div className="flex justify-center items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 sm:flex m-2">
                        <div className="space-x-1">
                          <button
                            title="previous"
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow"
                            onClick={goToPreviousPage}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4"
                            >
                              <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                          </button>
                          <span className="inline-flex items-center justify-center w-32">
                            Halaman {currentPage + 1} dari {maxPage}
                          </span>
                          <button
                            title="next"
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow"
                            onClick={goToNextPage}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4"
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorite;
