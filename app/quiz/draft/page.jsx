"use client";
import React, { useEffect, useState } from "react";
import { Navbar2, Navbar, NavbarSideMD } from "../../../components";
import { getQuizDraft, checkRole, checkToken } from "../../../server/api";
import { FaList } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { GiBookshelf } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import "./style.css";

const DraftQuiz = () => {
  const [verif, setVerif] = useState(false);
  const [quizDraft, setQuizDraft] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const getQuizDraftData = async () => {
      const quiz = await getQuizDraft();
      setQuizDraft(quiz);
      setLoading(false);
    };

    getQuizDraftData();
  }, []);

  function getDateDiff(createdDate, currentDate) {
    var diff = currentDate.getTime() - createdDate.getTime();
    var oneDay = 24 * 60 * 60 * 1000;
    var oneWeek = 7 * oneDay;
    var oneMonth = 30 * oneDay;

    if (diff > oneMonth) {
      var months = Math.floor(diff / oneMonth);
      return months > 1 ? months + " months" : "Bulan lalu";
    } else if (diff > oneWeek) {
      var weeks = Math.floor(diff / oneWeek);
      return weeks > 1 ? weeks + " weeks" : "Minggu lalu";
    } else if (diff > oneDay) {
      var days = Math.floor(diff / oneDay);
      return days > 1 ? days + " days" : "Kemarin";
    } else {
      return "Kurang dari sehari yang lalu";
    }
  }

  return (
    <>
      <title>Mathlearn - Draft Quiz</title>
      {!verif ? (
        <div></div>
      ) : (
        <div className="w-full h-full">
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
                <RxHamburgerMenu className="text-2xl md:hidden" />
              </button>
              <div className="justify-center items-center flex flex-col mb-40">
                <div className="w-[90%] max-md:w-full max-md:px-1">
                  <div className="max-md:mt-5 w-full border-solid border-4 border-orange-400 rounded-xl bg-gray-100">
                    {loading ? (
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
                              className="font-roboto font-medium text-lg"
                            >
                              memuat . . .
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : quizDraft.length > 0 ? (
                      quizDraft.map((item, index) => (
                        <a
                          key={index}
                          href={`/quiz/draft/detail/${item.id}`}
                          className="block my-2"
                        >
                          <div className="bg-white hover:bg-gray-100 p-5 border-b border-gray-300 flex flex-row">
                            <div className="flex items-center">
                              <div>
                                <img
                                  src={item.pictureQuiz}
                                  alt="Gambar Quiz"
                                  className="w-[200px] h-[200px] object-contain"
                                ></img>
                              </div>
                              <div className="flex flex-grow max-md:scale-90">
                                <div className="flex flex-col ml-5 justify-between">
                                  <div className="flex flex-row font-roboto font-semibold">
                                    <div className="mr-5 bg-gray-300 p-1 px-5 rounded-xl">
                                      <p>QUIZ</p>
                                    </div>
                                    <div
                                      className={`mr-5 p-1 px-5 rounded-xl ${
                                        item.difficulty === "EASY"
                                          ? "bg-green-500"
                                          : item.difficulty === "MEDIUM"
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                      }`}
                                    >
                                      <p>
                                        {item.difficulty === "EASY"
                                          ? "MUDAH"
                                          : item.difficulty === "MEDIUM"
                                          ? "SEDANG"
                                          : "SULIT"}
                                      </p>
                                    </div>
                                    <div className="p-1 px-5 rounded-xl bg-yellow">
                                      <p>DRAFT</p>
                                    </div>
                                  </div>
                                  <a className="mr-10 font-bold font-roboto text-lg my-3">
                                    {item.title}
                                  </a>
                                  <div className="flex flex-row items-center mt-1">
                                    <div className="flex flex-row items-center mr-3">
                                      <FaList className="mr-1" />
                                      <div className="flex text-sm font-shojumaru font-semibold">
                                        <p>
                                          {`${item.totalQuestions} Pertanyaan`}
                                        </p>
                                      </div>
                                    </div>
                                    <GiGraduateCap className="mr-3" />
                                    <GiBookshelf />
                                  </div>
                                  <div className="mt-10 flex flex-row justify-between">
                                    <a className="font-shojumaru font-light text-xs text-gray-400">
                                      {getDateDiff(
                                        new Date(item.createdAt),
                                        new Date()
                                      )}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="bg-white p-5 border-b border-gray-300 text-center">
                        Tidak ada quiz di draft
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DraftQuiz;
