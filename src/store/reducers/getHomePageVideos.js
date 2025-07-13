import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { parseData } from "../../utils/parseData";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const getHomePageVideos = createAsyncThunk(
  "youtubeApp/homePageVideos",
  async (isNext, { getState }) => {
    const {
      youtubeApp: { nextPageToken: nextPageTokenFromState, videos },
    } = getState();

    const response = await axios.get("https://youtube.googleapis.com/youtube/v3/videos", {
      params: {
        key: API_KEY,
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        maxResults: 50,
        regionCode: "US",
        ...(isNext && { pageToken: nextPageTokenFromState }),
      },
    });

    const items = response.data.items;
    const parsedData = await parseData(items);
    const nextPageToken = response.data.nextPageToken;

    return {
      parsedData: [...videos, ...parsedData],
      nextPageToken,
    };
  }
);
