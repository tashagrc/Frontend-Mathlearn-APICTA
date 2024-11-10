import React from 'react'
import "./style.css";
import { getForum } from '../../server/api';
import { ForumPage } from '../../components';

const fetchForumData = async () => {
  try {
    const response = await getForum("", "desc,createdAt", 0);
    return response.data;
  } catch (error) {
    console.error("Error fetching forum data:", error);
    return [];
  }
}

export const Forum = async () => {
  const forumData = await fetchForumData();

  return (
    <ForumPage forumData={forumData} />
  )
}

export default Forum;