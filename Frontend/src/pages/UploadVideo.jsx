import { useState } from "react";
import { videoApi } from "../api/axios";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function UploadVideo() {
  const [f,setF]=useState({title:"",description:""});
  const [video,setVideo]=useState(null);
  const [thumbnail,setThumbnail]=useState(null);
  const navigate=useNavigate();

  async function submit(e){
    e.preventDefault();
    const fd=new FormData();
    fd.append("title",f.title);
    fd.append("description",f.description);
    if(video) fd.append("videoFile",video);
    if(thumbnail) fd.append("thumbnail",thumbnail);

    try {
      // Adjust the endpoint/field names if your video controller differs.
      await videoApi.post("/upload",fd,{headers:{"Content-Type":"multipart/form-data"}});
      alert("Video uploaded");
      navigate("/");
    } catch(e) {
      alert(e.response?.data?.message || "Video upload endpoint/field names need adjustment");
    }
  }

  return <div className="auth wide"><h1>Upload Video</h1><form onSubmit={submit}>
    <input placeholder="Video title" value={f.title} onChange={e=>setF({...f,title:e.target.value})} required/>
    <textarea placeholder="Description" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/>
    <label>Video <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files[0])}/></label>
    <label>Thumbnail <input type="file" accept="image/*" onChange={e=>setThumbnail(e.target.files[0])}/></label>
    <button>Upload Video</button>
  </form></div>;
}