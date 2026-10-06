import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/axios";
import React from "react";

export default function EditProfile() {
  const { user, currentUser } = useAuth();
  const [f,setF] = useState({fullName:"",email:""});
  const [avatar,setAvatar] = useState(null);
  const [cover,setCover] = useState(null);

  useEffect(()=>{ if(user) setF({fullName:user.fullName||"",email:user.email||""}); },[user]);

  async function details(e) {
    e.preventDefault();
    try { await userApi.patch("/update_details",f); await currentUser(); alert("Details updated"); }
    catch(e){alert(e.response?.data?.message || "Update failed");}
  }
  async function avatarUpdate() {
    if(!avatar) return alert("Choose avatar");
    const fd=new FormData(); fd.append("avatar",avatar);
    try { await userApi.patch("/avtar-update",fd); await currentUser(); alert("Avatar updated"); }
    catch(e){alert(e.response?.data?.message || "Avatar update failed");}
  }
  async function coverUpdate() {
    if(!cover) return alert("Choose cover");
    const fd=new FormData(); fd.append("coverImage",cover);
    try { await userApi.patch("/coverImage-update",fd); await currentUser(); alert("Cover updated"); }
    catch(e){alert(e.response?.data?.message || "Cover update failed");}
  }

  return <div className="form-page">
    <h1>Edit Profile</h1>
    <div className="panel"><h2>Details</h2><form onSubmit={details}>
      <input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})}/>
      <input value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
      <button>Save</button>
    </form></div>
    <div className="panel"><h2>Avatar</h2><input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])}/><button onClick={avatarUpdate}>Update Avatar</button></div>
    <div className="panel"><h2>Cover</h2><input type="file" accept="image/*" onChange={e=>setCover(e.target.files[0])}/><button onClick={coverUpdate}>Update Cover</button></div>
  </div>;
}