"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import Swal from "sweetalert2";
import { Register } from "../../components";
import { setCookie } from "nookies";
import { checkToken } from "../../server/api";
import { useRouter } from "next/navigation";
import { authenticate, authenticateOauth, requestChangePassword } from "../../server/auth";
import { LoginComponent } from "../../components/LoginComponen/LoginComponent";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [verified, setVerified] = useState(true);
 
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: "Error!",
        text: "Mohon isi email dan password kamu",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await authenticate(JSON.stringify({ email, password }));
      
      if (response) {
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Berhasil Masuk",
            confirmButtonColor: "#8cbbf1",
          });
          router.push("/dashboard");
        }, 1500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Gagal autentikasi",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#8cbbf1",
        });
        setLoading(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal autentikasi. Mohon coba lagi nanti.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:8080/mathlearns-web-service/oauth2/authorization/google";
  };

  const handleSignUpClick = () => {
    setIsRegistering(true);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      Swal.fire({
        title: "Error!",
        text: "Tolong masukan email kamu",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
    }

    try {
      setIsResetting(true);
      const response = await requestChangePassword(resetEmail);
      Swal.fire({
        title: "Sukses!",
        text: response,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#8cbbf1",
      });
    } finally {
      setIsResetting(false);
      setResetEmail("");
      setIsForgotPassword(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const handleBackToSignInClick = () => {
    setIsForgotPassword(false);
  };

  return (
    <>
      <title>Mathlearn - Masuk Akun</title>
      {verified ? (
        <div></div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 container mx-auto p-4 rounded-md shadow-md border-4 border-orange-600">
            <div className="relative flex flex-col items-center justify-center overflow-hidden border-orange-600">
              <div className="w-full lg:max-w-xl justify-center">
                <div className="flex justify-center items-center border-b-2 border-orange-500 mb-7 border-dashed">
                  <img src="/Logo.png" className="h-44 w-auto"></img>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">Masuk</h2>
                {isRegistering ? (
                  <Register />
                ) : (
                  <>
                    {isForgotPassword ? (
                      <>
                        <form className="mt-6" onSubmit={handleResetPassword}>
                          <div className="rounded-md shadow-sm border-b-2 -space-y-px">
                            <label
                              htmlFor="reset-email"
                              className="rounded-md shadow-sm -space-y-px"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="reset-email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              className="appearance-none rounded-none focus:outline-none active:outline-none px-3 w-[90%]"
                            />
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={handleResetPassword}
                              className="mt-2 font-bold w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
                            >
                              Kirim Reset Email
                            </button>
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={handleBackToSignInClick}
                              className="mt-2 font-bold w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none"
                            >
                              Kembali Ke Halaman Masuk
                            </button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <>
                        <LoginComponent
                          email={email}
                          setEmail={setEmail}
                          password={password}
                          setPassword={setPassword}
                          showPassword={showPassword}
                          handlePasswordVisibility={handlePasswordVisibility}
                          handleLogin={handleLogin}
                          handleGoogleLogin={handleGoogleLogin}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                          loading={loading}
                        />
                      </>
                    )}
                    <p className="mt-4 text-sm text-center text-gray-700">
                      Tidak punya akun?{" "}
                      <Link
                        href="/signup"
                        rel="noindex,nofollow"
                        className="ml-1 underline text-blue-300 hover:text-blue-500"
                      >
                        Mendaftar
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
