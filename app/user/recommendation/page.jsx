"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export const Recommendation = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");

  const slideVariants = {
    forward: {
      enter: {
        opacity: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        x: "100%",
      },
    },
    backward: {
      enter: {
        opacity: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        x: "-100%",
      },
    },
  };

  const [formData, setFormData] = useState({
    eduLevel: "",
    experience: "",
    availableTime: "",
    confidence: "",
    difficulty: "",
    category: "",
    comfortLevel: "",
    userProgress: "30",
    userAvgScores: "0",
  });

  const handleButtonClick = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const goForward = (e) => {
    e.preventDefault();
    setDirection("forward");
    setStep((prevStep) => prevStep + 1);
  };

  const goBack = (e) => {
    e.preventDefault();
    setDirection("backward");
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      eduLevel,
      experience,
      confidence,
      difficulty,
      category,
      comfortLevel,
    } = formData;

    const level = determineLevel(
      eduLevel,
      experience,
      confidence,
      difficulty,
      category,
      comfortLevel
    );

    const levelLevel = level.level;
    const categoryLevel = level.categoryLevel;
    const combinedData = {
      ...formData,
      levelLevel,
      categoryLevel,
    };
    const queryString = new URLSearchParams(combinedData).toString();
    router.push(`/user/recommendation/quiz-test?${queryString}`);
  };

  const determineLevel = (
    eduLevel,
    experience,
    confidence,
    difficulty,
    category,
    comfortLevel
  ) => {
    let level = "EASY";
    let categoryLevel = "BASIC";

    if (experience === "Sangat sering" || confidence === "Sangat tinggi") {
      level = difficulty === "Sulit" ? "HARD" : "MEDIUM";
    } else if (experience === "Sering" || confidence === "Tinggi") {
      level = difficulty === "Sulit" ? "HARD" : "MEDIUM";
    } else if (experience === "Kadang-kadang" || confidence === "Cukup") {
      level = difficulty === "Sedang" ? "MEDIUM" : "EASY";
    } else {
      level = difficulty === "Mudah" ? "EASY" : "MEDIUM";
    }

    switch (category || comfortLevel) {
      case "Dasar":
        categoryLevel = "BASIC";
        break;
      case "Menengah":
        categoryLevel = "INTERMEDIATE";
        break;
      case "Lanjutan":
        categoryLevel = "ADVANCED";
        break;
      default:
        categoryLevel = "BASIC";
    }

    switch (eduLevel) {
      case "SD":
        level = level === "Hard" ? "Medium" : level;
        categoryLevel = "BASIC";
        break;
      case "SMP":
        if (level === "Easy" && difficulty === "Sedang") {
          level = "Medium";
        }
        categoryLevel =
          categoryLevel === "BASIC" ? "INTERMEDIATE" : categoryLevel;
        break;
      case "SMA":
        categoryLevel =
          categoryLevel === "BASIC" ? "INTERMEDIATE" : categoryLevel;
        break;
      case "KULIAH":
        categoryLevel =
          categoryLevel === "BASIC" ? "INTERMEDIATE" : categoryLevel;
        break;
      default:
        break;
    }

    return {
      level,
      categoryLevel,
    };
  };

  return (
    <>
      <title>Mathlearn - Rekomendasi Quiz</title>

      <div className="box bg-orange-400 h-[100vh] overflow-hidden max-md:overflow-scroll w-full">
        <div className="flex justify-center items-center w-full h-full">
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div className="w-full h-full">
                  <div className="flex flex-col h-[80vh] justify-center items-center">
                    <h1 className="text-5xl font-roboto font-bold text-white">
                      Selamat Datang di Mathlearns
                    </h1>
                  </div>
                  <div className="w-full flex flex-row-reverse">
                    <button
                      type="button"
                      className="px-5 py-3 bg-green-500 outline-none font-bold font-roboto text-white rounded-lg"
                      onClick={(e) => goForward(e)}
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => goForward(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                          Di tingkat pendidikan mana Anda saat ini?
                        </h2>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.eduLevel === "SD"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() => handleButtonClick("eduLevel", "SD")}
                          >
                            SD
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.eduLevel === "SMP"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() => handleButtonClick("eduLevel", "SMP")}
                          >
                            SMP
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.eduLevel === "SMA"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() => handleButtonClick("eduLevel", "SMA")}
                          >
                            SMA
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.eduLevel === "KULIAH"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("eduLevel", "KULIAH")
                            }
                          >
                            Perguruan Tinggi
                          </button>
                          <button
                            type="button"
                            className={`text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.eduLevel === "Lainnya"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("eduLevel", "Lainnya")
                            }
                          >
                            Lainnya
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => goForward(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                          Seberapa sering Anda berlatih matematika?
                        </h2>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.experience === "Jarang"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("experience", "Jarang")
                            }
                          >
                            Jarang
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.experience === "Kadang-kadang"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("experience", "Kadang-kadang")
                            }
                          >
                            Kadang-kadang
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.experience === "Sering"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("experience", "Sering")
                            }
                          >
                            Sering
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.experience === "Sangat sering"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("experience", "Sangat sering")
                            }
                          >
                            Sangat sering
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-3 bg-red-500 outline-none font-bold font-roboto text-white rounded-lg w-full mt-5"
                        onClick={(e) => goBack(e)}
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => goForward(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                          Berapa lama waktu yang Anda perlukan untuk
                          latihan/belajar Matematika?
                        </h2>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.availableTime === "15"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("availableTime", "15")
                            }
                          >
                            15 Menit
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.availableTime === "30"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("availableTime", "30")
                            }
                          >
                            30 Menit
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.availableTime === "45"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("availableTime", "45")
                            }
                          >
                            45 Menit
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.availableTime === "60"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("availableTime", "60")
                            }
                          >
                            1 Jam
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-3 bg-red-500 outline-none font-bold font-roboto text-white rounded-lg w-full mt-5"
                        onClick={(e) => goBack(e)}
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => goForward(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                          Bagaimana tingkat kepercayaan diri Anda saat
                          menyelesaikan soal/quiz matematika?
                        </h2>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.confidence === "Rendah"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("confidence", "Rendah")
                            }
                          >
                            Rendah
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.confidence === "Cukup"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("confidence", "Cukup")
                            }
                          >
                            Cukup
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.confidence === "Tinggi"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("confidence", "Tinggi")
                            }
                          >
                            Tinggi
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.confidence === "Sangat tinggi"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("confidence", "Sangat tinggi")
                            }
                          >
                            Sangat tinggi
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-3 bg-red-500 outline-none font-bold font-roboto text-white rounded-lg w-full mt-5"
                        onClick={(e) => goBack(e)}
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => goForward(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                          Dalam konteks umumnya, seberapa sulit Anda merasa
                          soal/quiz matematika biasanya?
                        </h2>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.difficulty === "Mudah"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("difficulty", "Mudah")
                            }
                          >
                            Mudah
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.difficulty === "Sedang"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("difficulty", "Sedang")
                            }
                          >
                            Sedang
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.difficulty === "Sulit"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("difficulty", "Sulit")
                            }
                          >
                            Sulit
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-3 bg-red-500 outline-none font-bold font-roboto text-white rounded-lg w-full mt-5"
                        onClick={(e) => goBack(e)}
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div
                key="step7"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => goForward(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <label>
                          <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Dalam kategori apa Anda merasa paling nyaman atau
                            paling sering bekerja dengan soal matematika?
                          </h2>
                          <div className="text-gray-600 text-sm">
                            Pilih kategori yang paling sesuai dengan pengalaman
                            Anda:
                            <ul className="list-disc ml-5">
                              <li>
                                <strong>Dasar (Basic):</strong> Soal dasar untuk
                                pemula, seperti aritmatika sederhana.
                              </li>
                              <li>
                                <strong>Menengah (Intermediate):</strong> Soal
                                dengan konsep yang lebih kompleks, seperti
                                aljabar atau geometri.
                              </li>
                              <li>
                                <strong>Lanjutan (Advanced):</strong> Soal yang
                                memerlukan pengetahuan lanjutan, seperti
                                kalkulus atau statistik.
                              </li>
                            </ul>
                          </div>
                        </label>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.category === "Dasar"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("category", "Dasar")
                            }
                          >
                            Dasar
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.category === "Menengah"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("category", "Menengah")
                            }
                          >
                            Menengah
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.category === "Lanjutan"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("category", "Lanjutan")
                            }
                          >
                            Lanjutan
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-3 bg-red-500 outline-none font-bold font-roboto text-white rounded-lg w-full mt-5"
                        onClick={(e) => goBack(e)}
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 8 && (
              <motion.div
                key="step8"
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? "100%" : "-100%",
                }}
                transition={{ duration: 0.5 }}
                variants={slideVariants[direction]}
              >
                <div>
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="flex justify-center items-center h-screen flex-col">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <label>
                          <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Apakah Anda merasa lebih nyaman dengan konsep-konsep
                            dasar atau yang lebih kompleks?
                          </h2>
                          <div className="text-gray-600 text-sm">
                            Pilih salah satu opsi berikut:
                            <ul className="list-disc ml-5">
                              <li>
                                <strong>Konsep Dasar:</strong> Misalnya, operasi
                                dasar seperti penjumlahan, pengurangan,
                                perkalian, dan pembagian.
                              </li>
                              <li>
                                <strong>Konsep Menengah:</strong> Misalnya,
                                aljabar, geometri, atau trigonometri dasar.
                              </li>
                              <li>
                                <strong>Konsep Lanjutan:</strong> Misalnya,
                                kalkulus, statistik, atau teori bilangan.
                              </li>
                            </ul>
                          </div>
                        </label>
                        <div className="flex flex-col gap-3">
                          <button
                            type="submit"
                            className={`bg-green-500 text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.comfortLevel === "Konsep dasar"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick("comfortLevel", "Konsep dasar")
                            }
                          >
                            Konsep dasar
                          </button>
                          <button
                            type="submit"
                            className={`bg-green-500 text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.comfortLevel === "Konsep menengah"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick(
                                "comfortLevel",
                                "Konsep menengah"
                              )
                            }
                          >
                            Konsep menengah
                          </button>
                          <button
                            type="submit"
                            className={` text-white rounded-lg py-3 text-lg font-medium cursor-pointer transition-transform transform ${
                              formData.comfortLevel === "Konsep lanjutan"
                                ? "bg-green-400"
                                : "bg-green-500 hover:bg-green-400"
                            } active:scale-95`}
                            onClick={() =>
                              handleButtonClick(
                                "comfortLevel",
                                "Konsep lanjutan"
                              )
                            }
                          >
                            Konsep lanjutan
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-3 bg-red-500 outline-none font-bold font-roboto text-white rounded-lg w-full mt-5"
                        onClick={(e) => goBack(e)}
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Recommendation;
