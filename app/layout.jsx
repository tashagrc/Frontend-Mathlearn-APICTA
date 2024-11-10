"use client";

import React, { useEffect, useRef, useState } from "react";
import {checkToken } from "../server/api";
import {refreshTokenUser, checkAuthGen, reAuthenticate} from "../server/auth"
import "./globals.css";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ['latin'],
  style: "normal"
})

export default function RootLayout({ children }) {
  const refreshTokenIntervalRef = useRef(null);
  const lastRefreshTimeRef = useRef(Date.now());
  const time = 3480000;

  const refreshToken = async () => {
    await refreshTokenUser();
    lastRefreshTimeRef.current = Date.now();
  };

  useEffect(() => {
    const reAuth = async () => {
      if (await checkAuthGen()) {
        await reAuthenticate();
      }
    };
    reAuth();
  }, []);  

  useEffect(() => {
    const remainingTime = time - (Date.now() - lastRefreshTimeRef.current);

    const initialTimeout = setTimeout(() => {
      refreshToken();
      refreshTokenIntervalRef.current = setInterval(refreshToken, time);
    }, remainingTime > 0 ? remainingTime : 0);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(refreshTokenIntervalRef.current);
    };
  }, [time]);

  useEffect(() => {
    const refreshTokenApply = async () => {
      if (!(await checkToken()) || Date.now() - lastRefreshTimeRef.current >= time) {
        console.log("refresh token");
        await refreshToken();
      }
    };
    refreshTokenApply();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Belajar Matematika - Salah Satu Sumber Pembelajaran Matematika Untuk Anda</title>
        <meta name="description" content="Mathlearn adalah aplikasi web komprehensif yang menawarkan materi pembelajaran, latihan soal atau quiz, dan alat interaktif untuk membantu Anda menguasai matematika di semua tingkatan. Bergabunglah dengan komunitas kami dan tingkatkan keterampilan matematika Anda hari ini!" />
        <meta name="keywords" content="Mathlearn, tutorial matematika, latihan soal matematika, alat interaktif matematika, belajar matematika online, sumber matematika, komunitas matematika, pembelajaran matematika, matematika SD, matematika SMP, matematika SMA, soal matematika, materi matematika, video pembelajaran matematika, quiz matematika, forum matematika kalkulator matematika, tugas kuliah, skripsi" />
        <meta name="author" content="Tim Mathlearn" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Freehand&display=swap"
        />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"></link>
        <link rel="icon" href="/Logo.ico" type="image/x-icon" />
      </head>

      <body className="font-roboto">
        <main className={roboto.className}>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
