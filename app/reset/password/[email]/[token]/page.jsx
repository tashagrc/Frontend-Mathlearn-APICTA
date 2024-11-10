"use client";
import React, { useEffect, useState } from "react";
import { ChangePassword } from "../../../../../server/auth";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import Swal from "sweetalert2";

const ResetPassword = ({ params }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleCPasswordVisibility = () => setShowCPassword(!showCPassword);

  useEffect(() => {
    if (password.length < 1) {
      setError("Password tidak boleh Kosong");
    } else if (confirmPassword != password) {
      setError("Confirm password tidak sama dengan password");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      password: confirmPassword,
    });

    if (password.length > 0 && password === confirmPassword) {
      try {
        const response = await ChangePassword(body, params.token);
        let timerInterval;
        Swal.fire({
          title: "Sukses!",
          html: `${response}. Kamu akan di redirect ke halaman masuk dalam <b>5</b> detik.`,
          icon: "success",
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEnterKey: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            const content = Swal.getHtmlContainer();
            if (content) {
              const b = content.querySelector("b");
              timerInterval = setInterval(() => {
                const timerLeft = Swal.getTimerLeft();
                if (timerLeft) {
                  if (b) {
                    b.textContent = Math.ceil(timerLeft / 1000);
                  }
                } else {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then(() => {
          window.location.href = "/login";
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#8cbbf1",
        });
      }
    }
  };

  return (
    <>
      <title>Mathlearn - Reset Password User</title>
      <div className="min-h-screen flex items-center">
        <div className="max-w-md w-full space-y-8 container mx-auto p-4 rounded-md shadow-md border-4 border-orange-600">
          <div className="relative flex flex-col items-center justify-center overflow-hidden border-orange-600">
            <div className="w-full lg:max-w-xl justify-center">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Ganti Password
              </h2>
              <form
                className="mt-6"
                method="POST"
                onSubmit={handleChangePassword}
              >
                <div className="mb-2 flex flex-col gap-3">
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Password 🔐
                    </label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md border-orange-600 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <button
                      onClick={handlePasswordVisibility}
                      type="button"
                      className="absolute text-2xl text-blue mt-3 right-2 top-1/2 transform -translate-y-1/2 text- focus:outline-none"
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Confirm Password 🔐
                    </label>
                    <input
                      id="confirmPassword"
                      type={showCPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md border-orange-600 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <button
                      onClick={handleCPasswordVisibility}
                      type="button"
                      className="absolute text-2xl text-blue mt-3 right-2 top-1/2 transform -translate-y-1/2 text- focus:outline-none"
                    >
                      {showCPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                </div>
                <span className="text-red-500">{error}</span>
                <div className="mt-2">
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center rou py-2 px-4 text-sm font-medium rounded-md text-orange-500 bg-white  focus:outline-none  border-orange-600"
                    style={{ border: "1px solid orange" }}
                  >
                    Ganti Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
