// app/leaderboard/page.jsx
import LeaderboardPage from "../../components/Leaderboard/LeaderboardPage";
import "./page.css";

const fetchLeaderboardData = async () => {
  try {
    const response = await fetch(
      "https://mathlearns.my.id/mathlearns-web-service/leaderboard/",
      { cache: 'no-store' }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.slice(0, 10);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
};

const Leaderboard = async () => {
  const leaderboardData = await fetchLeaderboardData();

  return (
    <>
      <LeaderboardPage leaderboardData={leaderboardData} />
    </>
  );
};

export default Leaderboard;
