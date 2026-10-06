import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userApi, subscriptionApi } from "../api/axios";
import React from "react";
export default function Channel() {
  const { username }=useParams();
  const [c,setC]=useState(null);

  useEffect(()=>{
    userApi.post(`/c/${username}`).then(r=>setC(r.data?.data))
      .catch(e=>alert(e.response?.data?.message || "Channel not found"));
  },[username]);

  async function subscribe(){
    try {
      // Change these two paths if your subscription controller uses different names.
      await subscriptionApi.post(`/subscribe/${username}`);
      const r=await userApi.post(`/c/${username}`);
      setC(r.data?.data);
    } catch(e) {
      alert(e.response?.data?.message || "Subscription API endpoint is not configured");
    }
  }

  if(!c) return <div className="center">Loading...</div>;
  return <section>
    <div className="cover">{c.coverImage && <img src={c.coverImage}/>}</div>
    <div className="profile">
      <img className="avatar" src={c.avtar || c.avatar}/>
      <div><h1>{c.fullname || c.fullName}</h1><p>@{c.username || c.userName}</p>
      <p>{c.subscriptionCount || 0} subscribers</p></div>
      <button onClick={subscribe}>{c.isSubscribed ? "Subscribed" : "Subscribe"}</button>
    </div>
  </section>;
}