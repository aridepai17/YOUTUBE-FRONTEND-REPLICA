import axios from "axios";
import React from "react";
import { parseVideoDuration } from "./parseVideoDuration";
import { convertRawtoString } from "./convertRawtoString";
import { timeSince } from "./timeSince";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const parseData = async (items) => {
  try {
    const videoIds = [];
    const channelIds = [];

    items.forEach((item) => {
      const videoId = item.id?.videoId || item.id;
      videoIds.push(videoId);
      channelIds.push(item.snippet.channelId);
    });

    // Fetch channel data
    const {
      data: { items: channelsData },
    } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(
        ","
      )}&key=${API_KEY}`
    );

    const channelMap = {};
    channelsData.forEach((channel) => {
      channelMap[channel.id] = {
        image: channel.snippet.thumbnails.default.url,
      };
    });

    // Fetch video stats
    const {
      data: { items: videosData },
    } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(
        ","
      )}&key=${API_KEY}`
    );

    const videoMap = {};
    videosData.forEach((video) => {
      videoMap[video.id] = {
        duration: video.contentDetails.duration,
        views: video.statistics.viewCount,
      };
    });

    // Parse final result
    const parsedData = [];

    items.forEach((item) => {
      const videoId = item.id?.videoId || item.id;
      const videoInfo = videoMap[videoId];
      const channelInfo = channelMap[item.snippet.channelId];

      if (videoInfo && channelInfo) {
        parsedData.push({
          videoId,
          videoTitle: item.snippet.title,
          videoDescription: item.snippet.description,
          videoThumbnail: item.snippet.thumbnails.medium.url,
          videoLink: `https://www.youtube.com/watch?v=${videoId}`,
          videoDuration: parseVideoDuration(videoInfo.duration),
          videoViews: convertRawtoString(videoInfo.views),
          videoAge: timeSince(new Date(item.snippet.publishedAt)),
          channelInfo: {
            id: item.snippet.channelId,
            image: channelInfo.image,
            name: item.snippet.channelTitle,
          },
        });
      }
    });

    return parsedData;
  } catch (err) {
    console.log("Error parsing data:", err);
  }
};