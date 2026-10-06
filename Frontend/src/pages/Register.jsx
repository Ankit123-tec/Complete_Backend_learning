import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [f, setF] = useState({fullName:"", userName:"", email:"", password:""});
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(f).forEach(([k,v])=>fd.append(k,v));
    if (avatar) fd.append("avatar", avatar);
    if (coverImage) fd.append("coverImage", coverImage);
    try {
      await register(fd);
      alert("Registered successfully. Login now.");
      navigate("/login");
    } catch (e) {
      alert(e.response?.data?.message || "Registration failed");
    }
  }

  return <div className="auth wide">
    <h1>Create Account</h1>
    <form onSubmit={submit}>
      <input placeholder="Full name" required value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})}/>
      <input placeholder="Username" required value={f.userName} onChange={e=>setF({...f,userName:e.target.value})}/>
      <input type="email" placeholder="Email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
      <input type="password" placeholder="Password" required value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
      <label>Avatar <input type="file" accept="image/*" required onChange={e=>setAvatar(e.target.files[0])}/></label>
      <label>Cover image <input type="file" accept="image/*" onChange={e=>setCoverImage(e.target.files[0])}/></label>
      <button>Register</button>
    </form>
    <p>Already registered? <Link to="/login">Login</Link></p>
  </div>;
}