import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return <section>
    <div className="cover">{user?.coverImage && <img src={user.coverImage}/>}</div>
    <div className="profile">
      <img className="avatar" src={user?.avatar} />
      <div>
        <h1>{user?.fullName}</h1>
        <p>@{user?.userName}</p>
        <p>{user?.email}</p>
      </div>
      <div className="actions">
        <Link className="btn" to="/profile/edit">Edit Profile</Link>
        <Link className="btn dark" to="/change-password">Change Password</Link>
        <Link className="btn" to={`/channel/${user?.userName}`}>My Channel</Link>
      </div>
    </div>
  </section>;
}