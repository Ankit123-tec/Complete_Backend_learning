import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { videoApi } from "../api/axios";

export default function WatchVideo() {
  const {id}=useParams();
  const [v,setV]=useState(null);
  const [error,setError]=useState("");

  useEffect(()=>{
    // Change /:id if your controller uses another video-detail route.
    videoApi.get(`/${id}`).then(r=>setV(r.data?.data))
      .catch(e=>setError(e.response?.data?.message || "Video detail endpoint is not configured"));
  },[id]);

  if(error) return <div className="panel">{error}</div>;
  if(!v) return <div className="center">Loading video...</div>;

  return <article className="watch">
    <video controls poster={v.thumbnail} src={v.videoFile || v.videoUrl}/>
    <h1>{v.title}</h1>
    <p>{v.description}</p>
  </article>;
}