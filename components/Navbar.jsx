"use client";
import { React, useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineIntegrationInstructions,
  MdOutlineMoreHoriz,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineLogin,
} from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";
import { MdOutlineLocalLibrary } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import Swal from "sweetalert2";
import { destroyCookie } from "nookies";
import { checkToken, checkRole } from "../server/api";
import {logout} from "../server/auth";
import { useRouter } from 'next/navigation';
import Link from "next/link";

function Navbar({ path: initialPath }) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const router = useRouter();
  const [path, setPath] = useState(initialPath || '/profile');

  const handleClick = (uri) => {
    router.prefetch(uri)
    location.href = uri;
  };

  const verifyToken = async () => {
    const isTokenValid = await checkToken();
    setVerified(isTokenValid);
    setLoading(false);
  };

  const checkRoleUser = async () => {
    const role = await checkRole();
    setRole(role);
  };

  useEffect(() => {
    Promise.all([verifyToken(), checkRoleUser()])
    .then(([tokenResult, roleResult]) => {
    })
    .finally(() => {
    });
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response) {
        Swal.fire({
          title: "Sukses",
          text: "Berhasil Keluar",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Gagal Untuk Keluar",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal Untuk Keluar. Mohon Coba Lagi Nanti.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="border-r border-orange-500 bg-white">
      <Disclosure as="nav">
        <div className="md:flex lg:block p-6 w-1/2 h-screen bg-white z-20 hidden top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start item-center border-orange-500">
            <div
              onClick={() => handleClick("/dashboard")}
              className="text-base text-center cursor-pointer  border-b border-orange-500 pb-4 w-full justify-center items-center flex"
            >
              <img src="/Logo.png" alt="MathLearn Logo" className="w-20 h-20" />
            </div>
            <div className="my-4 border-b border-orange-500 pb-4">
              <div
                onClick={() => handleClick("/dashboard")}
                className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline ${path === '/dashboard' ? 'bg-orange-500' : ''}`}
              >
                <MdOutlineSpaceDashboard className={`text-2xl text-gray-600 group-hover:text-white ${path === '/dashboard' ? 'text-white' : ''}`} />
                <h3 className={`mb-0 text-base text-orange-600 group-hover:text-white font-semibold  ${path === '/dashboard' ? 'text-white' : ''}`}>
                  Eksplorasi kuis
                </h3>
              </div>
              <div
                onClick={() => handleClick("/materi")}
                className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline ${path === '/materi' ? 'bg-orange-500' : ''}`}
              >
                <MdOutlineLocalLibrary className={`text-2xl text-gray-600 group-hover:text-white ${path === '/materi' ? 'text-white' : ''}`} />
                <h3 className={`mb-0 text-base text-orange-600 group-hover:text-white font-semibold  ${path === '/materi' ? 'text-white' : ''}`}>
                  Materi Pembelajaran
                </h3>
              </div>
              <div
                onClick={() => handleClick("/forum")}
                className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline ${path === '/forum' ? 'bg-orange-500' : ''}`}
              >
                <GrGroup className={`text-2xl text-gray-600 group-hover:text-white ${path === '/forum' ? 'text-white' : ''}`} />
                <h3 className={`mb-0 text-base text-orange-600 group-hover:text-white font-semibold  ${path === '/forum' ? 'text-white' : ''}`}>
                  Forum
                </h3>
              </div>
              <div
                onClick={() => handleClick("/leaderboard")}
                className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline ${path === '/leaderboard' ? 'bg-orange-500' : ''}`}
              >
                <MdOutlineAnalytics className={`text-2xl text-gray-600 group-hover:text-white ${path === '/leaderboard' ? 'text-white' : ''}`} />
                <h3 className={`mb-0 text-base text-orange-600 group-hover:text-white font-semibold  ${path === '/leaderboard' ? 'text-white' : ''}`}>
                  Peringkat
                </h3>
              </div>
              <div
                onClick={() => handleClick("/profile")}
                className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline ${path === '/profile' ? 'bg-orange-500' : ''}`}
              >
                <CgProfile  className={`text-2xl text-gray-600 group-hover:text-white ${path === '/profile' ? 'text-white' : ''}`}  />
                <h3 className={`mb-0 text-base text-orange-600 group-hover:text-white font-semibold  ${path === '/profile' ? 'text-white' : ''}`}>
                  Profil
                </h3>
              </div>
              {role == "ROLE_ADMIN" && (
                <div>
                  <div
                    onClick={() => handleClick("/quiz/create")}
                    className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline"
                  >
                    <MdOutlineAddCircleOutline className="text-2xl text-gray-600 group-hover:text-white " />
                    <h3 className="text-base text-orange-600 group-hover:text-white font-semibold mb-0">
                      Create Quiz
                    </h3>
                  </div>
                  <div
                    onClick={() => handleClick("/quiz/draft")}
                    className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto no-underline ${path === '/quiz/draft' ? 'bg-orange-500' : ''}`}
                  >
                    <RiDraftLine className={`text-2xl text-gray-600 group-hover:text-white ${path === '/quiz/draft' ? 'text-white' : ''}`} />
                    <h3 className={`mb-0 text-base text-orange-600 group-hover:text-white font-semibold  ${path === '/quiz/draft' ? 'text-white' : ''}`}>
                      Draft Quiz
                    </h3>
                  </div>
                </div>
              )}
            </div>
            {loading ? (
              <div></div>
            ) : verified ? (
              <div className="my-4" onClick={handleLogout}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-500  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold m-0">
                    Keluar
                  </h3>
                </div>
              </div>
            ) : (
              <div className="my-4" onClick={handleLogin}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-500  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineLogin className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold m-0">
                    Masuk
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default Navbar;
