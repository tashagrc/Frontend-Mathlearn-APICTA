"use client";
import React, { useEffect } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import { AddedUserRecommendation } from "../../../../server/recommendation";
export const CalculateRecommendation = () => {
  const router = useRouter();
  useEffect(() => {
    const storedResult = localStorage.getItem("quizResult");
    if (storedResult) {
      const resultData = JSON.parse(storedResult);

      const body = JSON.stringify({
        eduLevel: resultData.query.eduLevel,
        preferredCategory: resultData.query.preferredCategory,
        preferredDifficulty: resultData.query.preferredDifficulty,
        availableTime: resultData.query.availableTime,
        userAvgScores: resultData.userAvgScores,
        userProgress: resultData.query.userProgress,
      });

      setTimeout(async () => {
        try {
          await AddedUserRecommendation(body);
          localStorage.removeItem("quizResult");
          router.push("/dashboard");
        } catch (error) {
          console.log(error);
          router.push("/user/recommendation");
        }
      }, 5000);
    } else {
      router.push("/user/recommendation");
    }
  }, []);
  return (
    <div className="box bg-orange-400 h-[100vh] overflow-hidden max-md:overflow-scroll w-full flex flex-col justify-center items-center">
      <div class="cube">
        <div class="cube__face" id="cube__face--front">
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
        </div>

        <div class="cube__face" id="cube__face--back">
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
        </div>

        <div class="cube__face" id="cube__face--right">
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
        </div>

        <div class="cube__face" id="cube__face--left">
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
        </div>

        <div class="cube__face" id="cube__face--top">
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
        </div>

        <div class="cube__face" id="cube__face--bottom">
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
          <span class="faceBox"></span>
        </div>
      </div>
      <p className="font-roboto font-bold text-xl mt-28 text-white">
        Mohon untuk tunggu sebentar, kami sedang mempersiapkan quiz untuk kamu
      </p>
    </div>
  );
};

export default CalculateRecommendation;
