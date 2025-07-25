import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { parseRecommendedData } from "../../utils/parseRecommendendData";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const getRecommendedVideos = createAsyncThunk(
  "youtubeApp/getRecommendedVideos",
  async (videoId, { getState }) => {
    const {
      youtubeApp: {
        currentPlaying: {
          channelInfo: { id: channelId },
        },
      },
    } = getState();

    const response = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          channelId: channelId,
          part: "snippet",
          maxResults: 20,
          type: "video",
        },
      }
    );

    const items = response.data.items;
    const parsedData = await parseRecommendedData(items, videoId);

    return { parsedData };
  }
);
