"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar2, Navbar, Footer } from "../../../components";
import {
  editTitleMaterial,
  checkRole,
  deleteSectionMaterial,
  deleteMaterial,
  materialFav,
  checkToken,
  checkUserFav,
} from "../../../server/api";
import DOMPurify from "dompurify";
import "./style.css";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import katex from "katex";
import Formula from "quill/formats/formula";
import Image from "quill/formats/image";
import Link from "quill/formats/link";
import video from "quill/formats/video";
import CircularProgress from "@mui/joy/CircularProgress";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Swal from "sweetalert2";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";

const DynamicQuill = dynamic(() => import("quill"), { ssr: false });

export const materi = ({ params }) => {
  const [loading, setLoading] = useState(true);
  // const [favorite, setFavorite] = useState(null);
  const [role, setRole] = useState(null);
  const [content, setContent] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quill, setQuill] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadingChunk, setLoadingChunk] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [valueTittle, setValueTittle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checkFav, setCheckFav] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      setVerified(isTokenValid);
    };

    verifyToken();
  }, [checkToken]);

  const editMaterialTitle = async (data, id) => {
    await editTitleMaterial(data, id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (valueTittle) {
          const data = JSON.stringify({
            title: valueTittle,
            description: "",
          });
          editMaterialTitle(data, params.id);
        }
        setIsEditable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [valueTittle]);

  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem("refresh");
    if (shouldRefresh) {
      sessionStorage.removeItem("refresh");
      window.location.reload();
    }
  }, []);

  const editorRef = useCallback(
    (element) => {
      const quillModule = require("quill"); // Import Quill module
      const Quill = quillModule.default;

      if (element !== null && !quill) {
        const quillInstance = new Quill(element, {
          theme: "bubble",
          readOnly: true,
          modules: {
            toolbar: false,
          },
        });

        Quill.register({
          "formats/image": Image,
          "formats/formula": Formula,
          "formats/link": Link,
          "formats/video": video,
        });

        setQuill(quillInstance);
      }
    },
    [quill]
  );

  const goToNextQuestion = () => {
    if (currentQuestionIndex < content?.sections.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const getMateriId = async () => {
    try {
      const response = await fetch(
        `https://mathlearns.my.id/mathlearns-web-service/material/id?id=${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      // setLoadingChunk(false);
      // const contentLength = response.headers.get("Content-Length");
      // const totalBytes = contentLength
      //   ? Number.parseInt(contentLength, 10)
      //   : null;
      // if (!totalBytes) {
      //   console.warn("Content-Length header is missing");
      //   return;
      // }

      // const reader = response.body.getReader();
      // let loadedBytes = 0;
      // const chunks = [];
      // const chunkSize = totalBytes / 5;

      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) {
      //     break;
      //   }

      //   for (let i = 0; i < value.length; i += chunkSize) {
      //     const chunk = value.slice(i, i + chunkSize);
      //     chunks.push(chunk);
      //     loadedBytes += chunk.length;
      //     const progress = (loadedBytes / totalBytes) * 100;
      //     setProgress(progress);

      //     await new Promise((resolve) => setTimeout(resolve, 1000));
      //   }
      // }

      // const blob = new Blob(chunks);
      // const data = await blob.text();

      try {
        const jsonData = await response.json();
        setContent(jsonData);
        setLoading(false);
        window.katex = katex;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching material:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quill && content) {
      const contents =
        content?.sections[currentQuestionIndex]?.contentMaterials;

      const quillInstance = quill;
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
  }, [content, quill, currentQuestionIndex]);

  const checkUserMaterialFav = async () => {
    if(await checkToken()){
      const res = await checkUserFav(params.id);
      setCheckFav(res?.body.message);
      setLoadingFav(true)
    }
  };

  useEffect(() => {
    getMateriId();
    checkUserMaterialFav();
  }, []);

  useEffect(() => {
    const checkRoleUser = async () => {
      const role = await checkRole();
      setRole(role);
    };

    checkRoleUser();
  }, [checkRole]);

  const deleteSection = async (id) => {
    setLoading(true);
    setLoadingChunk(true);
    await deleteSectionMaterial(id);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const editSection = (data) => {
    localStorage.setItem(`section-edit-${data.id}`, data.contentMaterials);
    window.location.href = `/materi/edit/section/${data.id}`;
  };

  const deleteMaterialFunc = async (event, id) => {
    event.preventDefault();

    await deleteMaterial(id);
    Swal.fire({
      icon: "success",
      title: "Sukses",
      text: "Hapus Materi Sukses",
      confirmButtonColor: "#8cbbf1",
    });
    setTimeout(() => {
      window.location.href = `/materi`;
    }, 1500);
  };

  const addFavorite = async (e) => {
    e.preventDefault();

    if (verified) {
      setLoadingFav(false);
      const res = await materialFav(params.id);
      if (res.statusCodeValue === 200) {
        if (checkFav) {
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Berhasil Menghapus Materi dari Favorit",
            confirmButtonColor: "#8cbbf1",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Berhasil Menambahkan Materi dari Favorit",
            confirmButtonColor: "#8cbbf1",
          });
        }
        checkUserMaterialFav();
        setLoadingFav(true);
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Gagal Menambahkan ke Favorit",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#8cbbf1",
        });
        setLoadingFav(true);
      }
    }
  };

  return (
    <>
      <title>Mathlearn - Materi Matematika</title>

      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(true)}
        className="z-50 bg-black/10 flex justify-center items-center" //
      >
        <div className="absolute w-[25%] bg-white translate-x-[150%] translate-y-[70%] border-4 border-orange-500 rounded-3xl max-md:w-[100%] max-md:-translate-x-[0%]">
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {"Apakah Anda Ingin Menghapus Material ?"}
              </h3>
            </div>
          </Modal.Body>

          <Modal.Footer className="flex justify-center gap-5">
            <Button
              onClick={(event) => {
                deleteMaterialFunc(event, params.id);
                setOpenModal(false);
              }}
              className="bg-red-500"
            >
              {"Iya, Menghapus Material"}
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

      <div className="relative flex flex-row">
        <Navbar path={"/materi"} />
        <div className="flex flex-col w-full">
          <div className="max-md:hidden">
            <Navbar2 />
          </div>
          <div className="justify-center items-center flex flex-col max-md:mx-0 w-full py-10 px-20 max-md:p-2">
            <div className="flex w-full justify-end gap-3">
              {verified ? (
                <div className="flex mb-3">
                  <button
                    className="px-3 h-[38px] rounded-lg bg-[#198754] font-roboto"
                    onClick={(event) => addFavorite(event)}
                  >
                    {loadingFav ? (
                      checkFav ? (
                        <span>
                          <BsFillBookmarkCheckFill
                            size={20}
                            className="text-white"
                          />
                        </span>
                      ) : (
                        <span>
                          <BsBookmark size={20} className="text-white" />
                        </span>
                      )
                    ) : (
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
                    )}
                  </button>
                </div>
              ) : (<></>)}
              {role == "ROLE_ADMIN" && (
                <div className="flex">
                  <div className="flex flex-row-reverse mb-3 max-md:hidden">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Menu Materi
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href={`/materi/add/materi/${params.id}`}>
                          Tambah Halaman
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={(event) =>
                            // deleteMaterialFunc(event, params.id)
                            setOpenModal(true)
                          }
                        >
                          Hapus Materi
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              <button
                className="bg-grey-200 p-2 px-4 my-3 ml-1 shadow-lg rounded-xl flex justify-center items-center text-center hover:bg-blue md:hidden"
                onClick={() => window.history.back()}
              >
                <div>◁◁</div>
              </button>
            </div>
            <div className="w-[100%] h-full max-md:w-full max-md:px-1">
              <div className="border-solid border-4 border-orange-400 rounded-xl bg-gray-100 overflow-hidden w-full">
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
                          className="font-roboto font-medium text-l flex flex-col justify-center items-center gap-1"
                        >
                          {!loadingChunk && (
                            <CircularProgress value={progress} />
                          )}
                          <p className="flex flex-col text-center items-center justify-center">
                            memuat . . .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : content ? (
                  <div className="my-5 min-h-[700px]">
                    <div className="text-3xl font-bold  text-center max-md:h-full">
                      <textarea
                        ref={inputRef}
                        type="text"
                        value={
                          valueTittle === "" ? content?.title : valueTittle
                        }
                        onChange={(e) => setValueTittle(e.target.value)}
                        readOnly={!isEditable}
                        disabled={role !== "ROLE_ADMIN"}
                        onClick={() => setIsEditable(true)}
                        onBlur={() => setIsEditable(false)}
                        style={{
                          lineHeight: "1",
                          boxSizing: "border-box",
                          margin: "0",
                          overflow: !isEditable && "hidden",
                          fontSize: "inherit",
                          resize: !isEditable && "none",
                          wordBreak: "break-all",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                        className={`border-b px-3 w-full text-center border-gray-300 focus:border-gray-300 outline-none bg-gray-100 max-md:w-full max-md:min-h-[130px] ${
                          role === "ROLE_ADMIN"
                            ? isEditable
                              ? "border-b-2 cursor-text"
                              : "border-none cursor-pointer"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="flex flex-col place-items-stretch justify-between min-h-[700px]">
                      <div id="editor" name="editor" ref={editorRef}></div>
                      <div className="flex mt-4 gap-3 mb-3 w-full h-full max-md:scale-[65%] max-md:transform max-md:-translate-x-[85px]">
                        <div className="flex justify-between w-full mx-5 max-md:gap-10">
                          <button
                            onClick={goToPreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`text-white bg-gray-500/80 p-3 rounded-lg font-pacifico w-48 max-2xl:w-44 ${
                              currentQuestionIndex === 0
                                ? `opacity-70`
                                : "hover:bg-gray-400/80"
                            }`}
                          >
                            Sebelumnya
                          </button>
                          {role == "ROLE_ADMIN" && (
                            <>
                              <button
                                onClick={() =>
                                  editSection(
                                    content?.sections[currentQuestionIndex]
                                  )
                                }
                                className={`text-white bg-orange-500/80 p-3 rounded-lg font-pacifico w-48 max-2xl:w-44 hover:bg-orange-400/80 max-md:hidden`}
                              >
                                Edit Halaman Ini
                              </button>
                              <button
                                onClick={() =>
                                  alert(
                                    "untuk mengubah halaman, mohon untuk menggunakan versi dekstop atau laptop"
                                  )
                                }
                                className={`text-white bg-orange-500/80 p-3 rounded-lg font-pacifico w-48 max-2xl:w-44 hover:bg-orange-400/80 md:hidden`}
                              >
                                Edit Halaman Ini
                              </button>
                              {content?.sections.length > 1 && (
                                <button
                                  onClick={() =>
                                    deleteSection(
                                      content?.sections[currentQuestionIndex]
                                        ?.id
                                    )
                                  }
                                  className={`text-white bg-red-500/80 p-3 rounded-lg font-pacifico w-48 max-2xl:w-44 hover:bg-red-400/80`}
                                >
                                  Hapus Halaman Ini
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={goToNextQuestion}
                            disabled={
                              currentQuestionIndex ===
                              content?.sections?.length - 1
                            }
                            className={`text-white bg-gray-500/80 p-3 rounded-lg font-pacifico w-48 max-2xl:w-44 hover:bg-gray-400/80 ${
                              currentQuestionIndex ===
                              content?.sections?.length - 1
                                ? `opacity-70`
                                : "hover:bg-gray-400/80"
                            }`}
                          >
                            Selanjutnya
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-5 border-b border-gray-300 text-center">
                    No Search Results Found
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

export default materi;
