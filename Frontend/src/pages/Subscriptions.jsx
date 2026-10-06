import { useEffect, useState } from "react";
import { subscriptionApi } from "../api/axios";
import React from "react";

export default function Subscriptions() {
  const [items,setItems]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{
    // If your subscription controller has a different endpoint, change only this path.
    subscriptionApi.get("/").then(r=>setItems(r.data?.data || []))
      .catch(e=>setError(e.response?.data?.message || "Subscription list endpoint is not configured"));
  },[]);

  return <section>
    <h1>My Subscriptions</h1>
    {error ? <div className="panel"><p>{error}</p><small>Set the correct subscription GET endpoint in Subscriptions.jsx.</small></div> :
      <div className="list">{items.map((x,i)=><div className="list-item" key={x._id||i}>
        <img className="mini-avatar" src={x.avatar || x.channel?.avatar}/>
        <div><b>{x.fullName || x.channel?.fullName || "Channel"}</b><p>@{x.userName || x.channel?.userName}</p></div>
      </div>)}</div>}
  </section>;
}