"use client";
import {
  React,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  checkToken,
  checkRole,
  addQuestion,
} from "../../../../../../server/api";
import { Navbar2 } from "../../../../../../components";
import { IoMdImages } from "react-icons/io";
import { LiaImage } from "react-icons/lia";
import { PiMagnifyingGlassPlusLight } from "react-icons/pi";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "./style_create_quiz.css";
import "katex/dist/katex.min.css";
import Formula from "quill/formats/formula";
import Image from "quill/formats/image";
import dynamic from "next/dynamic";
import katex from "katex";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";

const DynamicQuill = dynamic(() => import("quill"), { ssr: false });

const MathEditor = ({
  latex,
  setLatex,
  quill,
  quillAnswers,
  index,
  setOpenModal,
}) => {
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

const AddQuestion = ({ params }) => {
  const [verif, setVerif] = useState(true);
  const [points, setPoints] = useState("10 pts");
  const [seconds, setSeconds] = useState("20 Sec");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(Array(4).fill(""));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const colors = ["#E1C9AD", "#FFDD95", "#86A7FC", "#3468C0"];
  const [selectedFileQuestion, setSelectedFileQuestion] = useState(null);
  const [selectedFileQuestionUrl, setSelectedFileQuestionUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showModal = () => setIsOpen(true);
  const [openModal, setOpenModal] = useState(false);
  const [quill, setQuill] = useState(null);
  const [quillAnswers, setQuillAnswers] = useState(Array(4).fill(null));
  const [indexQuillAnswer, setIndexQuillAnswer] = useState(null);
  const [latex, setLatex] = useState("\\frac{1}{2}");
  const [switchQuill, setSwithQuill] = useState(false);

  const editorRef = useCallback(
    (element) => {
      const quillModule = require("quill"); // Import Quill module
      const Quill = quillModule.default;

      if (element !== null) {
        setQuill(
          new Quill(element, {
            theme: "snow",
            modules: {
              toolbar: "#toolbar",
            },
            placeholder: "Masukan pertanyaan anda.",
          })
        );
      }

      Quill.register({
        "formats/image": Image,
        "formats/formula": Formula,
      });
    },
    [selectedFileQuestion]
  );

  const editorRefAnswer = useCallback((element) => {
    const quillModule = require("quill"); // Import Quill module
    const Quill = quillModule.default;

    if (element !== null) {
      const index = parseInt(element.getAttribute("data-index"));
      const quillInstance = new Quill(element, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
        placeholder: "Masukan Jawaban ...",
      });

      // Remove the initial <p></p> added by Quill
      quillInstance.setText("");

      setQuillAnswers((prevQuillAnswers) => {
        const newQuillAnswers = [...prevQuillAnswers];
        newQuillAnswers[index] = quillInstance;
        return newQuillAnswers;
      });
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

  useEffect(() => {
    const checkRoleUser = async () => {
      const role = await checkRole();
      return role;
    };

    const checkTokenUser = async () => {
      const token = await checkToken();
      return token;
    };

    if (!checkTokenUser() && checkRoleUser() != "ROLE_ADMIN") {
      window.location.href = "/dashboard";
    } else {
      setVerif(false);
    }
  }, [checkRole, checkToken]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
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
      if (question != null) {
        quill.clipboard.dangerouslyPasteHTML(
          DOMPurify.sanitize(question, {
            USE_PROFILES: {
              html: true,
              mathMl: true,
              svg: false,
              svgFilters: true,
            },
          })
        );
      } else {
        quill.root.innerHTML = "";
      }

      quill.on("text-change", () => {
        const quillEditors = document.querySelectorAll("#editor .ql-editor");
        let combinedContent = "";

        quillEditors.forEach((editor) => {
          combinedContent += editor.innerHTML + " ";
        });

        const parsedData = removeKatexHtmlFromContent(combinedContent);

        setQuestion(parsedData);
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
            element.classList.remove("clicked"); // Ubah ini
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

  useEffect(() => {
    quillAnswers.forEach((quillAnswer, index) => {
      if (quillAnswer) {
        quillAnswer.on("text-change", () => {
          setAnswers((prevAnswers) => {
            let updatedAnswers = [...prevAnswers];
            const editor = document.querySelector(
              `#editorAnswer-${index} .ql-editor`
            );
            if (editor) {
              updatedAnswers[index] = removeKatexHtmlFromContent(
                editor.innerHTML
              );
            }
            return updatedAnswers;
          });
        });
      }
    });
  }, [quillAnswers]);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append(
      "questions",
      new Blob(
        [
          JSON.stringify([
            {
              question: question,
              duration: (
                parseInt(seconds.replace(/\D/g, "")) * 1000
              ).toString(),
              pointValue: parseInt(points.replace(/\D/g, "")).toString(),
              options: answers.map((answer, index) => ({
                textOption: answer,
                isValidOption: index === selectedAnswer ? "true" : "false",
              })),
              ...(selectedFileQuestion ? { hasImage: true } : {}),
            },
          ]),
        ],
        {
          type: "application/json",
        }
      )
    );

    if (selectedFileQuestion != null) {
      formData.append("filesQuestion", selectedFileQuestion);
    }

    if (answers.length != 4 || selectedAnswer == null) {
      alert("Pastikan semua field terisi dengan benar");
      return;
    }

    // var reader = new FileReader();
    // reader.onload = function (event) {
    //   var jsonData = JSON.parse(event.target.result);
    //   console.log(jsonData);
    // };
    // reader.readAsText(formData.get("questions"));

    setLoading(true);

    try {
      const rersponse = await addQuestion(formData, params.id);
      if (rersponse.body.message) {
        Swal.fire({
          title: "Sukses!",
          text: "Berhasil Menambahkan Soal Quiz",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#8cbbf1",
        });

        setTimeout(function () {
          window.location.href = `/quiz/draft/edit/${params.id}`;
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Gagal Menambahkan Soal Quiz!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });

      setLoading(false);
    }
  };

  const handleMath = () => {
    setSwithQuill(false);
    setOpenModal(true);
  };

  const handleMathAnswerOption = (index) => {
    setIndexQuillAnswer(index);
    setSwithQuill(true);
    setOpenModal(true);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setSelectedFileQuestionUrl(localImageUrl);
      setSelectedFileQuestion(file); // Simpan file yang dipilih ke state
    }
  };

  const onCloseMath = () => {
    setOpenModal(false);
  };

  const CustomCheckbox = ({ isChecked }) => (
    <div
      style={{
        width: "20px",
        height: "20px",
        border: isChecked ? "1px solid #00ff00" : "1px solid #000",
        borderRadius: "50%",
        position: "absolute",
        top: "5px",
        left: "5px",
        zIndex: 10,
        backgroundColor: isChecked ? "#00ff00" : "",
      }}
    >
      {isChecked ? (
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: "6px",
            width: "6px",
            height: "9px",
            border: "solid #fff",
            borderWidth: "0 2px 2px 0",
            transform: "rotate(45deg)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: "6px",
            width: "6px",
            height: "9px",
            border: "solid #000",
            borderWidth: "0 2px 2px 0",
            transform: "rotate(45deg)",
          }}
        />
      )}
    </div>
  );

  function goBack() {
    window.history.back();
  }

  const onDeleteImage = async () => {
    setSelectedFileQuestion(null);
    setSelectedFileQuestionUrl(null);
  };

  return (
    <>
      <title>Mathlearn - Tambah Pertanyaan Quiz</title>
      {verif ? (
        <div></div>
      ) : (
        <div className={`box ${loading && "cursor-none"}`}>
          <div
            className={`h-full w-full fixed bg-black/50 z-50 ${
              openModal ? "" : "hidden"
            }`}
          >
            {switchQuill == false && (
              <div>
                <span className="close" onClick={onCloseMath}>
                  &times;
                </span>
                <div className="bg-white flex justify-center items-center h-[300px] w-full mt-48 max-md:ml-3 max-md:w-96 max-md:h-40 max-md:mt-[150px]">
                  <MathEditor
                    latex={latex}
                    setLatex={setLatex}
                    quill={quill}
                    quillAnswers={null}
                    index={null}
                    setOpenModal={setOpenModal}
                  />
                </div>
              </div>
            )}
            {switchQuill == true && (
              <div>
                <span className="close" onClick={onCloseMath}>
                  &times;
                </span>
                <div className="bg-white flex justify-center items-center h-[300px] w-full mt-48 max-md:ml-3 max-md:w-96 max-md:h-40 max-md:mt-[150px]">
                  <MathEditor
                    latex={latex}
                    setLatex={setLatex}
                    quill={null}
                    quillAnswers={quillAnswers}
                    index={indexQuillAnswer}
                    setOpenModal={setOpenModal}
                  />
                </div>
              </div>
            )}
          </div>
          {loading && (
            <div className="h-full w-full bg-black/60 z-50 fixed">
              <div id="page" className="mt-[25%] mb-[25%] max-md:mt-[100%]">
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
          <div className="max-md:hidden">
            <Navbar2 />
          </div>
          <div className="border-t-8 border-orange-500"></div>
          <div className="flex flex-row-reverse mt-5 mr-10 max-md:mr-0">
            <div className="max-md:hidden">
              <button className="bg-grey-200 p-4 px-8 shadow-lg rounded-xl flex justify-center items-center text-center hover:bg-blue absolute left-10">
                <a href={`/quiz/draft/edit/${params?.id}`}>◁◁</a>
              </button>
            </div>
            <div className="flex space-x-10 max-md:flex-col max-md:space-x-0 max-md:ml-5 max-md:mr-5 max-md:space-y-3 max-md:w-full">
              <button className="md:hidden bg-grey-200 p-2 px-4 shadow-lg rounded-xl flex justify-center items-center text-center hover:bg-blue">
                <a href={`/quiz/draft/edit/${params?.id}`}>◁◁</a>
              </button>
              <div className="relative inline-flex max-md:flex-col max-md:gap-3">
                <svg
                  className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none color"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 412 232"
                >
                  <path
                    d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.762-9.763 25.592 0 35.355l189.21 189.211c9.372 9.373 24.749 9.373 34.121 0l189.21-189.211c9.763-9.763 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                    fill="#648299"
                    fill-rule="nonzero"
                  />
                </svg>
                <select
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="bg-[#E1C9AD] hover:bg-orange-300 text-black font-bold py-2 px-4 rounded-2xl w-44 max-md:w-full max-md:rounded-md focus:outline-none appearance-none"
                >
                  {[...Array(50).keys()].map((i) => (
                    <option key={i} value={(i + 1) * 10}>
                      {(i + 1) * 10} point
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative inline-flex">
                <svg
                  className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none color"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 412 232"
                >
                  <path
                    d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.762-9.763 25.592 0 35.355l189.21 189.211c9.372 9.373 24.749 9.373 34.121 0l189.21-189.211c9.763-9.763 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                    fill="#648299"
                    fill-rule="nonzero"
                  />
                </svg>
                <select
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="bg-[#E1C9AD] hover:bg-orange-300 text-black font-bold py-2 px-4 rounded-2xl w-44 max-md:w-full max-md:rounded-md focus:outline-none appearance-none"
                >
                  {[...Array(60).keys()].map((i) => (
                    <option key={i} value={(i + 1) * 10}>
                      {(i + 1) * 10 < 60
                        ? `${(i + 1) * 10} detik`
                        : convertSecondsToMinutesAndSeconds((i + 1) * 10)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="bg-orange-400 hover:bg-orange-500 text-black font-bold py-2 px-4 rounded-2xl w-44 max-md:hidden"
                onClick={handleSubmit}
              >
                Simpan
              </button>
            </div>
          </div>
          <div className="container mx-auto p-4 text-center">
            <div className="min-h-screen flex flex-col justify-center">
              <div className="relative p-4 bg-[#FF9843] shadow-lg rounded-lg">
                {!selectedFileQuestion && (
                  <label
                    htmlFor="fileInputs"
                    className="absolute top-5 left-5 cursor-pointer z-10 max-md:hidden"
                  >
                    <div className="bg-[#E1C9AD] p-3 rounded-full flex justify-center items-center z-40">
                      <IoMdImages size={30} />
                    </div>
                  </label>
                )}
                <input
                  id="fileInputs"
                  name="fileInputs"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute top-5 left-5 hidden cursor-pointer"
                />

                <div className="relative">
                  {/* ========================================================================================== Text Editor =================================================================== */}

                  <div
                    className={`absolute ${
                      selectedFileQuestion ? "left-[49%]" : "left-[38%]"
                    } ml-auto mr-auto z-10 max-md:left-[2%] max-md:scale-75`}
                  >
                    <div id="toolbar">
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
                      <button class="ql-latex" onClick={handleMath}>
                        <svg viewBox="0 0 18 18">
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
                      <button class="ql-clean"></button>
                    </div>
                  </div>

                  <div
                    className={`${
                      selectedFileQuestion ? "flex w-[100%]" : "relative"
                    }`}
                  >
                    {selectedFileQuestion && (
                      <label
                        htmlFor="fileInputs"
                        className="relative flex justify-center items-start w-[25%] border border-[#ccc] bg-black/50 cursor-pointer"
                      >
                        <span
                          className="close absolute z-50 right-0 top-0"
                          onClick={onDeleteImage}
                        >
                          &times;
                        </span>
                        <div className="relative mt-3 flex w-[100%] h-[100%] justify-center items-center">
                          <img
                            src={selectedFileQuestionUrl}
                            className="object-contain max-w-[300px] max-h-[300px]"
                          ></img>
                        </div>
                      </label>
                    )}
                    <label
                      htmlFor="editor"
                      onClick={() => {
                        document.getElementById("editor").focus();
                      }}
                      className={`${
                        selectedFileQuestion ? "w-[75%]" : "w-full"
                      }`}
                    >
                      <div
                        id="editor"
                        name="editor"
                        ref={editorRef}
                        className={`resize-none border border-white rounded bg-transparent text-center text-white focus:outline-none editor`}
                      ></div>
                    </label>
                  </div>

                  {/* ========================================================================================================================================================================== */}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-5 max-md:grid-cols-1">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 relative"
                    >
                      <input
                        type="radio"
                        id={`answer-${index}`}
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => setSelectedAnswer(index)}
                        name="correctAnswer"
                        className="absolute top-0 left-3 size-4 opacity-0"
                      />
                      <label htmlFor={`answer-${index}`}>
                        <CustomCheckbox isChecked={selectedAnswer === index} />
                      </label>
                      <button
                        class="ql-latex absolute z-10 right-16 left-16 border-2 border-orange-300 p-1 px-3 font-shojumaru text-sm font-semibold text-orange-500 bg-white rounded-lg top-[5px]"
                        onClick={() => handleMathAnswerOption(index)}
                      >
                        Masukan Equation [ f(x) ]
                      </button>
                      <div
                        id={`editorAnswer-${index}`}
                        name={`editorAnswer-${index}`}
                        data-index={index}
                        ref={editorRefAnswer}
                        className={`absolute resize-none w-full p-2 rounded bg-[${colors[index]}] text-center placeholder:text-white text-white font-roboto font-medium text-xl focus:outline-none editorAnswer-${index}`}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="md:hidden w-full bg-white h-fit mt-4">
                  <button
                    className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-md w-80 my-2 md:hidden"
                    onClick={handleSubmit}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuestion;
