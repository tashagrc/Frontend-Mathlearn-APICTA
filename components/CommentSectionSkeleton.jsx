import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
    CCard,
    CCardImage,
    CCardBody,
    CCardTitle,
    CCardText,
    CCardFooter,
  } from "@coreui/react";

const CommentSectionSkeleton = () => {
  return (
    <div>
        <Skeleton width={"100%"} height={300} className='border-2'/> 
        <div className='flex flex-col gap-5'>
            {[...Array(6)].map((_, index) => (
                    <CCard
                    key={index} // tambahkan key prop untuk menghindari warning
                    className="bg-white h-full 
                    translate-y-10 flex flex-col"
                    >
                        <CCardBody className="h-32 flex flex-col">
                            <div className='flex flex-row'>
                                <div className="rounded-full flex h-[50px] w-[50px] p-3">
                                    <Skeleton width={50} height={50} circle="true"/> 
                                </div>
                                <div className='ml-5 mt-2'>
                                    <Skeleton width={200} height={20}/> 
                                    <Skeleton width={150} height={20}/> 
                                    <Skeleton width={80} height={20}/> 
                                </div>
                            </div>
                        </CCardBody>
                        <CCardBody className="h-32 flex flex-col ml-6">
                            <div className='flex flex-row'>
                                <div className="rounded-full flex h-[50px] w-[50px] p-3">
                                    <Skeleton width={50} height={50} circle="true"/> 
                                </div>
                                <div className='ml-5 mt-2'>
                                    <Skeleton width={200} height={20}/> 
                                    <Skeleton width={150} height={20}/> 
                                    <Skeleton width={80} height={20}/> 
                                </div>
                            </div>
                        </CCardBody>

                    </CCard>
                ))}
        </div>
    </div>
  )
}

export default CommentSectionSkeleton;