import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const os = require('os');

import Spinner from './Spinner'

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [spin, setSpin] = useState(false)

    const deviceName = os.hostname();
    const platform = os.platform();
    const osName = os.type();

    const handleLogin = async () => {
        try {
            if (email !== "" && password !== "") {
                setSpin(true);

                let data = await fetch("https://billing-soft-backend-production.up.railway.app/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email: email, password: password, deviceName: deviceName, devicePlatform: platform, deviceType: osName }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                data = await data.json();
                if (!data.error) {

                    localStorage.setItem("user", data.user);
                    localStorage.setItem("userData", JSON.stringify(data.data));
                    props.setLogin(localStorage.getItem("user"));
                    localStorage.setItem('lastLoginTime', new Date().getTime());
                    setSpin(false)

                }
                else {
                    toast.error(data.message);
                    setSpin(false)
                }
            }

            else {
                toast.warn("All field Are Required");
                setSpin(false)
            }

        } catch (error) {
            toast.error("Server Not Found : ", error);
            setSpin(false)
        }
    }
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {spin ? (
                <div className="text-center spinner">
                    <Spinner />
                </div>
            ) : (


                <div className='login-signup'>
                    <div className='container login-container'>
                        <h1 className="text-center pb-5  ">Login</h1>
                        <form className='container'>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="email">Email address</label>
                                <input type="email" onChange={e => setEmail(e.target.value)} value={email} id="email" className="form-control" />
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input type="password" onChange={e => setPassword(e.target.value)} value={password} id="password" className="form-control" />
                            </div>

                            <div className="row mb-4">
                                <div className="col d-flex justify-content-center">


                                </div>

                                <div className="col forgot-password-col">

                                    <a className='text-danger forgot-password' href="#!">Forgot password?</a>
                                </div>
                            </div>


                            <button type="button" onClick={handleLogin} className="btn btn-primary btn-block mb-4 login-signup-btn">Sign in</button>


                            <div className="text-center">
                                <p>Not a member? <Link to="/signup" className="login-signup-router text-success">Register</Link></p>
                            </div>
                        </form>
                    </div>
                </div>

            )}
        </>
    )
}

export default Login
