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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">

            <form
                onSubmit={submitHandler}
                className="animate-fade-in-up bg-white border border-gray-100 shadow-lg shadow-amber-100/30 rounded-2xl w-[420px] p-8 flex flex-col gap-5"
            >

                <div className="text-center mb-2">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md shadow-amber-200/50">
                        <span className="text-lg font-bold text-white">S</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Sign in to continue to Sync</p>
                </div>

                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-gray-600">
                        Email
                    </span>
                    <input
                        type='text'
                        name='email'
                        value={formData.email}
                        placeholder='you@example.com'
                        onChange={changeHandler}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all duration-200 placeholder:text-gray-400"
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-gray-600">
                        Password
                    </span>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        placeholder='Your password'
                        onChange={changeHandler}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all duration-200 placeholder:text-gray-400"
                    />
                </label>

                <button
                    className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md shadow-amber-200/50 hover:shadow-lg hover:shadow-amber-300/50"
                >
                    Sign in
                </button>

                <p className="text-sm text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-amber-500 hover:text-amber-600 font-medium transition-colors duration-200">
                        Sign up
                    </Link>
                </p>

            </form>

        </div>
    )
}

export default SignIn
