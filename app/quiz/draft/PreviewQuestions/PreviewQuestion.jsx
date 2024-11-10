import React from "react";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";

const PreviewQuestion = ({ question, showAnswer }) => {
  const colorBg = [
    "bg-[#E1C9AD]",
    "bg-[#FFDD95]",
    "bg-[#86A7FC]",
    "bg-[#3468C0]",
  ];

  return (
    <div className="w-[95vw] min-h-[85vh] bg-orange-500 py-6 px-3 rounded-lg flex flex-col justify-center items-center max-2xl:scale-95">
      <div className="w-[70%] h-[70%]">
        <div className="flex gap-3">
          {question.questionImage && (
            <div className="relative flex px-3 justify-center items-center bg-black/50 border border-white rounded-md">
              <img
                src={question.questionImage}
                className="object-contain max-w-[300px] max-h-[300px]"
              ></img>
            </div>
          )}
          <div className="bg-orange-300 border border-white rounded-md p-28 w-full flex justify-center">
            <p className="text-4xl mb-4 text-white font-roboto">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.question, {
                    USE_PROFILES: { mathMl: true, svg: true, html: true },
                  }),
                }}
              />
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-7 my-16 text-center">
          {question.options.map((option, index) => (
            <button
              className={`block mb-[10px] cursor-pointer text-amber-950 text-xl text-center justify-center items-center rounded-2xl ${
                colorBg[index]
              } py-2 px-4 rounded-md hover:bg-blue-600 h-48 w-[100%] text-black font-light font-roboto
              ${showAnswer && option.isValidOption && "bg-green-500"}`}
              key={index}
            >
              <p className="text-3xl">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(option.textOption, {
                      USE_PROFILES: { mathMl: true, svg: true, html: true },
                    }),
                  }}
                />
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewQuestion;
