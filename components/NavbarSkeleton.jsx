import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const NavbarSkeleton = () => {
  return (
    <nav className="navbar max-md:justify-center">
          <div className="left-side"></div>
          <div className="right-side flex gap-5 my-4 mx-16">
            <div className="flex flex-col justify-center items-center">
              <Skeleton width={50} height={50}/> 
              <Skeleton width={55} height={15}/> 
            </div>
            <div className="flex flex-col justify-center items-center">
              <Skeleton width={50} height={50}/> 
              <Skeleton width={55} height={15}/> 
            </div>
            <div className="flex flex-col justify-center items-center">
              <a
                href="/profile/riwayat"
                className="logo-button no-underline flex justify-center items-center flex-col"
              >
                <Skeleton width={50} height={50}/> 
                <Skeleton width={55} height={15}/> 
              </a>
            </div>
            <div className="flex flex-col justify-center items-center">
              <a
                href="/profile"
                className="logo-button no-underline flex justify-center items-center flex-col"
              >
                <Skeleton width={50} height={50}/> 
                <Skeleton width={55} height={15}/> 
              </a>
            </div>
          </div>
        </nav>
  )
}

export default NavbarSkeleton;
