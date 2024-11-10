"use client";
import {
  React,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Navbar, Footer, Navbar2 } from "../../../components";
import { updateForumAPI, checkToken } from "../../../server/api";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import katex from "katex";
import Formula from "quill/formats/formula";
import Image from "quill/formats/image";
import "./style.css";
import { useSearchParams } from "next/navigation";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import { Suspense } from "react";

const DynamicQuill = dynamic(() => import("quill"), { ssr: false });

const MathEditor = ({ latex, setLatex, quill, setOpenModal }) => {
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
  };

  return (
    <div className="math-editor">
      <DynamicMathQuills
        className="w-[1000px] h-[200px] flex items-center max-md:w-80 max-md:h-24"
        latex={latex}
        onChange={(mathField) => {
          setLatex(mathField.latex());
        }}
      />
      <div className="flex flex-row-reverse items-center justify-center mt-3 gap-3">
        <button
          onClick={handleInsert}
          className="bg-green-300 px-4 py-1 border border-black rounded-lg font-roboto text-base font-medium"
        >
          <p>Insert</p>
        </button>
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
    </div>
  );
};

const ForumUpdate = () => {
  const params = useSearchParams();

  const [openModal, setOpenModal] = useState(false);
  const [quill, setQuill] = useState(null);
  const [latex, setLatex] = useState("\\frac{1}{2}");

  const [id, setId] = useState(params.get("id"));
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [title, setTitle] = useState(params.get("title"));
  const [loading, setLoading] = useState(false);

  const validateToken = async () => {
    const isValid = await checkToken();
    !isValid ? (window.location.href = "/login") : true;
  };

  const editorRef = useCallback((element) => {
    const quillModule = require("quill"); // Import Quill module
    const Quill = quillModule.default;

    if (element !== null) {
      const quillInstance = new Quill(element, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
        placeholder: "Masukan Konten Forum di Sini . . .",
      });

      setQuill(quillInstance);
    }

    Quill.register({
      "formats/image": Image,
      "formats/formula": Formula,
    });
  }, []);

  useEffect(() => {
    validateToken();
    setInitialContent(params.get("content"));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (quill) {
        const quest = initialContent;

        const quillInstance = quill;
        quillInstance.clipboard.dangerouslyPasteHTML(DOMPurify.sanitize(quest));
      }
    }, 0);
  }, [initialContent, quill]);

  const toolbarButton = [
    [
      {
        color: [
          "#000000",
          "#e60000",
          "#ff9900",
          "#ffff00",
          "#008a00",
          "#0066cc",
          "#9933ff",
          "#ffffff",
          "#facccc",
          "#34eb83",
          "#eb34d5",
          "#eb8834",
          "#34ebcf",
          "#cf34eb",
        ],
      },
      "bold",
      "italic",
      "underline",
      "strike",
      { script: "sub" },
      { script: "super" },
      { size: ["small", false, "large", "huge"] },
      { header: [1, 2, 3, 4, 5, 6, false] },
    ],
    ["clean"],
  ];

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
      quill.root.innerHTML = "";
      quill.on("text-change", () => {
        const quillEditors = document.querySelectorAll(".ql-editor");
        let combinedContent = "";

        quillEditors.forEach((editor) => {
          combinedContent += editor.innerHTML;
        });

        const parsedData = removeKatexHtmlFromContent(combinedContent);

        setContent(parsedData);
      });
    }
  }, [quill]);

  const handleMath = () => {
    setOpenModal(true);
  };

  const onCloseMath = () => {
    setOpenModal(false);
  };

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!title || !content) {
      Swal.fire({
        title: "Error!",
        text: "Pastikan konten dan judul terisi!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      return;
    }

    const data = JSON.stringify({
      forumTitle: title,
      content: content,
    });

    try {
      const response = await updateForumAPI(id, data);
      Swal.fire({
        title: "Sukses!",
        text: "Forum post anda terbuat",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      quill.setText("");
      // alert(response.statusCode);
      setLoading(true); // Set loading after alert is dismissed
      setTimeout(() => {
        window.location.href = `/forum/${id}`;
      }, 5000);
    } catch (error) {
      console.error("Error creating forum:", error);
      Swal.fire({
        title: "Error!",
        text: "Pastikan konten dan judul terisi!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      // alert("An error occurred while creating the forum.");
    }
  };

  function goBack() {
    window.history.back();
  }

  return (
    <>
      <title>Mathlearn - Update Forum Matematika</title>

      <div>
        {loading && (
          <div className="h-full w-full bg-black/60 z-50 fixed flex justify-center items-center">
            <div id="page">
              <div className="flex items-center justify-center relative">
                <div id="ring"></div>
                <div id="ring"></div>
                <div id="ring"></div>
                <div id="ring"></div>
                <div id="h3" className="font-roboto font-medium text-xl">
                  memuat . . .
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className={`h-full w-full fixed bg-black/50 z-50 ${
            openModal ? "" : "hidden"
          }`}
        >
          <div>
            <span className="close" onClick={onCloseMath}>
              &times;
            </span>
            <div className="bg-white flex justify-center items-center h-[300px] w-full mt-48 max-md:ml-3 max-md:w-96 max-md:h-40 max-md:mt-[150px]">
              {quill && (
                <MathEditor
                  latex={latex}
                  setLatex={setLatex}
                  quill={quill}
                  setOpenModal={setOpenModal}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <Navbar path={"/forum"} />
          <div className="flex flex-col w-full">
            <div className="max-md:hidden">
              <Navbar2 />
            </div>
            <form
              className="justify-center items-center flex"
              onSubmit={handleSubmit}
            >
              <div className="relative my-50 pb-2 transform w-[90%] border-solid border-4 border-orange-400 rounded-xl bg-gray-100 my-2">
                <div className="flex items-center p-3">
                  <div className="flex flex-1 gap-3">
                    <div
                      onClick={goBack}
                      className="bg-grey-200 p-2 px-4 shadow-lg rounded-xl flex justify-center items-center text-center hover:bg-blue cursor-pointer"
                    >
                      <div>◁◁</div>
                    </div>

                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 w-full ml-6 mr-10"
                      placeholder="Title"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-blue-500 text-white rounded-full px-5 py-1 focus:outline-none"
                      style={{ backgroundColor: "#3B82F6" }}
                      type="submit"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
                {/* <textarea
      className="w-full p-4 mt-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
      style={{ lineHeight: "1.5rem", height: "calc(10 * 1.5rem)" }}
      placeholder="Enter your text here..."
      value={content}
      onChange={handleInputChange}
    /> */}
                {/* ========================================================================================== Text Editor =================================================================== */}
                <div className="ml-auto mr-auto z-30 drop-shadow-sm relative border-none">
                  <div id="toolbar" className="absolute w-full">
                    <select class="ql-color">
                      {toolbarButton[0][0].color.forEach((color) => {
                        return `<option value="${color}">${color}</option>`;
                      })}
                    </select>
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                    <button class="ql-strike"></button>
                    <button class="ql-script" value="sub"></button>
                    <button class="ql-script" value="super"></button>
                    <select class="ql-size">
                      {toolbarButton[0][7].size.forEach((size) => {
                        return `<option value="${size}">${size}</option>`;
                      })}
                    </select>
                    <button class="ql-clean"></button>
                    <button class="ql-latex" onClick={handleMath}>
                      Σ
                    </button>
                  </div>
                </div>
                <label
                  htmlFor="editor"
                  onClick={() => {
                    document.getElementById("editor").focus();
                  }}
                >
                  <div
                    id="editor"
                    name="editor"
                    ref={editorRef}
                    className="resize-none min-h-[300px] w-full text-center text-white focus:outline-none editor bg-white"
                  ></div>
                </label>

                {/* ========================================================================================================================================================================== */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export function ForumUpdatePage() {
  return (
    <Suspense>
      <ForumUpdate />
    </Suspense>
  );
}

export default ForumUpdatePage;
