import { useState } from "react";
import { userApi } from "../api/axios";
import React from "react";

export default function ChangePassword() {
  const [f,setF]=useState({oldPassword:"",newPassword:""});
  async function submit(e){
    e.preventDefault();
    try { await userApi.post("/change-password",f); alert("Password changed"); setF({oldPassword:"",newPassword:""}); }
    catch(e){alert(e.response?.data?.message || "Password change failed");}
  }
  return <div className="auth"><h1>Change Password</h1><form onSubmit={submit}>
    <input type="password" placeholder="Old password" value={f.oldPassword} onChange={e=>setF({...f,oldPassword:e.target.value})}/>
    <input type="password" placeholder="New password" value={f.newPassword} onChange={e=>setF({...f,newPassword:e.target.value})}/>
    <button>Change</button>
  </form></div>;
}