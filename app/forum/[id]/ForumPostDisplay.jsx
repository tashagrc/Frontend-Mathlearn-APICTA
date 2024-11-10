import React, { useCallback, useEffect, useRef } from "react";
import { deleteForumAPI, checkUser, checkRole } from "../../../server/api";
import { Link } from "next/navigation";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { timeAgo } from "../../../server/utils";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import katex from "katex";
import Formula from "quill/formats/formula";
import Links from "quill/formats/link";
import video from "quill/formats/video";

const DynamicQuill = dynamic(() => import("quill"), { ssr: false });

const ForumPostDisplay = ({
  postData,
  rating,
  liked,
  disliked,
  like,
  dislike,
}) => {
  const [quillPostDisplay, setQuillPostDisplay] = useState(null);

  async function handleDelete() {
    try {
      await deleteForumAPI(postData.id);
    } catch (error) {
      console.error(error.message);
    }
    window.location.reload(); // Reloads the page
  }

  const editorRef = useCallback(
    (element) => {
      const quillModule = require("quill"); 
      const Quill = quillModule.default;

      if (element !== null && !quillPostDisplay) {
        const quillInstance = new Quill(element, {
          theme: "bubble",
          readOnly: true,
          modules: {
            toolbar: false,
          },
        });

        Quill.register({
          "formats/formula": Formula,
          "formats/link": Links,
          "formats/video": video,
        });

        setQuillPostDisplay(quillInstance);
      }
    },
    [quillPostDisplay]
  );

  useEffect(() => {
    if (quillPostDisplay && postData) {
      window.katex = katex;

      const contents = postData.content;

      const quillInstance = quillPostDisplay;
      quillInstance.setText("");

      const sanitizedContents = DOMPurify.sanitize(contents, {
        USE_PROFILES: {
          html: true,
          svg: true,
          mathMl: true,
          svgFilters: true,
        },
        ADD_TAGS: ["iframe"],
        ADD_ATTR: [
          "allow",
          "allowfullscreen",
          "frameborder",
          "scrolling",
          "src",
          "type",
          "controls",
          "autoplay",
          "preload",
          "poster",
        ],
      });

      const htmlContent = `
        <div className="text-xl  px-8 py-20">
          ${sanitizedContents}
        </div>
      `;

      quillInstance.clipboard.dangerouslyPasteHTML(htmlContent);
    }
  }, [postData, quillPostDisplay]);

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", options).replace(".", ":");
  }

  const [openModal, setOpenModal] = useState(false);
  const [checkIsUser, setCheckIsUser] = useState("");
  const [checkIsAdmin, setCheckIsAdmin] = useState("");

  useEffect(() => {
    const checkIsUserId = async () => {
      const response = await checkUser();
      setCheckIsUser(response);
    };

    const checkIsRoleAdmin = async () => {
      const response = await checkRole();
      setCheckIsAdmin(response);
    };

    checkIsUserId();
    checkIsRoleAdmin();
  }, []);

  function goBack() {
    window.history.back();
  }

  return (
    <div>
      <div className="flex items-center p-3 pl-6 pr-6">
        {/* Left side */}
        <div className="flex flex-1">
          <button className="bg-grey-200 p-2 px-4 mr-4 shadow-lg rounded-xl flex justify-center items-center text-center hover:bg-blue">
            <a href="#" onClick={goBack}>
              ◁◁
            </a>
          </button>

          <div className="max-md:hidden flex items-center w-full">
            <textarea readOnly={true} disabled={true} className="resize-none overflow-hidden flex flex-wrap items-center font-bold text-roboto w-full bg-transparent pr-5">
              {postData.forumTitle}
            </textarea>
            {postData.isEdited && (
              <span className="text-sm text-gray-500 w-32 item-center">(Telah Diubah)</span>
            )}
          </div>
          <div className="md:hidden flex items-center w-full">
            <textarea readOnly={true} disabled={true} className="resize-none overflow-hidden flex flex-wrap items-center font-bold text-roboto w-full bg-transparent pr-5">
              {`${postData.forumTitle.substring(0, 13)}...`}
            </textarea>
            {postData.isEdited && (
              <span className="text-sm text-gray-500 w-32 item-center">(Telah Diubah)</span>
            )}
          </div>

        </div>

        {/* Right side */}
        {!postData.isDeleted && (
          <>
            {/* Share */}
            <img
              src="/images/share.png"
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("URL disalin ke papan klip!");
              }}
              title="Share"
            />
            <div className="mx-2"></div>
            {/* Update */}
            <a
              href={`/forum/update?${new URLSearchParams({
                id: postData.id,
                title: postData.forumTitle,
                content: postData.content,
              })}`}
            >
              {checkIsUser == postData.userId.id && (
                <img
                  src="/images/edit.png"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  title="Edit"
                />
              )}
            </a>
            <div className="mx-2"></div>
            {/* Delete */}
            {(checkIsAdmin == "ROLE_ADMIN" ||
              checkIsUser == postData.userId.id) && (
              <div>
                <a onClick={() => setOpenModal(true)}>
                  <img
                    src="/images/delete.png"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    title="Delete"
                  />
                </a>
                <Modal
                  dismissible
                  show={openModal}
                  onClose={() => setOpenModal(true)}
                  className="z-50 bg-black/10 flex justify-center items-center" //
                >
                  <div className="absolute w-[25%] bg-white translate-x-[150%] translate-y-[75%] border-4 border-orange-500 rounded-3xl max-md:w-[100%] max-md:-translate-x-[0%]">
                    <Modal.Body>
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                          Hapus Forum Post?
                        </h3>
                      </div>
                    </Modal.Body>

                    <Modal.Footer className="flex justify-center gap-5">
                      <Button
                        onClick={() => {
                          setOpenModal(false);
                          handleDelete();
                        }}
                        className="bg-red-500"
                      >
                        {"Iya, laksanakan"}
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
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex items-start p-6 px-8 max-md:p-2 space-x-3 bg-white">
        {/* Rating */}
        <div className="flex flex-col items-center py-1">
          <div className="flex items-center">
            <button
              title="Like"
              type="button"
              className={`inline-flex items-center justify-center w-8 h-8 max-md:w-4 py-0 text-5xl max-md:text-3xl ${
                liked ? "text-green-500" : "text-gray-300"
              }`}
              onClick={like}
              disabled={postData.isDeleted}
            >
              ▲
            </button>
          </div>
          <div className="flex items-center pt-2">
            <span>{rating}</span>
          </div>
          <div className="flex items-center">
            <button
              title="Dislike"
              type="button"
              className={`inline-flex items-center justify-center w-8 h-8 py-0 text-5xl max-md:text-3xl ${
                disliked ? "text-red-500" : "text-gray-300"
              }`}
              onClick={dislike}
              disabled={postData.isDeleted}
            >
              ▼
            </button>
          </div>
        </div>

        <div className="flex-grow bg-white p-5 max-md:p-2 relative flex flex-col">
          <div className="flex items-center max-md:mb-5">
            <img
              src={postData.userId.imageAvatar ? postData.userId.imageAvatar : "/profil.png"}
              alt="Gambar Profile"
              className="self-center flex-shrink-0 w-16 h-16 object-cover object-center border rounded-full md:justify-self-start dark:border-gray-300"
            />
            <div className="flex flex-1 max-md:grid max-md:grid-cols-1">
              <p className="mx-3 max-md:text-sm">{postData.userId.name}</p>
              <p className="text-gray-400 max-md:hidden">|</p>
              <p className="mx-3 max-md:text-sm">{postData.userId.communityScores}★</p>
              <p className="text-gray-400 max-md:hidden">|</p>
              <p className="mx-3 max-md:text-sm">{timeAgo(postData.createdAt)}</p>
              <p className="text-gray-400 max-md:hidden">|</p>
              <p className="mx-3 max-md:text-sm">Dilihat {postData.views}x</p>
            </div>
          </div>
            <div id="editor" name="editor" ref={editorRef} style={{ 
                wordBreak: 'break-all',
                wordWrap: 'break-word',
                whiteSpace: 'normal'
              }}></div>
          </div>
        </div>
      </div>
  );
};

export default ForumPostDisplay;
