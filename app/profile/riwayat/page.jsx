"use client";

import React, { useState, useEffect } from "react";
import { Navbar2, Tab, Navbar, NavbarSideMD } from "../../../components";
import { checkToken, getUserQuiz } from "../../../server/api";
import { useRouter } from "next/navigation";
import "./style.css";
import { RxHamburgerMenu } from "react-icons/rx";

const Riwayat = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [loadingContinue, setLoadingContinue] = useState(false);
  const [id, setId] = useState("");
  const [checkContinue, setCheckContinue] = useState(false);
  const router = useRouter();
  const [toggleNavbar, setTogle] = useState(false);

  useEffect(() => {
    if (id && checkContinue) {
      router.prefetch(`/quiz/${id}`);
    } else {
      router.prefetch(`/profile/riwayat/answer/${id}`);
    }
  }, [router, id]);

  useEffect(() => {
    const getUserQuizData = async () => {
      const response = await getUserQuiz();
      setTableData(response);
      setLoading(false);
    };

    getUserQuizData();
  }, []);

  const handleContinueQuiz = async (id) => {
    setLoadingContinue(true);
    try {
      router.push(`/quiz/${id}`);
    } catch (error) {
      alert("Failed to navigate:", error);
    } finally {
      setLoadingContinue(false);
    }
  };

  const handleAnswerDetailQuiz = async (id) => {
    setLoadingContinue(true);
    try {
      window.location.href = `/profile/riwayat/answer/${id}`;
    } catch (error) {
      alert("Failed to navigate:", error);
    } finally {
      setLoadingContinue(false);
    }
  };

  return (
    <>
      <title>Mathlearn - Profil Pengguna - Riwayat Quiz</title>

      <div className="flex flex-row">
        {loadingContinue && (
          <div className="h-full w-full bg-black/60 z-50 fixed">
            <div id="page" className="mt-[25%] mb-[25%] ab">
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

        <div className="md:hidden mt-7"></div>
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
          <div className="justify-center items-center flex my-2 mb-20 flex-col max-md:my-5">
            <div className="md:hidden w-full px-3 mb-5">
              <button
                className="p-0 ml-1"
                onClick={() => setTogle(!toggleNavbar)}
              >
                <RxHamburgerMenu className="text-2xl" />
              </button>
            </div>
            <div className="w-[90%] max-md:w-full max-md:px-3">
              <Tab path={"/profile/riwayat"} />
              {loading ? (
                <div>
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-orange-200 text-gray-600">
                        <th className="px-4 py-3 text-left">Nama Kuis</th>
                        <th className="px-4 py-3 text-left">Skor</th>
                        <th className="px-4 py-3 text-left max-md:hidden">
                          Akurasi
                        </th>
                        <th className="px-4 py-3 text-left max-md:hidden">
                          Jawaban Benar
                        </th>
                        <th className="px-4 py-3 text-left max-md:hidden">
                          Jawaban Salah
                        </th>
                        <th className="px-4 py-3 text-left max-md:hidden">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left max-md:hidden">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left">Aksi</th>
                      </tr>
                    </thead>
                    {[...Array(6)].map((_, index) => (
                      <tbody>
                        <tr className="bg-orange-300 animate-pulse">
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3"></td>
                        </tr>
                        <tr className="bg-orange-300 animate-pulse">
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3"></td>
                        </tr>
                        <tr className="bg-orange-300 animate-pulse">
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3 max-md:hidden"></td>
                          <td className="px-4 py-3"></td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              ) : (
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="px-4 py-3 text-left border-2 border-orange-600">
                        Nama Kuis
                      </th>
                      <th className="px-4 py-3 text-left border-2 border-orange-600">
                        Skor
                      </th>
                      <th className="px-4 py-3 text-left max-md:hidden border-2 border-orange-600">
                        Akurasi
                      </th>
                      <th className="px-4 py-3 text-left max-md:hidden border-2 border-orange-600">
                        Jawaban Benar
                      </th>
                      <th className="px-4 py-3 text-left max-md:hidden border-2 border-orange-600">
                        Jawaban Salah
                      </th>
                      <th className="px-4 py-3 text-left max-md:hidden border-2 border-orange-600">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left max-md:hidden border-2 border-orange-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left border-2 border-orange-600">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="border-2 border-orange-500 ">
                    {tableData?.map((row, index) => (
                      <tr
                        key={index}
                        className="border-bottom border-orange-500 hover:bg-orange-200 border-2"
                      >
                        <td className="px-4 py-3 text-left border-2 border-orange-500 w-96">
                          {row.title}
                        </td>
                        <td className="px-4 py-3 text-center border-2 border-orange-500">
                          {row.userQuizs[0].scores}
                        </td>
                        <td className="px-4 py-3 text-center border-2 border-orange-500 max-md:hidden">
                          {row.userQuizs[0].percentage}%
                        </td>
                        <td className="px-4 py-3 text-center border-2 border-orange-500 max-md:hidden">
                          {row.userQuizs[0].correctAnswer}
                        </td>
                        <td className="px-4 py-3 text-center border-2 border-orange-500 max-md:hidden">
                          {row.totalQuestions - row.userQuizs[0].correctAnswer}
                        </td>
                        <td className="px-4 py-3 text-center border-2 border-orange-500 w-48 max-md:hidden">
                          {" "}
                          {new Date(
                            row.userQuizs[0].createdAt
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td
                          className={`px-4 py-3 text-center border-2 border-orange-500 font-semibold font-roboto max-md:hidden ${
                            row.userQuizs[0].isFinish
                              ? "text-green-500"
                              : "text-red-500"
                          }  w-36`}
                        >
                          {row.userQuizs[0].isFinish
                            ? "Selesai"
                            : "Belum Selesai"}
                        </td>
                        <td
                          className={`px-4 py-3 text-center border-2 border-orange-500 font-semibold font-roboto text-white w-48`}
                        >
                          {row.userQuizs[0].isFinish ? (
                            <>
                              <button
                                className="bg-green-500 rounded-lg p-3 w-44 max-md:w-36"
                                onClick={() => {
                                  setCheckContinue(false);
                                  setId(row.id);
                                  handleAnswerDetailQuiz(row.id);
                                }}
                              >
                                Lihat Detail Quiz
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="bg-orange-500 rounded-lg p-3 w-44 max-md:w-36"
                                onClick={() => {
                                  setCheckContinue(true);
                                  setId(row.id);
                                  handleContinueQuiz(row.id);
                                }}
                              >
                                Lanjutkan Quiz
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {
                (tableData.length <= 0 && !loading) && (<div className="flex justify-center items-center text-center p-10 w-full font-roboto font-semibold border-2 border-orange-500"><span>Anda belum memainkan quiz apapun</span></div>)
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Riwayat;
