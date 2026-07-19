import React, { useState } from 'react'
import type { SignInBody } from '../types/auth.types';
import { signIn } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const SignIn = () => {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<SignInBody>({
        email: "",
        password: "",
    });

    function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, name } = e.target;

        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validate inputs
        if (!formData.email.trim()) {
            addToast("Please enter your email address", "warning");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            addToast("Please enter a valid email address", "warning");
            return;
        }
        if (!formData.password) {
            addToast("Please enter your password", "warning");
            return;
        }

        setLoading(true);

        try {
            await signIn(formData);
            await fetchUser();
            addToast("Signed in successfully!", "success");
            navigate("/chat")
        } catch (e) {
            console.error(e);

            if (axios.isAxiosError(e)) {
                const msg = e.response?.data?.message;
                if (e.response?.status === 401) {
                    addToast("Invalid credentials. Please check your email and password.", "error");
                } else if (e.response?.status === 404) {
                    addToast("Account not found. Please sign up first.", "error");
                } else if (msg) {
                    addToast(msg, "error");
                } else {
                    addToast("Sign in failed. Please try again.", "error");
                }
            } else {
                addToast("Something went wrong. Please try again.", "error");
            }
        } finally {
            setLoading(false);
            setFormData({
                email: "",
                password: "",
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <form
                onSubmit={submitHandler}
                className="animate-fade-in-up w-full max-w-[320px] flex flex-col gap-3.5"
            >

                <div className="mb-3">

                    <h1 className="text-[15px] font-medium text-[#37352F]">
                        Sign in to Echo
                    </h1>
                    <p className="text-[12px] text-[#9B9A97] mt-0.5">Enter your credentials to continue</p>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-[#9B9A97] uppercase tracking-wide">Email</span>
                    <input
                        type='text'
                        name='email'
                        value={formData.email}
                        placeholder='you@example.com'
                        onChange={changeHandler}
                        className="border border-[#E3E2DE] rounded px-2.5 py-[7px] text-[13px] text-[#37352F] outline-none focus:border-[#C8C7C3] transition-colors duration-100 placeholder:text-[#C4C4C0] bg-white"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-[#9B9A97] uppercase tracking-wide">Password</span>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        placeholder='Your password'
                        onChange={changeHandler}
                        className="border border-[#E3E2DE] rounded px-2.5 py-[7px] text-[13px] text-[#37352F] outline-none focus:border-[#C8C7C3] transition-colors duration-100 placeholder:text-[#C4C4C0] bg-white"
                    />
                </label>

                <button
                    disabled={loading}
                    className="bg-[#37352F] hover:bg-[#2F2D28] disabled:opacity-50 text-white py-[7px] rounded text-[13px] font-medium transition-colors duration-100 mt-1"
                >
                    {loading ? 'Signing in...' : 'Continue'}
                </button>

                <p className="text-[12px] text-center text-[#B4B4B0] mt-0.5">
                    No account?{' '}
                    <Link to="/signup" className="text-[#37352F] underline decoration-[#D3D2CE] hover:decoration-[#37352F] transition-colors duration-100">
                        Create one
                    </Link>
                </p>

            </form>

        </div>
    )
}

export default SignIn
