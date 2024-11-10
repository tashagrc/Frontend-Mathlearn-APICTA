import React from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import "./style.css"

export const LoginComponent = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  handlePasswordVisibility,
  handleLogin,
  handleGoogleLogin,
  handleForgotPasswordClick,
  loading,
}) => {
  return (
    <div>
      <form className="mt-6" method="POST" onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800"
          >
            Email ✉️
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md border-orange-600  focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        <div className="mb-2 relative">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-800"
          >
            Password 🔐
          </label>
          <input
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
        <div className="mt-2">
          <button
            type="submit"
            className="group relative w-full flex justify-center rou py-2 px-4 text-sm font-medium rounded-md text-orange-500 bg-white  focus:outline-none  border-orange-600"
            style={{ border: "1px solid orange" }}
          >
            {loading ? (
              <div class="loader">
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
              "Masuk"
            )}
          </button>
        </div>
        {/* <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center rou py-2 px-4 text-sm font-medium rounded-md text-orange-500 bg-white  focus:outline-none  border-orange-600"
            style={{ border: "1px solid orange" }}
          >
            Masuk dengan Google
          </button>
        </div> */}
        <button
          type="button"
          onClick={handleForgotPasswordClick}
          className="text-xs text-blue-600 hover:underline"
        >
          Lupa Password?
        </button>
      </form>
    </div>
  );
};
