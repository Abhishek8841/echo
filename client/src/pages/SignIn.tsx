import React, { useState } from 'react'
import type { SignInBody } from '../types/auth.types';
import { signIn } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const SignIn = () => {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();


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

        try {
            await signIn(formData);
            await fetchUser();
            navigate("/chat")
        } catch (e) {
            console.error(e);

            if (axios.isAxiosError(e)) {
                alert(e.response?.data.message)
            };
        } finally {
            setFormData({
                email: "",
                password: "",
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={submitHandler}
                className="animate-fade-in-up w-[320px] flex flex-col gap-3.5"
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
                    className="bg-[#37352F] hover:bg-[#2F2D28] text-white py-[7px] rounded text-[13px] font-medium transition-colors duration-100 mt-1"
                >
                    Continue
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
