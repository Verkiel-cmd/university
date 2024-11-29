import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Webstyles/login_style.css';



const Frontlog = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Placeholder for error from session // Placeholder for error from session
    const [isEmailFocused, setIsEmailFocused] = useState(false); // Track email focus state
    const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Track password focus state
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    const handleLoginSubmit = (event) => {
        event.preventDefault();


        axios.post('http://localhost:8080/login', {
            email: email,
            password: password
        })
            .then(response => {
                console.log('Login success:', response.data);
                if (response.data.success) {

                    window.location.href = response.data.redirectUrl;
                } else {
                    setError(response.data.message);
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error('Login error:', error.response.data);

                    setError(error.response.data.message || 'Something went wrong');
                } else {
                    console.error('Network error:', error);
                    setError('Network error. Please try again.');
                }
            });
    };

    const toggleForm = () => {
        const logregBox = document.querySelector('.log-reg-box');
        logregBox.classList.toggle('active');
    };

    const toggleDropdown = () => {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };


    const handleGoogleSuccess = (response) => {
        console.log('Google Sign-In response:', response); // Log the full response object
        const token = response.tokenId || response.credential; // Use appropriate property
        console.log('Extracted token:', token); // Log the extracted token

        if (!token) {
            setError('Google Sign-In failed. No token received.');
            return;
        }

        axios
            .post('http://localhost:8080/google-login', { token })
            .then((res) => {
                if (res.data.success) {
                    window.location.href = '/ListStud';
                }
            })
            .catch((error) => {
                console.error('Google Sign-In failed:', error);
                setError('Google Sign-In failed. Please try again.');
            });
    };


    const handleGoogleFailure = (response) => {
        console.error('Google Sign-In error:', response);
        setError('Google Sign-In was unsuccessful. Please try again.');
    };

    return (

        <div>
            <header className="header">
                <nav className="navbar">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Service</a>
                    <a href="#">Contact</a>
                </nav>

                <div className="dropdown">
                    <button className="dropbtn" onClick={toggleDropdown}>Courses</button>
                    <div className="dropdown-content">
                        <div className="dropdown-line"></div>
                        <a href="#">Link 1</a>
                        <div className="dropdown-line"></div>
                        <a href="#">Link 2</a>
                        <div className="dropdown-line"></div>
                        <a href="#">Link 3</a>
                        <div className="dropdown-line"></div>
                    </div>
                </div>

                <form action="#" className="search-bar">
                    <input type="text" placeholder="Search" />
                    <button type="submit"><i className="bx bx-search-alt-2"></i></button>
                </form>
            </header>

            <div className="background"></div>

            <div className="container123">
                <div className="content">
                    <h2 className="logo"><i className="bx bxl-pocket"></i>VM</h2>
                    <div className="text-sci">
                        <h2>Welcome! <br /><span>to Veracity University.</span></h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati a nobis placeat facere impedit
                            quam consequuntur, consectetur aliquam quos odit eos ipsam vero! Sint exercitationem sapiente quis
                            harum quam inventore.</p>
                        <div className="social-icons">
                            <a href="#"><i className="bx bxl-linkedin-square"></i></a>
                            <a href="#"><i className="bx bxl-facebook-circle"></i></a>
                            <a href="#"><i className="bx bxl-instagram"></i></a>
                            <a href="#"><i className="bx bxl-google"></i></a>
                        </div>
                    </div>
                </div>

                <div className="log-reg-box">
                    <div className="form-box login">
                        <form onSubmit={handleLoginSubmit}>
                            <h2>Sign in</h2>

                            <div className="input-box">
                                <span className="icon"><i className="bx bxs-envelope"></i></span>
                                <input
                                    type="text"
                                    value={email}
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(false)}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label className={email || isEmailFocused ? 'focused' : ''}>Email</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={password}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className={password || isPasswordFocused ? 'focused' : ''}>Password</label>
                                <span className="password-toggle" onClick={togglePasswordVisibility}>
                                    <i className={`fa ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </span>
                            </div>

                            <div className="google-login">
                                <GoogleLogin
                                    clientId="824956744352-a4sj5egukjh1csk8galsalp6v4i73gbq.apps.googleusercontent.com"
                                    buttonText="Sign in with Google"
                                    onSuccess={handleGoogleSuccess}
                                    onFailure={handleGoogleFailure}
                                    cookiePolicy={'single_host_origin'}
                                    className="google-login-button"
                                />
                            </div>


                            {/* Display error message */}
                            {error && (
                                <div style={{
                                    margin: '30px 0',
                                    marginBottom: '10px',
                                    padding: '10px 15px',
                                    textAlign: 'center',
                                    color: 'red',
                                    fontWeight: '500',
                                    backgroundColor: 'white',
                                    border: '1px solid red',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    <i className='bx bx-error-circle' style={{ fontSize: '20px' }}></i> {/* Add an icon */}
                                    {error}
                                </div>
                            )}

                            <div className="remember-forgot" style={{ paddingTop: '30px' }}>
                                <label>
                                    <input type="checkbox" />
                                    Remember me
                                </label>
                                <a href="#">Forgot Password?</a>
                            </div>
                            <button type="submit" className="btn">Sign in</button>

                            <div className="login_register">
                                <p>Don't have an account? <a href="#" className="register-link" onClick={toggleForm}>Sign Up</a>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="form-box register">
                        <form onSubmit={e => e.preventDefault}>
                            <h2>Sign Up</h2>

                            <div className="input-box">
                                <span className="icon"><i className="bx bx-user-circle"></i></span>
                                <input type="text" required />
                                <label>Username</label>
                            </div>

                            <div className="input-box">
                                <span className="icon"><i className="bx bxs-envelope"></i></span>
                                <input type="text" required />
                                <label>Email</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={password}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className={password || isPasswordFocused ? 'focused' : ''}>Password</label>
                                <span className="password-toggle" onClick={togglePasswordVisibility}>
                                    <i className={`fa ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </span>
                            </div>

                            <div className="remember-forgot">
                                <label>
                                    <input type="checkbox" />
                                    I agree to the terms & conditions
                                </label>
                            </div>

                            <button type="submit" className="btn">Sign Up</button>

                            <div className="login_register">
                                <p>Already have an account? <a href="#" className="login-link" onClick={toggleForm}>Sign In</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Frontlog;