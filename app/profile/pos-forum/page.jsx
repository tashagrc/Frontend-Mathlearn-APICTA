"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar2,
  Tab,
  Navbar,
  Footer,
  NavbarSideMD,
} from "../../../components";
import { checkToken, getUserQuiz } from "../../../server/utils";
import { timeAgo } from "../../../server/utils";
import { getForumByUserId } from "../../../server/api";
import "./style.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { debounce } from 'lodash';

const PostForum = () => {
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [order_by, setOrder] = useState("desc,likes");
  const [currentSort, setCurrentSort] = useState("likes");

  const [toggleNavbar, setTogle] = useState(false);

  const fetchForumContent = useCallback(debounce(async () => {
    try {
      setLoading(true);
      const response = await getForumByUserId(currentPage, order_by, keyword);
      setContent(response.data);
      setMaxPage(response.totalPages + 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forum content:", error.message);
      setLoading(false);
    }
  }, 500), [keyword, order_by, currentPage]);

  useEffect(() => {
    fetchForumContent();
    return () => {
      fetchForumContent.cancel();
    };
  }, [keyword, order_by, currentPage, fetchForumContent]);

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

  return (
    <>
      <title>Mathlearn - Profil Pengguna - Forum</title>
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
              <Tab path={"/profile/pos-forum"} />
            </div>
            <button
              className="bg-blue-500 text-white rounded-md mr-2 px-4 md:hidden border-[4px] border-transparent mb-3 w-full mx-3 py-2 active:outline-none focus:outline-none"
              style={{ backgroundColor: "#3B82F6" }}
            >
              <a href={`/forum/create`} className="block">
                {" "}
                Baru +
              </a>
            </button>
            <input
              type="text"
              placeholder="Cari Forum . . ."
              className="rounded-md mr-2 px-4 md:hidden border-[4px] border-orange-400 mb-3 w-full mx-3 py-2 active:outline-none focus:outline-none"
              value={keyword}
              onChange={handleInputChange}
            />
            <div
              // className="absolute inset-x-1/2 mt-20 pb-2 transform -translate-x-1/2 w-[75%] border-solid border-4 border-orange-400 rounded-xl bg-gray-100"
              className="w-[90%] max-md:w-full border-solid border-4 rounded-xl bg-gray-100 pb-2"
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
                    className={`mr-5 ${currentSort === "likes" && "font-bold"}`}
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
                    className={`ml-5 ${currentSort === "desc" && "font-bold"}`}
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
                    className="rounded-full mr-2 px-4 active:outline-none focus:outline-none"
                    value={keyword}
                    onChange={handleInputChange}
                  />

                  <button
                    className="bg-blue-500 text-white rounded-full pl-2 pr-2 focus:outline-none"
                    style={{ backgroundColor: "#3B82F6" }}
                  >
                    <a href={`/forum/create`} className="block">
                      {" "}
                      Baru +
                    </a>
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="h-full w-full relative">
                  <div
                    id="page"
                    className="mt-[25%] mb-[25%] max-md:mt-[100%] max-md:mb-[100%]"
                  >
                    <div className="flex items-center justify-center relative">
                      <div id="ring"></div>
                      <div id="ring"></div>
                      <div id="ring"></div>
                      <div id="ring"></div>
                      <div id="h3" className="font-roboto font-bold text-lg">
                        loading . . .
                      </div>
                    </div>
                  </div>
                </div>
              ) : content?.length > 0 ? (
                content?.map((item, index) => (
                  <a key={item.id} href={`/forum/${item.id}`} className="block">
                    <div
                      key={index}
                      className="bg-white p-5 border-b border-gray-300 relative"
                    >
                      <div className="flex items-center justify-start max-md:flex-col">
                        <div className="flex flex-grow w-full">
                          <img
                            src={
                              item.userId.imageAvatar
                                ? item.userId.imageAvatar
                                : "/profil.png"
                            }
                            alt="Image avatar"
                            className="self-center flex-shrink-0 w-24 h-24 object-cover object-center border rounded-full md:justify-self-start dark:border-gray-300"
                          />
                          <div className="flex flex-col ml-5">
                            <h4
                              className="text-lg max-md:text-base font-semibold mt-5"
                              style={{
                                wordBreak: "break-all",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {item.forumTitle}
                            </h4>
                            <p className="dark:text-gray-600 max-md:text-sm">
                              {item.userId.name} dibuat :{" "}
                              {timeAgo(item.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Views and Likes */}
                        <div className="flex w-1/2 justify-around max-md:justify-between max-md:gap-24 max-md:ml-16">
                          <div className="flex justify-start items-center gap-3">
                            <img
                              src="/images/view.png"
                              className="w-5 h-5 filter grayscale"
                            />
                            <div className="viewsText text-gray-500 text-lg font-roboto">
                              {item.views}
                            </div>
                          </div>
                          <div className="flex justify-start items-center gap-3">
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
                  </a>
                ))
              ) : (
                <div className="bg-white p-10 border-b border-gray-300 text-center font-roboto font-bold">
                  <span>Kamu Belum Memposting Forum Apapun</span>
                </div>
              )}
              {/* Pagination */}
              {content?.length > 0 && (
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
          </div>
        </div>
      </div>
    </>
  );
};

export default PostForum;
