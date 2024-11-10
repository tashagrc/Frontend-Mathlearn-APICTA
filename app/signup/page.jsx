"use client";
import { useState, useEffect } from "react";
import { AiFillEyeInvisible, AiFillEye, AiOutlineGoogle } from "react-icons/ai";
import Swal from "sweetalert2";
import { Login } from "../../components";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies"; // Import setCookie from nookies
import Link from "next/link";
import { checkToken } from "../../server/api";
import { register } from "../../server/auth";
import "./style.css"

function Register() {
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);
  const [role, setRole] = useState("CUSTOMER");
  const router = useRouter();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const [verified, setVerified] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      setVerified(isTokenValid);
      if (isTokenValid) {
        window.location.href = "/dashboard";
      }
    };

    verifyToken();
  }, [checkToken]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password harus lebih dari 8 karakter",
        confirmButtonColor: "#8cbbf1",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await register(
        JSON.stringify({ email, password, age, name, role })
      );
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: `Register Berhasil, ${response}`,
          confirmButtonColor: "#8cbbf1",
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "User Gagal Register",
          confirmButtonColor: "#8cbbf1",
        });
        setLoading(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User Gagal Register. Mohon Coba Lagi Nanti.",
        confirmButtonColor: "#8cbbf1",
      });
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    // Handle Google registration
  };

  return (
    <>
      <title>Mathlearn - Buat Akun</title>
      {verified ? (
        <div></div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 container mx-auto p-4 rounded-md shadow-md border-4 border-orange-600">
            <div className="relative flex flex-col items-center justify-center overflow-hidden">
              <div className="w-full lg:max-w-xl justify-center">
                <div className="flex justify-center items-center border-b-2 border-orange-500 mb-7 border-dashed">
                  <img src="/Logo.png" className="h-44 w-auto"></img>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">Daftar</h2>
                {isRegistering ? (
                  <>
                    <form className="mt-6" onSubmit={handleRegister}>
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-800"
                        >
                          Name
                        </label>
                        <input
                          type="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="age"
                          className="block text-sm font-semibold text-gray-800"
                        >
                          Age
                        </label>
                        <input
                          type="age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                      </div>
                      <div className="mb-2 relative">
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-800"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                      </div>
                      <div className="mb-2 relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-800"
                        >
                          Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        <button
                          onClick={handlePasswordVisibility}
                          type="button"
                          className="absolute text-2xl text-blue mt-3 right-2 top-1/2 transform -translate-y-1/2 text- focus:outline-none"
                        >
                          {showPassword ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </button>
                      </div>

                      <div className="mt-2">
                        <button
                          type="submit"
                          className="font-bold w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue rounded-md hover:bg-blueHover focus:outline-none flex justify-center items-center"
                        >
                          {loading ? (
                            <div class="loader-regist">
                              <div class="bar1"></div>
                              <div class="bar2"></div>
                              <div class="bar3"></div>
                              <div class="bar4"></div>
                              <div class="bar5"></div>
                              <div class="bar6"></div>
                              <div class="bar7"></div>
                              <div class="bar8"></div>
                              <div class="bar9"></div>
                              <div class="bar10"></div>
                              <div class="bar11"></div>
                              <div class="bar12"></div>
                            </div>
                          ) : (
                            "Register"
                          )}
                        </button>
                      </div>
                      {/* <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleGoogleRegister}
                      className="flex items-center justify-center w-full px-4 py-2 text-white transition-colors duration-200 transform bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                      <AiOutlineGoogle className="w-5 h-5 mr-2" />
                      Sign up with Google
                    </button>
                  </div> */}
                    </form>
                    <p className="text-black text-xs italic mt-2 ml-1 mb-7">
                      Sudah mendaftar?
                      <Link
                        href="/login"
                        rel="noindex,nofollow"
                        className="ml-1 underline text-blue-300 hover:text-blue-500"
                      >
                        Masuk
                      </Link>
                    </p>
                  </>
                ) : (
                  <Login />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
