"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Footer, Navbar2, NavbarSideMD } from "../../components";
import { timeAgo } from "../../server/utils";
import { getForum, checkToken } from "../../server/api";
import { RxHamburgerMenu } from "react-icons/rx";
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';

const ForumPages = ({ forumData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState(forumData);

  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [order_by, setOrder] = useState("desc,likes");
  const [currentSort, setCurrentSort] = useState("likes");
  const [toggleNavbar, setTogle] = useState(false);

  // const hrefCreate = checkToken() ? '/login' : '/forum/create';
  const [hrefCreate, setHrefCreate] = useState(false);

  const validateToken = async () => {
    const isValid = await checkToken();
    setHrefCreate(isValid ? "/forum/create" : "/login");
  };

  const fetchForumContent = useCallback(debounce(async () => {
    try {
      setLoading(true);
      const response = await getForum(keyword, currentPage, order_by);
      // const data =  response;
      setContent(response.data);
      setMaxPage(response.totalPages + 1);
      // Assuming 'data.number' represents the current page number
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forum content:", error.message);
      setLoading(false);
    }
  }, 500), [keyword, order_by, currentPage]);

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    fetchForumContent();
    return () => {
      fetchForumContent.cancel();
    };
  }, [keyword, order_by, currentPage]);

  // Function to handle input change
  const handleInputChange = (event) => {
    const newKeyword = event.target.value;
    setKeyword(newKeyword); // Update keyword state with the input value
  };

  const handleOrder = (q) => {
    if (q == "desc") {
      setOrder("desc,createdAt");
    } else if (q == "asc") {
      setOrder("asc,createdAt");
    } else if (q == "likes") {
      setOrder("desc,likes");
    } else {
      setOrder("desc,createdAt");
    }
  };

  const goToPreviousPage = () => {
    // Ensure currentPage doesn't go below 0
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((nextPage) => Math.min(maxPage - 1, nextPage + 1));
  };

  const handleclicknav = async (uri) => {
    router.prefetch(uri);
    window.location.href = uri;
  }

  return (
    <>
      <title>Mathlearn - Semua Forum Matematika</title>

      <div>
        <div className="flex flex-row">
          <Navbar path={"/forum"} />
          <div className="flex flex-col w-full">
            <div className="max-md:hidden">
              <Navbar2 />
            </div>
            <div
              className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}
            >
              <NavbarSideMD
                path={"/dashboard"}
                setToggle={setTogle}
                toggle={toggleNavbar}
              />
            </div>
            <div className="md:hidden w-[90%] mt-3">
              <button
                className="p-0 ml-1"
                onClick={() => setTogle(!toggleNavbar)}
              >
                <RxHamburgerMenu className="text-2xl" />
              </button>
            </div>
            <div className="justify-center items-center flex my-3 mb-32 flex-col gap-3">
              <div className="flex items-center flex-col-reverse w-full md:hidden gap-3 focus:outline-none">
                <input
                  type="text"
                  placeholder="Cari Forum . . ."
                  className="rounded-md px-4 py-2 w-[90%] focus:outline-orange-500 active:outline-orange-500 border-2 border-gray-300"
                  value={keyword}
                  onChange={handleInputChange}
                />

                <button
                  className="bg-blue-500 text-white py-2 rounded-md focus:outline-none w-[90%]"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  <a href={hrefCreate} className="block">
                    {" "}
                    Baru +
                  </a>
                </button>
              </div>
              <div
                className="w-[90%] border-solid border-4 rounded-xl bg-gray-100 pb-2"
                style={{
                  borderColor: "#E3820E",
                  borderWidth: "4px",
                  borderStyle: "solid",
                }}
              >
                {/* (sortir) mungkin perlu dipindahin ke component */}
                <div className="flex items-center p-3 pl-6 pr-6">
                  {/* Left side */}
                  <div className="flex flex-1">
                    <button
                      className={`mr-5 ${
                        currentSort === "likes" && "font-bold"
                      }`}
                      onClick={() => {
                        handleOrder("likes");
                        setCurrentSort("likes");
                      }}
                    >
                      Suara Terbanyak
                    </button>
                    <p>|</p>
                    <button
                      className={`ml-5 mr-5 ${
                        currentSort === "asc" && "font-bold"
                      }`}
                      onClick={() => {
                        handleOrder("asc");
                        setCurrentSort("asc");
                      }}
                    >
                      Terlama hingga Terbaru
                    </button>
                    <p>|</p>
                    <button
                      className={`ml-5 ${
                        currentSort === "desc" && "font-bold"
                      }`}
                      onClick={() => {
                        handleOrder("desc");
                        setCurrentSort("desc");
                      }}
                    >
                      Terbaru hingga Terlama
                    </button>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center max-md:hidden">
                    <input
                      type="text"
                      placeholder="Cari Forum . . ."
                      className="rounded-full mr-2 px-4"
                      value={keyword}
                      onChange={handleInputChange}
                    />

                    <button
                      className="bg-blue-500 text-white rounded-full pl-2 pr-2 focus:outline-none"
                      style={{ backgroundColor: "#3B82F6" }}
                    >
                      <a href={hrefCreate} className="block">
                        {" "}
                        Baru +
                      </a>
                    </button>
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
                        <div
                          id="h3"
                          className="font-roboto font-medium text-lg"
                        >
                          memuat . . .
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {content.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => {handleclicknav(`/forum/${item.id}`)}}
                        className="block cursor-pointer"
                      >
                        <div
                          key={index}
                          className="bg-white p-5 border-b border-gray-300 relative"
                        >
                          <div className="flex max-md:flex-col items-center justify-between">
                            <div className="flex w-full">
                              <img
                                src={
                                  item.userForumDTO.imageAvatar
                                    ? item.userForumDTO.imageAvatar
                                    : "/profil.png"
                                }
                                alt="Image avatar"
                                className="self-center flex-shrink-0 w-24 h-24 object-cover object-center border rounded-full md:justify-self-start dark:border-gray-300"
                              />
                              <div className="flex flex-col ml-5 w-[80%]">
                                <h4 className="text-lg font-semibold mt-5">
                                  <span
                                    style={{
                                      wordBreak: "break-all",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {item.forumTitle.length > 100 ? `${item.forumTitle.substring(0, 100)}...` : item.forumTitle}
                                  </span>
                                  {item.isEdited && (
                                    <span className="ml-2 text-sm text-gray-500">
                                      (Telah Diubah)
                                    </span>
                                  )}
                                </h4>
                                <p className="dark:text-gray-600">
                                  {item.userForumDTO.name} dibuat :{" "}
                                  {timeAgo(item.createdAt)}
                                </p>
                              </div>
                            </div>

                            {/* Views and Likes */}
                            <div className="flex w-[30%] max-md:w-full items-center justify-between">
                              <div className="max-md:ml-[35%] flex justify-center items-center gap-3">
                                <img
                                  src="/images/view.png"
                                  className="w-5 h-5 filter grayscale"
                                />
                                <div className="viewsText text-gray-500 text-lg font-roboto">
                                  {item.views}
                                </div>
                              </div>
                              <div className="flex justify-center items-center gap-3 mr-16 max-md:mr-0">
                                <img
                                  src="/images/arrow-up.png"
                                  className="w-5 h-5 filter grayscale"
                                />
                                <div className="viewsText text-gray-500 text-lg font-roboto">
                                  {item.likes - item.dislikes}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Pagination */}
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

export default ForumPages;
