"use client";
import {
  React,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Navbar, Footer, Navbar2 } from "../../../../../components";
import { editSectionMaterial } from "../../../../../server/api";
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
import "./style.css";
import DOMPurify from "dompurify";
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
        className="w-[1000px] h-[200px] flex items-center"
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

const EditSectionMaterial = ({ params }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [quill, setQuill] = useState(null);
  const [latex, setLatex] = useState("\\frac{1}{2}");

  const editorRef = useCallback(
    (element) => {
      const quillModule = require("quill"); // Import Quill module
      const Quill = quillModule.default;

      if (element !== null && !quill) {
        const quillInstance = new Quill(element, {
          theme: "snow",
          modules: {
            toolbar: {
              container: "#toolbar",
              handlers: {
                formula: handleMath,
                image: handleImageUploads,
              },
            },
          },
          placeholder: "Ketik konten di sini . . .",
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

  const handleImageUploads = () => {
    // Initialisation for image custom handle
  };

  useEffect(() => {
    if (quill && localStorage.getItem(`section-edit-${params.id}`)) {
      const quillInstance = quill;
      quillInstance.setText("");

      const sanitizedContents = DOMPurify.sanitize(
        localStorage.getItem(`section-edit-${params.id}`),
        {
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
        }
      );

      quillInstance.clipboard.dangerouslyPasteHTML(sanitizedContents);
    }
  }, [quill]);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.addEventListener("change", () => {
      if (quill) {
        console.log(input.files[0]);
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, "image", e.target.result);
          }
        };

        reader.readAsDataURL(file);
      }
    });

    input.click();
  };

  const handleLink = () => {
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.formatText(range.index, range.length, "link");
      }
    }
  };

  const handleVideo = () => {
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, "video");
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
        const quillEditors = document.querySelectorAll("#editor .ql-editor");
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
    if (quill) {
      const handleKaTeXClick = (event) => {
        let clickedElement = event.target;

        while (
          clickedElement &&
          !clickedElement.classList.contains("ql-formula")
        ) {
          clickedElement = clickedElement.parentElement;
        }
        const katexElements = document.querySelectorAll(".ql-formula");
        const editorElement = document.querySelector(".ql-editor");
        if (clickedElement) {
          katexElements.forEach((element) => {
            if (element === clickedElement) {
              element.classList.add("clicked");
              editorElement.classList.add("dimmed");
            } else {
              element.classList.remove("clicked");
            }
          });
        } else {
          editorElement.classList.remove("dimmed");
          katexElements.forEach((element) => {
            element.classList.remove("clicked");
          });
        }
      };

      quill.on("text-change", () => {
        document.addEventListener("click", handleKaTeXClick);
      });

      return () => {
        document.removeEventListener("click", handleKaTeXClick);
      };
    }
  }, [quill]);

  const handleMath = () => {
    setOpenModal(true);
  };

  const onCloseMath = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!content) {
      alert("Pastikan semua field terisi dengan benar");
      return;
    }

    const data = JSON.stringify({
      contentMaterials: content,
    });

    try {
      setLoading(true);
      await editSectionMaterial(data, params.id);
      goBakcAfterEdit();
    } catch (error) {
      console.error("Error Edit Section Materi:", error);
      alert("An error occurred while edit section the Materi.");
    }
  };

  const goBackAndRefresh = () => {
    window.history.back();
  };

  const goBakcAfterEdit = () => {
    sessionStorage.setItem("refresh", "true");
    window.history.back();
  };

  return (
    <>
      <title>Mathlearn - Edit Materi Matematika</title>

      <div>
        {loading && (
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
        <div
          className={`h-full w-full fixed bg-black/50 z-50 ${
            openModal ? "" : "hidden"
          }`}
        >
          <div>
            <span className="close" onClick={onCloseMath}>
              &times;
            </span>
            <div className="bg-white flex justify-center items-center h-[300px] w-full mt-48">
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
          <Navbar path={"/materi"} />
          <div className="flex flex-col w-full">
            <Navbar2 />
            <form
              className="justify-center items-center flex"
              onSubmit={handleSubmit}
            >
              <div className="relative my-50 mb-20 pb-2 transform w-[90%] border-solid border-4 border-orange-400 rounded-xl bg-gray-100">
                <div className="flex items-center p-3">
                  <div className="flex flex-1 gap-3">
                    <a
                      href="#"
                      className="mr-5 bg-white rounded-md p-2"
                      onClick={goBackAndRefresh}
                    >
                      &lt; Kembali
                    </a>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-blue-500 text-white rounded-full pl-2 pr-2 focus:outline-none"
                      style={{ backgroundColor: "#3B82F6" }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                {/* ========================================================================================== Text Editor =================================================================== */}
                <div className="ml-auto mr-auto">
                  <div id="toolbar">
                    <select className="ql-font"></select>
                    <select className="ql-header">
                      {[1, 2, 3, 4, 5, 6, false].map((header, index) => (
                        <option
                          key={index}
                          value={header}
                          selected={header === false ? true : undefined}
                        >
                          {header ? `H${header}` : "Normal"}
                        </option>
                      ))}
                    </select>
                    <select className="ql-size">
                      <option value="small">Small</option>
                      <option value="normal" selected>
                        Normal
                      </option>
                      <option value="large">Large</option>
                      <option value="huge">Huge</option>
                    </select>
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>
                    <button className="ql-strike"></button>
                    <select className="ql-color">
                      {[
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
                      ].map((color, index) => (
                        <option
                          key={index}
                          value={color}
                          style={{ backgroundColor: color }}
                        ></option>
                      ))}
                    </select>
                    <select className="ql-background"></select>
                    <button className="ql-script" value="sub"></button>
                    <button className="ql-script" value="super"></button>
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <button className="ql-indent" value="-1"></button>
                    <button className="ql-indent" value="+1"></button>
                    <button className="ql-direction" value="rtl"></button>
                    <select className="ql-align"></select>
                    <button className="ql-link" onClick={handleLink}></button>
                    <button
                      className="ql-image"
                      onClick={handleImageUpload}
                    ></button>
                    <button className="ql-video" onClick={handleVideo}></button>
                    <button className="ql-formula"></button>
                    <button className="ql-clean"></button>
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
                    className="resize-none min-h-[300px] w-full border border-white rounded bg-transparent text-center text-white focus:outline-none editor"
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

export default EditSectionMaterial;
