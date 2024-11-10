import React from "react";
import LeaderboardPages from "../Page/LeaderboardPages";

export const LeaderboardPage = ({ leaderboardData }) => {
  return (
    <>
      <LeaderboardPages leaderboardData={leaderboardData}/>
    </>
  );
};

export default LeaderboardPage;
