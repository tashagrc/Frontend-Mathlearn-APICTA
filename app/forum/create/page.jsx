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
import { createForumAPI, checkToken } from "../../../server/api";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import katex from "katex";
import Formula from "quill/formats/formula";
import Image from "quill/formats/image";
import "./style.css";
import Swal from "sweetalert2";

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

const ForumCreate = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [quill, setQuill] = useState(null);
  const [latex, setLatex] = useState("\\frac{1}{2}");
  const [loadCreateForum, setLoadCreateForum] = useState(false);

  const validateToken = async () => {
    const isValid = await checkToken();
    !isValid ? (window.location.href = "/login") : true;
  };

  const editorRef = useCallback((element) => {
    const quillModule = require("quill"); // Import Quill module
    const Quill = quillModule.default;

    if (element !== null) {
      setQuill(
        new Quill(element, {
          theme: "snow",
          modules: {
            toolbar: "#toolbar",
          },
          placeholder: "Ketik konten di sini . . .",
          preserveWhitespace: true,
        })
      );
    }

    Quill.register({
      "formats/image": Image,
      "formats/formula": Formula,
    });
  }, []);

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
    validateToken();
  }, []);

  useEffect(() => {
    if (quill) {
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
    setLoadCreateForum(true);

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
      const response = await createForumAPI(data);
      Swal.fire({
        title: "Sukses!",
        text: "Forum post anda terbuat",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      setLoadCreateForum(false);
      setLoading(true); // Set loading after alert is dismissed
      setTimeout(() => {
        window.location.href = `/forum/${response.body}`;
      }, 5000);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Pastikan konten dan judul terisi!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });

      setLoadCreateForum(false);
    }
  };

  function goBack() {
    window.history.back();
  }

  return (
    <>
      <title>Mathlearn - Buat Forum Matematika</title>

      <div>
        {loading && (
          <div className="h-full w-full bg-black/60 z-50 fixed">
            <div id="page" className="mt-[25%] mb-[25%] max-md:mt-[100%]">
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
                      placeholder="Judul"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-blue-500 text-white rounded-full px-5 py-1 focus:outline-none"
                      style={{ backgroundColor: "#3B82F6" }}
                      type="submit"
                      disabled={loadCreateForum}
                    >
                      {loadCreateForum ? (
                        <div className="w-16 h-6 flex justify-center items-center">
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
                        <div className="w-16 h-6 text-center flex justify-center items-center">
                          <span>Kirim</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                {/* ========================================================================================== Text Editor =================================================================== */}
                <div className="ml-auto mr-auto z-50 drop-shadow-sm relative">
                  <div id="toolbar" className="absolute w-full">
                    <select className="ql-color">
                      {toolbarButton[0][0].color.forEach((color) => {
                        return `<option value="${color}">${color}</option>`;
                      })}
                    </select>
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>
                    <button className="ql-strike"></button>
                    <button className="ql-script" value="sub"></button>
                    <button className="ql-script" value="super"></button>
                    <select className="ql-size">
                      {toolbarButton[0][7].size.forEach((size) => {
                        return `<option value="${size}">${size}</option>`;
                      })}
                    </select>
                    <button className="ql-clean"></button>
                    <button className="ql-latex" onClick={handleMath}>
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

export default ForumCreate;
