import React, { useEffect, useState } from 'react'
import type { SignUpBody } from '../types/auth.types';
import { getCurrentUser, signUp } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser().then(() => navigate("/chat")).catch(() => { });
    }, [])

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
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <form
                onSubmit={submitHandler}
                className="bg-white p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-5"
            >

                <h1 className="text-3xl font-bold text-center">
                    Sign Up
                </h1>

                <label className="flex flex-col gap-2">

                    <span className="font-medium">
                        Email
                    </span>

                    <input
                        type='text'
                        name='email'
                        value={formData.email}
                        placeholder='john@gmail.com'
                        onChange={changeHandler}
                        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </label>

                <label className="flex flex-col gap-2">

                    <span className="font-medium">
                        Password
                    </span>

                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        placeholder='secret'
                        onChange={changeHandler}
                        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </label>

                <button
                    className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    SUBMIT
                </button>

            </form>

        </div>
    )

}

export default SignUp
