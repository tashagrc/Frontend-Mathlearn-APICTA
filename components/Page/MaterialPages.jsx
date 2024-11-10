"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Navbar2, Navbar, Footer, NavbarSideMD } from "..";
import { checkToken, getMateri, checkRole } from "../../server/api";
import DOMPurify from "dompurify";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';

const MaterialPages = ({ materialData }) => {
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState(materialData);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [order_by, setOrder] = useState("desc,createdAt");
  const [currentSort, setCurrentSort] = useState("desc");
  const [isAdmin, setIsAdmin] = useState("");
  const [toggleNavbar, setTogle] = useState(false);
  const router = useRouter();

  const handleInputChange = (event) => {
    const newKeyword = event.target.value;
    setKeyword(newKeyword);
    setCurrentPage(0);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleOrder = (q) => {
    if (q == "desc") {
      setOrder("desc,createdAt");
    } else if (q == "asc") {
      setOrder("asc,createdAt");
    } else {
      setOrder("desc,createdAt");
    }
  };

  const get_Materi = useCallback(debounce(async () => {
    setLoading(true);
    const response = await getMateri(keyword, order_by, currentPage);
    setMaterial(response);
    setLoading(false);
  }, 500), [keyword, order_by, currentPage]);

  useEffect(() => {
    get_Materi();
    return () => {
      get_Materi.cancel();
    };
  }, [keyword, order_by, currentPage]);

  useEffect(() => {
    const verifyToken = async () => {
      const isAdm = await checkRole();
      setIsAdmin(isAdm);
    };

    verifyToken();
  }, []);

  const handleclick = async (uri) => {
    router.prefetch(uri);
    window.location.href = uri;
  }

  return (
    <>
      <title>Mathlearn - Semua Materi Matematika</title>

      <div className="flex flex-row">
        <Navbar path={"/materi"} />
        <div className="flex flex-col w-full">
          <div className="max-md:hidden">
            <Navbar2 />
          </div>
          <div className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}>
            <NavbarSideMD
              path={"/materi"}
              setToggle={setTogle}
              toggle={toggleNavbar}
            />
          </div>
          <div className="justify-center items-center flex my-50 flex-col pb-20 max-md:mx-0 w-full">
            <div className="flex items-center md:hidden justify-center flex-col w-full gap-3 px-2">
              <div className="flex w-full mt-8">
                <button
                  className="px-2 pt-3 mb-5 md:hidden"
                  onClick={() => setTogle(!toggleNavbar)}
                >
                  <RxHamburgerMenu className="text-2xl" />
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-md w-full active:outline-none focus:outline-none border-solid border-2 border-gray-400 py-2 pl-3"
                  value={keyword}
                  onChange={handleInputChange}
                />
              </div>

              {isAdmin === "ROLE_ADMIN" && (
                <button
                  className="bg-blue-500 text-white rounded-md py-2 focus:outline-none w-full"
                  style={{ backgroundColor: "#3B82F6" }}
                  onClick={() =>
                    alert(
                      "untuk membuat materi baru, mohon untuk menggunakan versi dekstop atau laptop"
                    )
                  }
                >
                  New +
                </button>
              )}
            </div>
            <div className="w-[90%] max-md:w-full max-md:px-1">
              <div className="relative pb-2 max-md:px-0 w-[100%] border-solid border-4 border-orange-400 rounded-xl bg-gray-100 max-md:mt-10">
                <div className="flex items-center p-3 pl-6 pr-6">
                  <div className="flex flex-1">
                    <button
                      className={`ml-5 mr-5 ${
                        currentSort === "desc" && "font-bold"
                      }`}
                      onClick={() => {
                        handleOrder("desc");
                        setTimeout(() => {
                          setCurrentSort("desc");
                        }, 250);
                      }}
                    >
                      Terbaru hingga Terlama
                    </button>
                    <p>|</p>
                    <button
                      className={`ml-5 mr-5 ${
                        currentSort === "asc" && "font-bold"
                      }`}
                      onClick={() => {
                        handleOrder("asc");
                        setTimeout(() => {
                          setCurrentSort("asc");
                        }, 250);
                      }}
                    >
                      Terlama hingga Terbaru
                    </button>
                  </div>

                  <div className="flex items-center max-md:hidden">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="rounded-full mr-2 px-4"
                      value={keyword}
                      onChange={handleInputChange}
                    />
                    {isAdmin === "ROLE_ADMIN" && (
                      <button
                        className="bg-blue-500 text-white rounded-full pl-2 pr-2 focus:outline-none"
                        style={{ backgroundColor: "#3B82F6" }}
                      >
                        <a href={`/materi/create`} className="block">
                          {" "}
                          New +
                        </a>
                      </button>
                    )}
                  </div>
                </div>

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
                        <div id="h3" className="font-roboto font-bold text-lg">
                          memuat . . .
                        </div>
                      </div>
                    </div>
                  </div>
                ) : material.data.length > 0 ? (
                  material.data.map((item, index) => (
                    <div
                      key={item.id}
                      className="block cursor-pointer"
                      onClick={() => {handleclick(`/materi/${item.id}`)}}
                    >
                      <div
                        key={index}
                        className="bg-white p-5 border-b border-gray-300 flex flex-row justify-between text-black w-full"
                      >
                        <div className="flex items-center justify-between py-5 w-[80%]">
                          <div className="flex flex-grow">
                            <div className="flex flex-col ml-5">
                              <p className="mr-10 font-bold">{item.title}</p>
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

                        <div className="flex items-center justify-between w-[20%]">
                          <div className="border-gray-300 flex flex-wrap justify-center items-center text-left">
                            <p>
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
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-5 border-b border-gray-300 text-center">
                    No Search Results Found
                  </div>
                )}
                <div className="flex justify-center items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 sm:flex m-2">
                  <div className="space-x-1">
                    <button
                      title="previous"
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow"
                      onClick={goToPreviousPage}
                      disabled={currentPage <= 0}
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
                    <span className="inline-flex items-center justify-center w-24">
                      Halaman {currentPage + 1} dari{" "}
                      {material ? material.totalPages + 1 : 1}
                    </span>
                    <button
                      title="next"
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow"
                      onClick={goToNextPage}
                      disabled={currentPage >= material.totalPages}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialPages;
