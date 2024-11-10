"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  createForumCommentAPI,
  deleteForumCommentAPI,
  checkUser,
  checkRole,
  checkToken,
} from "../../../server/api";
import CommentRatingSection from "./CommentRatingSection";
import { timeAgo } from "../../../server/utils";
import Swal from "sweetalert2";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "katex/dist/katex.min.css";
import Formula from "quill/formats/formula";
import Link from "quill/formats/link";
import video from "quill/formats/video";
import dynamic from "next/dynamic";
import katex from "katex";
import DOMPurify from "dompurify";

const DynamicQuill = dynamic(() => import("quill"), { ssr: false });

const MathEditor = ({
  latex,
  setLatex,
  quill,
  quillAnswers,
  index,
  setOpenModal,
  setReplyContentMath,
  ReplyContentMath,
}) => {
  const [OpenMathOperations, setOpenMathOperations] = useState(false);

  const DynamicMathQuill = dynamic(() => import("react-mathquill"), {
    ssr: false,
  });

  const math = require("react-mathquill");
  const DynamicMathQuills = math.EditableMathField;
  math.addStyles();
  window.katex = katex;

  const handleInsert = () => {
    if (latex) {
      try {
        if (quill) {
          const range = quill.getSelection(true);

          if (range) {
            quill.insertEmbed(range.index, "formula", latex);
            setLatex("");
          }
        } else if (quillAnswers) {
          const range = quillAnswers[index].getSelection(true);
          if (range) {
            quillAnswers[index].insertEmbed(range.index, "formula", latex);
            setLatex("");
          }
        } else if (setReplyContentMath) {
          setReplyContentMath(ReplyContentMath + `$${latex}$`);
        } else {
          console.warn("No selection in Quill editor, cannot insert LaTeX.");
        }
      } catch (error) {
        console.error("Error converting LaTeX to KaTeX:", error);
      }
    }

    setOpenModal(false);
  };

  const insertSymbol = (symbol) => {
    setLatex((prev) => `${prev}${symbol}`);
    setOpenMathOperations(false);
  };

  return (
    <div className="math-editor">
      {OpenMathOperations ? (
        <div className="w-[48vw] h-[15vh] flex items-center max-md:w-[21rem] max-md:h-24 mx-3">
          <div className="grid grid-cols-1 md:hidden">
            <div className="custom-grid">
              {/* Basic Operators */}
              <button
                onClick={() => insertSymbol("\\frac{}{}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <mfrac>
                    <mrow>
                      <mi>a</mi>
                    </mrow>
                    <mrow>
                      <mi>b</mi>
                    </mrow>
                  </mfrac>
                </math>
              </button>
              <button
                onClick={() => insertSymbol("\\log_{} x")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                log<sub>{10}</sub> x
              </button>
              <button
                onClick={() => insertSymbol("\\sqrt{}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                √
              </button>
              <button
                onClick={() => insertSymbol("+")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                +
              </button>
              <button
                onClick={() => insertSymbol("-")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                -
              </button>
              <button
                onClick={() => insertSymbol("\\times")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                ×
              </button>
              <button
                onClick={() => insertSymbol("\\div")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                ÷
              </button>

              {/* Greek Letters */}
              <button
                onClick={() => insertSymbol("\\alpha")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                α
              </button>
              <button
                onClick={() => insertSymbol("\\beta")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                β
              </button>
              <button
                onClick={() => insertSymbol("\\gamma")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                γ
              </button>

              {/* Limits and Integrals */}
              <button
                onClick={() => insertSymbol("\\lim_{x \\to \\infty}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                lim
              </button>
              <button
                onClick={() => insertSymbol("\\int_{}^{}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                ∫
              </button>
              <button
                onClick={() => insertSymbol("\\sum_{i=1}^{}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                ∑
              </button>

              {/* Subscripts and Superscripts */}
              <button
                onClick={() => insertSymbol("x_{}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                a<sub>x</sub>
              </button>
              <button
                onClick={() => insertSymbol("x^{}")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                a<sup>x</sup>
              </button>

              {/* Other Symbols */}
              <button
                onClick={() => insertSymbol("\\pi")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                π
              </button>
              <button
                onClick={() => insertSymbol("\\infty")}
                className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
              >
                ∞
              </button>
            </div>
          </div>
        </div>
      ) : (
        <DynamicMathQuills
          className="w-[48vw] h-[15vh] flex items-center max-md:w-[21rem] max-md:h-24 mx-3"
          latex={latex}
          onChange={(mathField) => {
            setLatex(mathField.latex());
          }}
        />
      )}
      <div className="flex flex-row-reverse items-center justify-center mt-4 gap-3 max-md:hidden">
        <div className="flex space-x-2">
          {/* Basic Operators */}
          <button
            onClick={() => insertSymbol("\\frac{}{}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            <math xmlns="http://www.w3.org/1998/Math/MathML">
              <mfrac>
                <mrow>
                  <mi>a</mi>
                </mrow>
                <mrow>
                  <mi>b</mi>
                </mrow>
              </mfrac>
            </math>
          </button>
          <button
            onClick={() => insertSymbol("\\log_{} x")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            log<sub>{10}</sub> x
          </button>
          <button
            onClick={() => insertSymbol("\\sqrt{}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            √
          </button>
          <button
            onClick={() => insertSymbol("+")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            +
          </button>
          <button
            onClick={() => insertSymbol("-")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            -
          </button>
          <button
            onClick={() => insertSymbol("\\times")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            ×
          </button>
          <button
            onClick={() => insertSymbol("\\div")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            ÷
          </button>

          {/* Greek Letters */}
          <button
            onClick={() => insertSymbol("\\alpha")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            α
          </button>
          <button
            onClick={() => insertSymbol("\\beta")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            β
          </button>
          <button
            onClick={() => insertSymbol("\\gamma")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            γ
          </button>

          {/* Limits and Integrals */}
          <button
            onClick={() => insertSymbol("\\lim_{x \\to \\infty}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            lim
          </button>
          <button
            onClick={() => insertSymbol("\\int_{}^{}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            ∫
          </button>
          <button
            onClick={() => insertSymbol("\\sum_{i=1}^{}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            ∑
          </button>

          {/* Subscripts and Superscripts */}
          <button
            onClick={() => insertSymbol("x_{}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            a<sub>x</sub>
          </button>
          <button
            onClick={() => insertSymbol("x^{}")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            a<sup>x</sup>
          </button>

          {/* Other Symbols */}
          <button
            onClick={() => insertSymbol("\\pi")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            π
          </button>
          <button
            onClick={() => insertSymbol("\\infty")}
            className="bg-blue-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
          >
            ∞
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          setOpenMathOperations(!OpenMathOperations);
        }}
        className={`${OpenMathOperations && "mt-7"} md:hidden bg-orange-300 hover:bg-orange-400 px-4 py-2 rounded-md font-roboto text-base font-medium my-3 w-full max-md:w-[21rem] max-md:mx-3`}
      >
        {
          OpenMathOperations ? (<p>Tutup Operasi Matematika</p>):(<p>Buka Operasi Matematika</p>)
        }
      </button>
      <button
        onClick={handleInsert}
        className="bg-green-300 hover:bg-green-400 px-4 py-2 rounded-md font-roboto text-base font-medium my-2 w-full max-md:w-[21rem] max-md:mx-3"
      >
        <p>Insert</p>
      </button>
    </div>
  );
};

const CommentList = ({
  id,
  comments,
  isPostDeleted,
  paramsId,
  checkIsUser,
  checkIsAdmin,
  verify,
}) => {
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyInputChild, setReplyInputChild] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalMath, setOpenModalMath] = useState(false);
  const [openModalMathReply, setOpenModalMathReply] = useState(false);
  const [openModalMathCommentReply, setOpenModalMathCommentReply] =
    useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(true);
  const newCommentRef = useRef(null);
  const newCommentChildRef = useRef(null);

  const [quill, setQuill] = useState(null);
  const [quillReply, setQuillReply] = useState([]);
  const [quillCommentReply, setQuillCommentReply] = useState([]);
  const [latex, setLatex] = useState("\\frac{1}{2}");

  const [loadingReplyRoot, setLoadingReplyRoot] = useState(false);
  const [loadingReplyParent, setLoadingReplyParent] = useState(false);
  const [loadingReplyChild, setLoadingReplyChild] = useState(false);

  const editorRef = useCallback(
    (element) => {
      const quillModule = require("quill");
      const Quill = quillModule.default;

      if (element !== null && !quill) {
        const quillInstance = new Quill(element, {
          theme: "snow",
          modules: {
            toolbar: {
              container: "#toolbar",
              handlers: {
                formula: handleMath,
              },
            },
          },
          placeholder: "Ketik komen di sini . . .",
        });

        Quill.register({
          "formats/formula": Formula,
          "formats/link": Link,
          "formats/video": video,
        });
        setQuill(quillInstance);
      }
    },
    [quill]
  );

  const handleMathReply = () => {
    setOpenModalMathReply(true);
  };

  const handleReply = (replyId, name = "") => {
    setReplyContent("");
    if (name) {
      setReplyContent(`@${name} `);
    }
    setReplyInput((prev) => (prev === replyId ? replyId : replyId));
  };

  const handleChangeReplyId = (replyId) => {
    setReplyInputChild((prev) =>
      prev === `reply-${replyId}` ? null : `reply-${replyId}`
    );
  };

  // Group by
  const groupedComments = comments.reduce((grouped, comment) => {
    const key = comment.replyTo || comment.id;
    grouped[key] = grouped[key] || [];
    grouped[key].push(comment);
    return grouped;
  }, {});

  const handleMathCommentReply = () => {
    setOpenModalMathCommentReply(true);
  };

  const editorReplyRef = useCallback(
    (element, index) => {
      const quillModule = require("quill");
      const Quill = quillModule.default;

      if (element !== null && !quillReply[index]) {
        const quillInstance = new Quill(element, {
          theme: "bubble",
          readOnly: true,
          modules: {
            toolbar: false,
          },
        });

        setQuillReply((prev) => ({
          ...prev,
          [index]: quillInstance,
        }));
      }
    },
    [quillReply]
  );

  useEffect(() => {
    const timeoutIds = [];
    Object.values(groupedComments).forEach((group, index) => {
      const [parent] = group;
      if (quillReply[index]) {
        const sanitizedContent = DOMPurify.sanitize(parent.content);
        const timeoutId = setTimeout(() => {
          quillReply[index].clipboard.dangerouslyPasteHTML(sanitizedContent);
        }, 0);

        timeoutIds.push(timeoutId);
      }
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [quillReply]);

  // ==========================================================================================================================================================================================================================================
  const [previewContent, setPreviewContent] = useState("");

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(replyContent, {
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      USE_PROFILES: {
        svg: true,
        mathMl: true,
        svgFilters: true,
      },
    });

    const katexRegex = /(\$.*?\$)/g;
    const matches = sanitizedHtml.match(katexRegex);

    if (matches) {
      let previewText = sanitizedHtml;
      matches.forEach((match) => {
        const expression = match.replace(/^\$|\$$/g, "");

        try {
          const isDisplayMode =
            expression.startsWith("$$") && expression.endsWith("$$");
          const rendered = katex.renderToString(expression, {
            displayMode: isDisplayMode,
          });

          previewText = previewText.replace(match, rendered);
        } catch (error) {
          console.error("Error rendering KaTeX:", error);
        }
      });

      setPreviewContent(previewText);
    } else {
      setPreviewContent(sanitizedHtml);
    }
  }, [replyContent]);

  // ===========================================================================================================================================================================

  const handleInputChange2 = (event) => {
    setReplyContent(event.target.value);
  };

  const handleLink = () => {
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.formatText(range.index, range.length, "link");
      }
    }
  };

  function removeKatexHtmlFromContent(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const katexHtmlElements = doc.querySelectorAll(".katex-html");
    katexHtmlElements.forEach((element) => {
      element.parentNode.removeChild(element);
    });

    return doc.documentElement.innerHTML;
  }

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const quillEditors = document.querySelectorAll(
          "#editor-parent-1 .ql-editor"
        );
        let combinedContent = "";

        quillEditors.forEach((editor) => {
          combinedContent += editor.innerHTML;
        });

        const parsedData = removeKatexHtmlFromContent(combinedContent);

        setContent(parsedData);
      });
    }
  }, [quill]);

  useEffect(() => {
    if (groupedComments) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, {});

  const handleReplySubmit = async () => {
    setLoadingReplyParent(true);

    const data = JSON.stringify({
      content: previewContent,
    });

    if (replyContent == "") {
      Swal.fire({
        title: "Error!",
        text: "Pastikan konten tidak kosong!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      return;
    }

    const response = await createForumCommentAPI(
      id,
      replyInput.split("parent-")[1],
      data
    );
    setPreviewContent("");
    setReplyContent("");

    if (response.statusCode == "CREATED") {
      await Swal.fire({
        title: "Sukses!",
        text: "Komentar terbuat!",
        icon: "success",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willClose: () => {
          console.log("SweetAlert telah ditutup setelah 3 detik.");
        },
      });
    }

    setReplyInput("");
    setReplyInputChild("");

    setTimeout(() => {
      if (response.statusCode == "CREATED") {
        if (newCommentChildRef.current) {
          newCommentChildRef.current.classList.add("highlight-new-comment");
          setTimeout(() => {
            newCommentChildRef.current.classList.remove(
              "highlight-new-comment"
            );
          }, 5000);
        }

        newCommentChildRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    setLoadingReplyParent(false);
  };

  const replaceDynamicNamesWithSpan = (text) => {
    const regex = /@(\w+)/g;
    return text.replace(
      regex,
      (match, p1) =>
        `<span class="text-orange-500 font-bold font-roboto">${match}</span>`
    );
  };

  const handleReplyChildSubmit = async () => {
    setLoadingReplyChild(true);

    const data = JSON.stringify({
      content: replaceDynamicNamesWithSpan(previewContent),
    });

    if (previewContent == "") {
      Swal.fire({
        title: "Error!",
        text: "Pastikan konten tidak kosong!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      return;
    }

    const response = await createForumCommentAPI(id, replyInput, data);
    setReplyContent("");
    setPreviewContent("");
    if (response.statusCode == "CREATED") {
      await Swal.fire({
        title: "Sukses!",
        text: "Komentar terbuat!",
        icon: "success",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willClose: () => {
          console.log("SweetAlert telah ditutup setelah 3 detik.");
        },
      });
    }

    setReplyInput("");
    setReplyInputChild("");

    setTimeout(() => {
      if (response.statusCode == "CREATED") {
        if (newCommentChildRef.current) {
          newCommentChildRef.current.classList.add("highlight-new-comment");
          setTimeout(() => {
            newCommentChildRef.current.classList.remove(
              "highlight-new-comment"
            );
          }, 5000);
        }

        newCommentChildRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    setLoadingReplyChild(false);
  };

  const handleSubmit = async () => {
    setLoadingReplyRoot(true);

    const data = JSON.stringify({
      content: content,
    });

    if (content == "") {
      Swal.fire({
        title: "Error!",
        text: "Pastikan konten tidak kosong!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      return;
    }

    const response = await createForumCommentAPI(id, "", data);
    if (response.statusCode == "CREATED") {
      await Swal.fire({
        title: "Sukses!",
        text: "Komentar terbuat!",
        icon: "success",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willClose: () => {
          console.log("SweetAlert telah ditutup setelah 3 detik.");
        },
      });
    }

    setTimeout(() => {
      if (response.statusCode == "CREATED") {
        if (newCommentRef.current) {
          newCommentRef.current.classList.add("highlight-new-comment");
          setTimeout(() => {
            newCommentRef.current.classList.remove("highlight-new-comment");
          }, 5000);
        }

        newCommentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    setLoadingReplyRoot(false);
  };

  async function handleDelete(commentId) {
    console.log(commentId);
    setOpenModal(false);
    try {
      const res = await deleteForumCommentAPI(commentId);
      alert("Komentar terhapus!");
    } catch (error) {
      console.error(error.message);
    }
  }

  function onEnter(event) {
    var key = event.keyCode || event.which;

    if (key === 13) {
      var textarea = event.target;
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;

      textarea.value =
        textarea.value.substring(0, start) +
        "\n" +
        textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;

      event.preventDefault();
    }
  }

  const handleMath = () => {
    setOpenModalMath(true);
  };

  const onCloseMath = () => {
    setOpenModalMath(false);
  };

  const onCloseMathReply = () => {
    setOpenModalMathReply(false);
  };

  const onCloseMathCommentReply = () => {
    setOpenModalMathCommentReply(false);
  };

  return (
    <div className="space-y-2">
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(true)}
        className="z-50 bg-black/10 flex justify-center items-center"
      >
        <div className="absolute w-[25%] bg-white translate-x-[150%] translate-y-[75%] border-4 border-orange-500 rounded-3xl max-md:w-[100%] max-md:-translate-x-[0%]">
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Hapus Post Komentar?
              </h3>
            </div>
          </Modal.Body>

          <Modal.Footer className="flex justify-center gap-5">
            <Button
              onClick={() => {
                setOpenModal(false);
                handleDelete(deleteId);
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
      {!isPostDeleted && (
        <div>
          <div className="relative flex flex-col h-full">
            {!verify && (
              <div
                className={`absolute z-50 bg-black/60 w-full h-full flex justify-center items-center`}
              >
                <span className="text-white font-roboto font-bold text-xl">
                  🔒 Jika anda ingin melakukan komen, dimohon untuk masuk ke
                  akun
                </span>
              </div>
            )}
            <div className={`h-full w-full ${openModalMath ? "" : "hidden"}`}>
              <div>
                <div className="flex items-center flex-row-reverse">
                  <div></div>
                  <span className="close px-3" onClick={onCloseMath}>
                    &times;
                  </span>
                </div>

                <div className="bg-white rounded-lg flex justify-center items-center h-[350px] w-full max-md:ml-3 max-md:w-[21rem] max-md:h-72 max-md:mt-[0px]">
                  <MathEditor
                    latex={latex}
                    setLatex={setLatex}
                    quill={quill}
                    quillAnswers={null}
                    index={null}
                    setOpenModal={setOpenModalMath}
                  />
                </div>
              </div>
            </div>
            <div id="toolbar">
              <button className="ql-formula"></button>
            </div>
            <label
              htmlFor="editor-parent-1"
              onClick={() => {
                document.getElementById("editor-parent-1").focus();
              }}
            >
              <div
                id="editor-parent-1"
                name="editor-parent-1"
                ref={editorRef}
                style={{ lineHeight: "1.5rem", height: "calc(10 * 1.5rem)" }}
                className="w-full border border-gray-300 focus:outline-none focus:border-blue-500 resize-none bg-white"
              ></div>
            </label>
          </div>

          <div className="flex justify-end p-1 mt-2">
            <button
              className="bg-blue-500 text-white rounded-full pl-2 pr-2 focus:outline-none mr-1"
              style={{ backgroundColor: "#3B82F6" }}
              onClick={handleSubmit}
              disabled={!verify || loadingReplyRoot}
            >
              {loadingReplyRoot ? (
                <div className="h-7 w-20 flex justify-center items-center">
                  <div className="loader">
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                    <div className="bar4"></div>
                    <div className="bar5"></div>
                    <div className="bar6"></div>
                    <div className="bar7"></div>
                    <div className="bar8"></div>
                    <div className="bar9"></div>
                    <div className="bar10"></div>
                    <div className="bar11"></div>
                    <div className="bar12"></div>
                  </div>
                </div>
              ) : (
                <div className="h-7 w-20 flex justify-center items-center">
                  <span>Kirim</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {Object.values(groupedComments).length > 0 ? (
        Object.values(groupedComments).map((group, index) => {
          const [parent, ...replies] = group;
          return (
            <div
              key={parent.id}
              className="bg-gray-100 rounded-md flex-grow bg-white p-4 relative flex flex-col w-full max-md:text-sm"
            >
              <div className="flex items-center w-full" ref={newCommentRef}>
                <img
                  src={
                    parent.userId.imageAvatar
                      ? parent.userId.imageAvatar
                      : "/profil.png"
                  }
                  alt=""
                  className="self-start mt-1 flex-shrink-0 w-16 h-16 object-cover object-center border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-300"
                />
                <div className="grid grid-rows-1 gap-y-1 ml-2 w-[90%]">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-gray-800 border-b-2 border-gray-100 w-[80%]">
                      {parent.userId.name}
                      <span className="text-gray-400 mx-2">|</span>
                      {parent.userId.communityScores}★
                      <span className="text-gray-400 mx-2">|</span>
                      {timeAgo(parent.createdAt * 1000)}
                    </span>

                    {(checkIsAdmin == "ROLE_ADMIN" ||
                      checkIsUser == parent.userId.id) &&
                      !parent.isDeleted && (
                        <a
                          onClick={() => {
                            setOpenModal(true);
                            setDeleteId(parent.id);
                          }}
                        >
                          <img
                            src="/images/delete.png"
                            className="w-6 h-6 cursor-pointer ml-6"
                            title="Delete"
                          />
                        </a>
                      )}
                  </div>
                  <div
                    className="text-gray-800 py-3 content-1"
                    id="parent-content"
                    ref={(el) => editorReplyRef(el, index)}
                    style={{
                      wordBreak: "break-all",
                      wordWrap: "break-word",
                      whiteSpace: "break-spaces",
                    }}
                  />

                  <span className="text-gray-800 flex flex-row items-center">
                    {" "}
                    {/* change */}
                    <CommentRatingSection
                      id={parent.id}
                      isDeleted={parent.isDeleted}
                      likes={parent.likes}
                      dislikes={parent.dislikes}
                      isLikes={parent.forumCommentRating[0]?.isLiked}
                      isDislikes={parent.forumCommentRating[0]?.isDisliked}
                      paramsIdC={paramsId}
                    />
                    {!parent.isDeleted && verify && (
                      <span>
                        <button
                          className={`bg-grey-200 p-1 px-2 mr-4 shadow-lg rounded-xl items-center text-center hover:bg-blue ${
                            replyInput === `parent-${parent.id}`
                              ? "focus:bg-blue"
                              : ""
                          }`}
                          onClick={() => {
                            handleReply(`parent-${parent.id}`);
                            handleChangeReplyId(parent.id);
                          }}
                        >
                          Balas
                        </button>
                      </span>
                    )}
                  </span>
                  <div
                    className={`bg-gray-200 
                      ${
                        replyInput === `parent-${parent.id}`
                          ? "flex flex-col"
                          : "hidden"
                      } 
                        w-[50vw] p-1 rounded-b-2xl mt-1 pb-2 max-md:w-full`}
                  >
                    <div id={`toolbar-reply-${index}`}>
                      {/* <button
                          className="ql-link"
                          onClick={handleLink}
                        ></button>*/}
                      <button
                        type="button"
                        className="formula px-[5px] py-[3px] font-roboto text-sm font-light hover:hover:text-[#06c] text-[#444]"
                        onClick={handleMathReply}
                      >
                        <svg
                          viewBox="0 0 18 18"
                          className="h-[18px] w-[18px] fill-current"
                        >
                          <path
                            class="ql-fill"
                            d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"
                          ></path>
                          <rect
                            class="ql-fill"
                            height="1.6"
                            rx="0.8"
                            ry="0.8"
                            width="5"
                            x="5.15"
                            y="6.2"
                          ></rect>
                          <path
                            class="ql-fill"
                            d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    <div
                      className={`h-[50%] w-full ${
                        openModalMathReply ? "max-md:absolute md:block max-md:-translate-x-[5.75rem]" : "hidden"
                      } z-50 `}
                    >
                      <div className="max-md:bg-black/50 max-md:h-96 max-md:w-full">
                        <div className="flex items-center flex-row-reverse">
                          <div></div>
                          <span
                            className="close px-3 pb-3 max-md:pt-3"
                            onClick={onCloseMathReply}
                          >
                            &times;
                          </span>
                        </div>

                        <div className="bg-white flex justify-center items-center h-[350px] w-full max-md:ml-3 max-md:w-[21rem] max-md:h-72 max-md:mt-[10px]">
                          <MathEditor
                            latex={latex}
                            setLatex={setLatex}
                            setReplyContentMath={setReplyContent}
                            ReplyContentMath={replyContent}
                            quill={null}
                            quillAnswers={null}
                            index={null}
                            setOpenModal={setOpenModalMathReply}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ============================================================================================================================================================================== */}

                    <textarea
                      id={`editor-reply-${index}`}
                      name={`editor-reply-${index}`}
                      type="text"
                      className="flex w-full h-[250px] p-4 border border-gray-300 focus:outline-none focus:border-blue-500 resize-none mt-1"
                      style={{
                        lineHeight: "1.5rem",
                      }}
                      placeholder="Masukan Komentar Anda ..."
                      value={replyContent}
                      onChange={handleInputChange2}
                    />
                    <div
                      className="preview-content relative w-full min-h-[100px] p-4 border border-gray-300 focus:outline-none focus:border-blue-500 resize-none bg-white"
                      id="preview-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          previewContent.replace(/\uFEFF/g, "<br>"),
                          {
                            FORCE_BODY: true,
                            ADD_TAGS: ["iframe", "br"],
                            ALLOWED_TAGS: ["br"],
                            ADD_ATTR: [
                              "allow",
                              "allowfullscreen",
                              "frameborder",
                              "scrolling",
                              "style",
                            ],
                            USE_PROFILES: {
                              html: true,
                              svg: true,
                              svgFilters: true,
                            },
                          }
                        ),
                      }}
                      style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        whiteSpace: "break-spaces",
                      }}
                    />

                    {/* =============================================================================================================================================================================== */}

                    <div className=" flex items-center justify-end m-2">
                      <button
                        className="bg-blue-500 text-white rounded-full px-4 py-1 focus:outline-none mr-1"
                        style={{ backgroundColor: "#3B82F6" }}
                        onClick={handleReplySubmit}
                        disabled={loadingReplyParent}
                      >
                        {loadingReplyParent ? (
                          <div className="h-5 w-16 flex justify-center items-center">
                            <div className="loader">
                              <div className="bar1"></div>
                              <div className="bar2"></div>
                              <div className="bar3"></div>
                              <div className="bar4"></div>
                              <div className="bar5"></div>
                              <div className="bar6"></div>
                              <div className="bar7"></div>
                              <div className="bar8"></div>
                              <div className="bar9"></div>
                              <div className="bar10"></div>
                              <div className="bar11"></div>
                              <div className="bar12"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-5 w-16 flex justify-center items-center">
                            <span>Kirim</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {replies.map((reply, indexReply) => (
                <div
                  key={reply.id}
                  className="flex items-center w-full pl-6 mt-6"
                  ref={newCommentChildRef}
                >
                  <img
                    src={
                      reply.userId.imageAvatar
                        ? reply.userId.imageAvatar
                        : "/profil.png"
                    }
                    alt="Gambar Profile"
                    className="self-start mt-1 flex-shrink-0 w-16 h-16 object-cover object-center border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-300"
                  />
                  <div className="grid grid-rows-1 gap-y-1 ml-2 max-md:w-full">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-gray-800 border-b-2 border-gray-100 w-full">
                        {reply.userId.name}{" "}
                        <span className="text-gray-400 mx-2">|</span>
                        {reply.userId.communityScores}★{" "}
                        <span className="text-gray-400 mx-2">|</span>
                        {timeAgo(reply.createdAt * 1000)}
                      </p>
                      {(checkIsAdmin == "ROLE_ADMIN" ||
                        checkIsUser == reply.userId.id) &&
                        !reply.isDeleted && (
                          <a
                            onClick={() => {
                              setOpenModal(true);
                              setDeleteId(reply.id);
                            }}
                          >
                            <img
                              src="/images/delete.png"
                              className="w-6 h-6 cursor-pointer ml-6"
                              title="Delete"
                            />
                          </a>
                        )}
                    </div>
                    <div
                      className="text-gray-800 py-3 content-1"
                      id="child-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          reply.content.replace(/\uFEFF/g, "<br>"),
                          {
                            FORCE_BODY: true,
                            ADD_TAGS: ["iframe", "br"],
                            ALLOWED_TAGS: ["br"],
                            ADD_ATTR: [
                              "allow",
                              "allowfullscreen",
                              "frameborder",
                              "scrolling",
                              "style",
                            ],
                            USE_PROFILES: {
                              html: true,
                              svg: true,
                              svgFilters: true,
                            },
                          }
                        ),
                      }}
                      style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        whiteSpace: "break-spaces",
                      }}
                    />
                    <span className="text-gray-800 flex flex-row items-center">
                      {/* change */}
                      <CommentRatingSection
                        id={reply.id}
                        isDeleted={parent.isDeleted}
                        likes={reply.likes}
                        dislikes={reply.dislikes}
                        isLikes={reply.forumCommentRating[0]?.isLiked}
                        isDislikes={reply.forumCommentRating[0]?.isDisliked}
                        paramsIdC={paramsId}
                      />
                      {!parent.isDeleted && !reply.isDeleted && (
                        <span>
                          {verify && (
                            <button
                              className={`bg-grey-200 p-1 px-2 mr-4 shadow-lg rounded-xl items-center text-center hover:bg-blue ${
                                replyInputChild === `reply-${reply.id}`
                                  ? "focus:bg-blue"
                                  : ""
                              }`}
                              onClick={() => {
                                handleReply(parent.id, reply.userId.name);
                                handleChangeReplyId(reply.id);
                              }}
                            >
                              Balas
                            </button>
                          )}
                        </span>
                      )}
                    </span>
                    <div
                      className={`bg-gray-200 
                      ${
                        replyInputChild === `reply-${reply.id}`
                          ? "flex flex-col"
                          : "hidden"
                      } 
                      w-[50vw] p-1 rounded-b-2xl mt-1 pb-2 max-md:w-full`}
                    >
                      <div
                        id={`toolbar-reply-comment-${index}-${indexReply}-${reply.id}`}
                      >
                        {/* <button
                          className="ql-link"
                          onClick={handleLink}
                        ></button>*/}
                        <button
                          type="button"
                          className="formula px-[5px] py-[3px] font-roboto text-sm font-light hover:text-[#06c] text-[#444]"
                          onClick={handleMathCommentReply}
                        >
                          <svg
                            viewBox="0 0 18 18"
                            className="h-[18px] w-[18px] fill-current"
                          >
                            <path
                              class="ql-fill"
                              d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"
                            ></path>
                            <rect
                              class="ql-fill"
                              height="1.6"
                              rx="0.8"
                              ry="0.8"
                              width="5"
                              x="5.15"
                              y="6.2"
                            ></rect>
                            <path
                              class="ql-fill"
                              d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"
                            ></path>
                          </svg>
                        </button>
                      </div>

                      <div
                        className={`h-[50%] w-full ${
                          openModalMathCommentReply ? "max-md:absolute md:block max-md:-translate-x-[7.25rem]" : "hidden"
                        } z-50`}
                      >
                        <div className="max-md:bg-black/50 max-md:h-96 max-md:w-full">
                          <div className="flex items-center flex-row-reverse">
                            <div></div>
                            <span
                              className="close px-3 pb-3 max-md:pt-3"
                              onClick={onCloseMathCommentReply}
                            >
                              &times;
                            </span>
                          </div>

                          <div className="bg-white flex justify-center items-center h-[350px] w-full max-md:ml-3 max-md:w-[21rem] max-md:h-72 max-md:mt-[10px]">
                            <MathEditor
                              latex={latex}
                              setLatex={setLatex}
                              setReplyContentMath={setReplyContent}
                              ReplyContentMath={replyContent}
                              quill={null}
                              quillAnswers={null}
                              index={null}
                              setOpenModal={setOpenModalMathCommentReply}
                            />
                          </div>
                        </div>
                      </div>
                      {/* ============================================================================================================================================================================== */}

                      <textarea
                        id={`editor-comment-reply-${index}-${indexReply}`}
                        name={`editor-comment-reply-${index}-${indexReply}`}
                        type="text"
                        className="flex w-full h-[250px] p-4 border border-gray-300 focus:outline-none focus:border-blue-500 resize-none mt-1"
                        style={{
                          lineHeight: "1.5rem",
                        }}
                        placeholder="Masukan Komentar Anda ..."
                        value={replyContent}
                        onChange={handleInputChange2}
                      />
                      <div
                        className="preview-content relative w-full min-h-[100px] p-4 border border-gray-300 focus:outline-none focus:border-blue-500 resize-none bg-white"
                        id="preview-content"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            previewContent.replace(/\uFEFF/g, "<br>"),
                            {
                              FORCE_BODY: true,
                              ADD_TAGS: ["iframe", "br"],
                              ALLOWED_TAGS: ["br"],
                              ADD_ATTR: [
                                "allow",
                                "allowfullscreen",
                                "frameborder",
                                "scrolling",
                                "style",
                              ],
                              USE_PROFILES: {
                                html: true,
                                svg: true,
                                svgFilters: true,
                              },
                            }
                          ),
                        }}
                        style={{
                          wordBreak: "break-all",
                          wordWrap: "break-word",
                          whiteSpace: "break-spaces",
                        }}
                      />

                      {/* =============================================================================================================================================================================== */}
                      <div className="flex items-center justify-end m-2">
                        <button
                          className="bg-blue-500 text-white rounded-full px-2 focus:outline-none mr-1"
                          style={{ backgroundColor: "#3B82F6" }}
                          onClick={handleReplyChildSubmit}
                          disabled={loadingReplyChild}
                        >
                          {loadingReplyChild ? (
                            <div className="h-7 w-20 flex justify-center items-center">
                              <div className="loader">
                                <div className="bar1"></div>
                                <div className="bar2"></div>
                                <div className="bar3"></div>
                                <div className="bar4"></div>
                                <div className="bar5"></div>
                                <div className="bar6"></div>
                                <div className="bar7"></div>
                                <div className="bar8"></div>
                                <div className="bar9"></div>
                                <div className="bar10"></div>
                                <div className="bar11"></div>
                                <div className="bar12"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-7 w-20 flex justify-center items-center">
                              <span>Kirim</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      ) : loading ? (
        <div>{/* <CommentSectionSkeleton /> */}</div>
      ) : (
        <div className="w-full h-[30vh] bg-white flex justify-center items-center flex-col">
          <img
            src="/images/pulp-fiction-john-travolta.gif"
            className="h-[70%]"
          ></img>
          <div className="bg-gray-100 rounded-3xl w-48 h-8 text-center flex items-center justify-center mt-4">
            Komen Tidak Tersedia
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
