"use client";
import React, { useState, useEffect, useRef } from "react";
import { getHeaderPoint, checkToken } from "../server/api";
import "./Navbar2.css"; // Import your CSS file for Navbar styling
import NavbarSkeleton from "../components/NavbarSkeleton";

const Navbar = () => {
  const [headerPoint, setHeaderPoint] = useState({});
  const [loading, setLoading] = useState(true);
  const [verif, setVerif] = useState(false);

  const fetchHeaderData = async () => {
    try {
      const response = await getHeaderPoint();
      setHeaderPoint(response);
      setLoading(false);
    } catch (error) {}
  };

  const checkAuth = async () => {
    const response = await checkToken();
    setVerif(response);
  };

  useEffect(() => {
    Promise.all([checkAuth(), fetchHeaderData()])
    .then(([tokenResult, roleResult]) => {
    })
    .finally(() => {
    });
  }, []);

  return (
    <>
      {verif ? (
        <div>
          {loading ? (
            <div>
              <NavbarSkeleton />
            </div>
          ) : (
            <nav className="navbar max-md:justify-center">
              <div className="left-side"></div>
              <div className="right-side flex gap-5 my-4 mx-16">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src="/komunitas.png"
                    alt="Logo 1"
                    className="w-14 h-14"
                  />
                  <p className="text-black max-md:text-sm">
                    {headerPoint?.communityScores} Points
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <img src="/skor.png" alt="Logo 2" className="w-14 h-14" />
                  <p className="text-black max-md:text-sm">
                    {headerPoint?.scores} XP
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <a
                    href="/profile/riwayat"
                    className="logo-button no-underline flex justify-center items-center flex-col"
                  >
                    <img
                      src="/riwayat.png"
                      alt="Logo Button 1"
                      className="w-14 h-14"
                    />
                    <p className="text-black max-md:text-sm">
                      {headerPoint?.userQuizCount} Kuis
                    </p>
                  </a>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <a
                    href="/profile"
                    className="logo-button no-underline flex justify-center items-center flex-col"
                  >
                    {headerPoint?.imageAvatar ? (
                      <img
                        src={headerPoint?.imageAvatar}
                        alt="Logo Button 2"
                        className="w-14 h-14 rounded-full object-cover object-center"
                      />
                    ) : (
                      <img
                        src={"/profil.png"}
                        alt="Logo Button 2"
                        className="w-14 h-14 rounded-full"
                      />
                    )}
                    <p className="text-black max-md:text-sm">
                      {headerPoint?.name}
                    </p>
                  </a>
                </div>
              </div>
            </nav>
          )}
        </div>
      ) : (
        <div className="p-10"></div>
      )}
    </>
  );
};

export default Navbar;
