"use client";

import React, { useState, useEffect, memo, useRef } from "react";
import { Navbar, Navbar2, Footer, NavbarSideMD } from "../../../components";
import {
  updateDislike,
  updateLike,
  getRatings,
  updateForumViews,
  checkToken,
  fetchComments,
  checkUser,
  checkRole,
} from "../../../server/api";
import ForumPostDisplay from "./ForumPostDisplay";
import CommentSection from "./CommentSection";
import { CommentSectionSkeleton } from "../../../components";
import { RxHamburgerMenu } from "react-icons/rx";
import "./style.css";

const ForumPost = ({ params }) => {
  const [postData, setPostData] = useState(null);
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [initialComments, setInitialComments] = useState([]);
  const fetchedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [loadingMain, setLoadingMain] = useState(true);
  const [toggleNavbar, setTogle] = useState(false);
  const [checkIsUserAuth, setCheckIsUser] = useState("");
  const [checkIsAdminAuth, setCheckIsAdmin] = useState("");
  const [verifUser, setVerify] = useState(false);

  async function fetchData(params) {
    try {
      let response = await fetch(
        `https://mathlearns.my.id/mathlearns-web-service/forum/id?id=${params.id}`
      );
      let data = await response.json();
      setPostData(data);
      fetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getRating() {
    if (postData) {
      // Check if postData is truthy before accessing its properties
      setRating(postData.likes - postData.dislikes);
      if (await checkToken()) {
        try {
          const data = await getRatings(params.id);
          setLiked(data?.isLiked);
          setDisliked(data?.isDisliked);
        } catch (error) {
          console.error(error.message);
        }
      }
    }
  }

  async function like() {
    if (await checkToken()) {
      try {
        await updateLike(params.id);
        fetchData(params);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      window.location.href = "/login";
    }
  }

  async function dislike() {
    if (await checkToken()) {
      try {
        await updateDislike(params.id);
        fetchData(params);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      window.location.href = "/login";
    }
  }

  const addViews = (id) => {
    updateForumViews(id);
  };

  useEffect(() => {
    addViews(params.id);
    fetchData(params);
    setLoadingMain(false);
  }, []);

  useEffect(() => {
    getRating();
  }, [postData]);

  useEffect(() => {
    const checkUserAndRole = async () => {
      try{
        const [verifUser, userResponse, roleResponse] = await Promise.all([checkToken(), checkUser(), checkRole()]);
        setVerify(verifUser);
        setCheckIsUser(userResponse);
        setCheckIsAdmin(roleResponse);
      }finally{
      }
    };

    checkUserAndRole();
  }, []);  

  useEffect(() => {
    const FetchAllComment = async () => {
      try{
        const commentData = await fetchComments(params.id);
        setInitialComments(commentData.data);
      }finally{
        setLoading(false);
      }
    };

    const interval = setInterval(() => {
      FetchAllComment();
    }, 5000);

    return () => clearInterval(interval);
  }, []);  

  return (
    <>
      <title>Mathlearn - Forum Matematika</title>
      <div className="flex flex-row">
        <Navbar path={"/forum"} />
        <div className="flex flex-col w-full">
          <div className="max-md:hidden">
            <Navbar2 />
          </div>
          <div className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}>
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
          <div className="justify-center items-center flex my-2 flex-col mb-32">
            {(postData || loadingMain) && (
              <div
                className="w-[90%] border-solid border-4 rounded-xl bg-gray-100 pb-2"
                style={{
                  borderColor: "#E3820E",
                  borderWidth: "4px",
                  borderStyle: "solid",
                }}
              >
                {loadingMain ? (
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
                        <div id="h3" className="font-roboto font-medium text-lg">
                          memuat . . .
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <ForumPostDisplay
                      postData={postData}
                      rating={rating}
                      liked={liked}
                      disliked={disliked}
                      like={like}
                      dislike={dislike}
                    />
                    {loading ? (
                      <CommentSectionSkeleton />
                    ) : (
                      <div>
                        <div className="items-center bg-gray-100 p-2 pl-6 pr-6">
                          <p className="text-lg mx-auto">Komentar :</p>
                        </div>

                        <CommentSection
                          id={params.id}
                          comments={initialComments}
                          isPostDeleted={postData.isDeleted}
                          paramsId={params.id}
                          verify={verifUser}
                          checkIsAdmin={checkIsAdminAuth}
                          checkIsUser={checkIsUserAuth}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumPost;
