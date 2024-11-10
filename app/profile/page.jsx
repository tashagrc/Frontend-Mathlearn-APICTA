"use client";

import React, { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Navbar from "../../components/Navbar";
import {
  checkToken,
  getProfile,
  updateProfile,
  changePassword,
  updateImageAvatar
} from "../../server/api";
import { Navbar2, NavbarSideMD, Tab } from "../../components";
import { Footer } from "flowbite-react";
import { RxHamburgerMenu } from "react-icons/rx";
import Swal from "sweetalert2";

export default function profile() {
  const [verified, setVerified] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dataUpdated, setData] = useState({
    name: "",
    email: "",
  });
  const [passwordUpdated, setPasswordUpdated] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [toggleNavbar, setTogle] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      setVerified(isTokenValid);
      if (!isTokenValid) {
        window.location.href = "/login";
      }
    };

    verifyToken();
  }, [checkToken]);

  const getProfiles = async () => {
    const response = await getProfile();
    setProfile(response);
  };

  useEffect(() => {
    getProfiles();
  }, []);

  const handleUpdateProfile = async () => {
    await updateProfile(dataUpdated);
    window.location.reload();
  };

  const handleChangePassword = async () => {
    response = await changePassword(passwordUpdated);
    window.location.reload();
  };

  const handleFileChangeAvatar = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("filesAvatarUser", file);
      try{
        const response = await updateImageAvatar(formData);
        if(response){
          Swal.fire({
            icon: "info",
            title: "Success",
            text: "Upload gambar suskes",
            confirmButtonColor: "#8cbbf1",
          });
          await getProfiles();
        }else{
          Swal.fire({
            title: "Error!",
            text: "Upload gambar gagal",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#8cbbf1",
          });
        }
      }catch(error){
        Swal.fire({
          title: "Error!",
          text: "Upload gambar gagal, coba lagi nanti",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#8cbbf1",
        });
      }
      
    }
  };

  return (
    <>
      <title>Mathlearn - Profil Pengguna</title>
      {verified ? (
        <div className="flex flex-row">
          {/* <div className="md:hidden mt-7"></div> */}
          <Navbar path={"/profile"} />
          <div className="flex flex-col w-full">
            <div className="max-md:hidden">
              <Navbar2 />
            </div>
            <div
              className={`md:hidden ${toggleNavbar == false ? "hidden" : ""}`}
            >
              <NavbarSideMD
                path={"/profile"}
                setToggle={setTogle}
                toggle={toggleNavbar}
              />
            </div>
            <div className="justify-center items-center flex my-2 mb-20 flex-col max-md:my-5">
              <div className="md:hidden w-full px-3 mb-5">
                <button
                  className="p-0 ml-1"
                  onClick={() => setTogle(!toggleNavbar)}
                >
                  <RxHamburgerMenu className="text-2xl" />
                </button>
              </div>
              <div className="w-[90%] max-md:w-full max-md:px-3">
                <Tab path={"/profile"} />
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="col-span-full mb-7">
                      <h2 className="text-center rounded-xl bg-orange-400 px-14 py-3 text-3xl font-semibold text-white shadow-sm">
                        Profil
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600 font-bold">
                        *Informasi ini akan ditampilkan secara publik jadi
                        berhati-hatilah dengan apa yang Anda bagikan.
                      </p>
                    </div>

                    <div className="col-span-full">
                      <div className="block text-sm font-semibold leading-6 text-gray-900">
                        Avatar
                      </div>
                      <div className="mt-2 flex items-center gap-x-3">
                        {profile?.imageAvatar ? (
                          <img
                            src={profile.imageAvatar}
                            alt="User Avatar"
                            className="h-16 w-16 rounded-full object-cover object-center"
                          />
                        ) : (
                          <UserCircleIcon
                            className="h-16 w-16 text-gray-300  "
                            aria-hidden="true"
                          />
                        )}
                        <label htmlFor="fileInputAvatar" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
                            Change
                        </label>
                        <input
                          id="fileInputAvatar"
                          name="fileInputAvatar"
                          type="file"
                          onChange={handleFileChangeAvatar}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile}>
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Nama
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-orange-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 sm:max-w-md">
                              <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                Mathlearns.com/
                              </span>
                              <input
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="username"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-1 sm:text-sm sm:leading-6 focus:ring-orange-500 ring-orange-500"
                                defaultValue={profile?.name}
                                onChange={(e) => {
                                  setData({
                                    ...dataUpdated,
                                    name: e.target.value,
                                  });
                                }}
                                placeholder="janesmith"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-orange-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 sm:max-w-md">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                defaultValue={profile?.email}
                                onChange={(e) => {
                                  setData({
                                    ...dataUpdated,
                                    email: e.target.value,
                                  });
                                }}
                                placeholder="emailku@gmail.com"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="submit"
                          className="rounded-xl bg-orange-400 px-14 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </form>
                  </div>

                  <form
                    className="border-b border-gray-900/10 pb-12"
                    onSubmit={handleChangePassword}
                  >
                    <h2 className=" text-center rounded-xl bg-orange-400 px-14 py-3 text-3xl font-semibold text-white shadow-sm">
                      Password
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="oldPassword"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password Sekarang
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="oldPassword"
                            id="oldPassword"
                            autoComplete="oldPassword"
                            className="block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                            onChange={(e) => {
                              setPasswordUpdated({
                                ...passwordUpdated,
                                oldPassword: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password Baru
                        </label>
                        <div className="mt-2">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="text"
                            autoComplete="newPassword"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                            onChange={(e) => {
                              setPasswordUpdated({
                                ...passwordUpdated,
                                newPassword: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6 ">
                      <button
                        type="submit"
                        className="rounded-xl bg-orange-400 px-14 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      >
                        Perbarui password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
