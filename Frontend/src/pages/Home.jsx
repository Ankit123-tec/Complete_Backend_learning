import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { videoApi } from "../api/axios";
import React from "react";

export default function Home() {
  const [videos,setVideos]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{
    // This is the only video endpoint assumption. Change it if your video controller uses another GET route.
    videoApi.get("/").then(r=>setVideos(r.data?.data || []))
      .catch(e=>setError(e.response?.data?.message || "Video list endpoint is not configured"));
  },[]);

  return <section>
    <div className="hero"><h1>Videos</h1><p>Simple User + Video + Subscription frontend</p></div>
    {error && <div className="panel"><p>{error}</p><small>Set the correct video GET endpoint in Home.jsx.</small></div>}
    <div className="video-grid">
      {videos.map(v=><Link className="video-card" to={`/watch/${v._id}`} key={v._id}>
        {v.thumbnail && <img src={v.thumbnail}/>}
        <h3>{v.title || "Video"}</h3>
        <p>{v.description || ""}</p>
      </Link>)}
    </div>
  </section>;
}