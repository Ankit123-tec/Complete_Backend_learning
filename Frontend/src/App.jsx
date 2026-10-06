import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Protected from "./components/Protected";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

import Home from "./pages/Home";
import UploadVideo from "./pages/UploadVideo";
import WatchVideo from "./pages/WatchVideo";

import Channel from "./pages/Channel";
import Subscriptions from "./pages/Subscriptions";


function App() {

    return (
        <>

            <Navbar />

            <main className="container">

                <Routes>

                    {/* Home */}
                    <Route
                        path="/"
                        element={<Home />}
                    />


                    {/* Authentication */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* Protected Routes */}
                    <Route element={<Protected />}>

                        {/* User */}
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/profile/edit"
                            element={<EditProfile />}
                        />

                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />


                        {/* Video */}
                        <Route
                            path="/upload"
                            element={<UploadVideo />}
                        />

                        <Route
                            path="/watch/:id"
                            element={<WatchVideo />}
                        />


                        {/* Channel / Subscription */}
                        <Route
                            path="/channel/:username"
                            element={<Channel />}
                        />

                        <Route
                            path="/subscriptions"
                            element={<Subscriptions />}
                        />

                    </Route>


                    {/* Unknown URL */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </main>

        </>
    );
}

export default App;