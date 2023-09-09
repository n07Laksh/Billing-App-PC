import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// const os = window.require('os');

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Signup = (props) => {

    //   const deviceName = os.hostname();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState(false);

    const handleConfirmPass = (event) => {
        if (name && email && password) {
            setConfirmPassword(event.target.value);
        }
        else {

        }
    }

    const handleSingup = async () => {

        try {
            if (confirmPassword === password) {

                // signup api fetch
                let data = await fetch("http://localhost:8000/auth/signup", {
                    method: "POST",
                    body: JSON.stringify({ name: name, email: email, password: password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                data = await data.json();
                if (!data.error) {
                    localStorage.setItem("user", data.user);
                    localStorage.setItem("userData", JSON.stringify(data.data));
                    props.setLogin(localStorage.getItem("user"));
                    localStorage.setItem('lastLoginTime', new Date().getTime());
                } else {
                    toast.warn(data.message);
                }
            } else {
                toast.error("password did not matched")
                setErr(true)
            }
        } catch (error) {
            // navigate("/404-Error")
            // dispatch(setPageError());
        }
    }
    console.log(password, confirmPassword)

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
                theme="dark"
            />
            <div className='login-signup'>
                <div className='container-login'>
                    <h1 className="text-center pb-5">Signup</h1>
                    <form className='container'>
                        <div className="form-outline mb-2">
                            <label className="form-label" htmlFor="name">User Name</label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} id="name" className="form-control" />
                        </div>

                        <div className="form-outline mb-2">
                            <label className="form-label" htmlFor="email">Email address</label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} id="email" className="form-control" />
                        </div>

                        <div className="form-outline mb-2">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} id="password" className="form-control" />
                        </div>

                        <div className="form-outline mb-2">
                            <label className="form-label" htmlFor="password">Confirm Password</label>
                            <input type="password" onChange={handleConfirmPass} value={confirmPassword} id="password" className={`${err?"border border-danger":""} form-control`} />
                        </div>

                        <div className="row mb-2">
                            <div className="col d-flex justify-content-center"></div>
                        </div>


                        <button type="button" onClick={handleSingup} disabled={!(name && email && password && confirmPassword)} className="btn btn-primary btn-block mb-4 login-signup-btn w-100">Signup</button>
                        <div className="text-center">
                            <p>Already have Account? <Link to="*" className="login-signup-router text-success">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>

        </>

    )
}


export default Signup