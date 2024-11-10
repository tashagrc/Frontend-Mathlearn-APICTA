"use client"
import React, { useEffect, useState } from 'react'
import { Navbar2 } from '../../../../components';
import {getQuizDetail} from '../../../../server/api'

const QuisDetail = ({params}) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchQuizDetail = async () => 
    {
        if(loading){
            try {
                const response = await getQuizDetail(params.id.split('_')[0]);
                setQuiz(response);
                setLoading(false);
              } catch (error) {
                console.error("Error fetching quiz data:", error);
              }
        }
    }

    useEffect(() => {
        fetchQuizDetail();
    })

  return (
    <div>
        <Navbar2 />
        {quiz?.title} <br></br>
        {quiz?.difficulty}<br></br>
        {quiz?.totalQuestions}<br></br>
        {quiz?.likes}<br></br>
        {quiz?.totalPlays}<br></br>
        {
          quiz?.isTaking == true ? (
            <div>sudah di ambil</div>
          ) : (
            <div></div>
          )
        }<br></br>
    </div>
  )
}

export default QuisDetail;