import React, { useEffect, useState } from 'react'
import type { SignUpBody } from '../types/auth.types';
import { getCurrentUser, signUp } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    useEffect(() => {
        getCurrentUser().then(() => navigate("/chat")).catch(() => { });
    },[])
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
        <div>
            <form onSubmit={submitHandler}>

                <label>
                    <input
                        type='text'
                        name='email'
                        value={formData.email}
                        placeholder='john@gmail.com'
                        onChange={changeHandler}
                    ></input>
                    EMAIL
                </label>

                <br />

                <label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        placeholder='secret'
                        onChange={changeHandler}
                    ></input>
                    PASSWORD
                </label>

                <br />

                <button>SUBMIT</button>

            </form>
        </div >
    )
}

export default SignUp