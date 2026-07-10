import React, { useState } from 'react'
import type { SignUpBody } from '../types/auth.types';
import { signUp } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const SignUp = () => {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpBody>({
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
            await signUp(formData);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">

            <form
                onSubmit={submitHandler}
                className="bg-white border border-gray-200 shadow-sm rounded-lg w-[400px] p-8 flex flex-col gap-5"
            >

                <h1 className="text-xl font-semibold text-gray-900 text-center">
                    Create an account
                </h1>

                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-gray-700">
                        Email
                    </span>
                    <input
                        type='text'
                        name='email'
                        value={formData.email}
                        placeholder='you@example.com'
                        onChange={changeHandler}
                        className="border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-150 placeholder:text-gray-400"
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-gray-700">
                        Password
                    </span>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        placeholder='Create a password'
                        onChange={changeHandler}
                        className="border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-150 placeholder:text-gray-400"
                    />
                </label>

                <button
                    className="bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-md text-sm font-medium transition-colors duration-150"
                >
                    Sign up
                </button>

                <p className="text-sm text-center text-gray-500">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150">
                        Sign in
                    </Link>
                </p>

            </form>

        </div>
    )
}

export default SignUp
