"use client"
import React from "react";
import { Navbar, Navbar2, NavbarSideMD } from "../../components";
import { RxHamburgerMenu } from "react-icons/rx";

const LeaderboardPages = ({ leaderboardData }) => {
  const [toggleNavbar, setTogle] = React.useState(false);

  return (
    <>
      <title>Mathlearn - Leaderboard Matematika</title>

      <div className="flex flex-row">
        <Navbar path={"/leaderboard"} />
        <div className="flex flex-col w-full">
          <div className="max-md:hidden">
            <Navbar2 />
          </div>
          <div className={`md:hidden ${toggleNavbar === false ? "hidden" : ""}`}>
            <NavbarSideMD
              path={"/quiz/draft"}
              setToggle={setTogle}
              toggle={toggleNavbar}
            />
          </div>
          <button
            className="px-2 pt-3 mb-5 md:hidden"
            onClick={() => setTogle(!toggleNavbar)}
          >
            <RxHamburgerMenu className="text-2xl" />
          </button>
          <div className="flex justify-center items-center text-center my-2">
            <div className="container">
              <h1>
                <strong>Peringkat</strong>
              </h1>
              <LeaderboardTable leaderboardData={leaderboardData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LeaderboardTable = React.memo(({ leaderboardData }) => (
  <table>
    <thead>
      <tr>
        <th>Rank 🏅</th>
        <th>Name 🧔</th>
        <th>Score 💯</th>
      </tr>
    </thead>
    <tbody>
      {leaderboardData.map((player, index) => (
        <LeaderboardRow key={index} player={player} index={index} />
      ))}
    </tbody>
  </table>
));

const LeaderboardRow = React.memo(({ player, index }) => (
  <tr>
    <td>
      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
    </td>
    <td>{player.name}</td>
    <td>{player.scores}</td>
  </tr>
));

export default LeaderboardPages;
