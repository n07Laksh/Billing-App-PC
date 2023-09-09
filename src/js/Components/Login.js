import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// import Spinner from './Spinner'


const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [spin, setSpin] = useState(false)
    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            if (email && password) {
                // to enable spinner 
                setSpin(true);
                

                let data = await fetch("http://localhost:8000/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email: email, password: password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                data = await data.json();
                if (!data.error) {
                    setTimeout(()=>{
                        localStorage.setItem("user", data.user);
                        // props.showAlert(`User Logged-In Successfully`, "success")
                        // setSpin(false)
                        localStorage.setItem("userData", JSON.stringify(data.data));
                        props.setLogin(localStorage.getItem("user"));
                        localStorage.setItem('lastLoginTime', new Date().getTime());
                    },500)
                    
                }
                else {
                    // props.showAlert(data.error, "danger")
                }
            }

            else {
                // props.showAlert("All fields are required", "warning")
            }

        } catch (error) {
            // navigate("/404-Error")
            // dispatch(setPageError());
        }
    }
    return (
        <>
            {spin ? (
                <>
                    {/* <Spinner height={"100vh"} /> */}
                </>
            ) : (
                <>
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
                </>)

            }
        </>
    )
}

export default Login
