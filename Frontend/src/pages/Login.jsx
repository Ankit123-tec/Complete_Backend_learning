import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import React from "react";
export default function Login() {

    const [value, setValue] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    async function submit(e) {

        e.preventDefault();

        try {

            await login(
                value.includes("@")
                    ? {
                        email: value,
                        password
                    }
                    : {
                        userName: value,
                        password
                    }
            );

            alert("Login successful");

            navigate("/");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }

    return (
        <div className="auth">

            <h1>Login</h1>

            <form onSubmit={submit}>

                <input
                    type="text"
                    placeholder="Username or Email"
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            <p>
                New user?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>

        </div>
    );
}