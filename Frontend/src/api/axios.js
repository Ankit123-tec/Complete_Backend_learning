import axios from "axios";
import React from "react";
export const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/users",
  withCredentials: true,
});

export const videoApi = axios.create({
  baseURL: import.meta.env.VITE_VIDEO_API_URL || "http://localhost:8000/api/v1/videos",
  withCredentials: true,
});

export const subscriptionApi = axios.create({
  baseURL: import.meta.env.VITE_SUBSCRIPTION_API_URL || "http://localhost:8000/api/v1/subscriptions",
  withCredentials: true,
});