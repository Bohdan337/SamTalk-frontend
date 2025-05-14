import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile } from "../../untils";

function Login() {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false); 
    const [errorMessages, setErrorMessages] = useState([]); 

    const handleGetStarted = () => {
        navigate('/sign_up');
    };


    useEffect(()=>{
        localStorage.setItem('access_token', '');
        localStorage.setItem('refresh_token', '');
    });


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;   
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        setErrorMessages([]);
        setOpenModal(false); 

        try {
            const response = await fetch('http://localhost:8000/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // const user = await response.json();
                // console.log('User: ', user);
                // setErrorMessages([]);#

                const data = await response.json()
                const user = await getUserProfile(data.access);

                console.log('User: ', user)
                if (!user.is_verified) {
                    setErrorMessages(['Please verify your email address.']);
                    setOpenModal(true);
                    console.error('Please verify your email address.')
                    return;
                };
                 
                console.log("login data: ", data)
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                navigate('/home');
                
            } else {
                const errors = await response.json();
                console.error('Error: ', errors);

                
                console.log("Error list: ", errorMessages);

                setErrorMessages((errorList)=> [...errorList, errors.detail]);
                setOpenModal(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="login">
            <div className="login-title" style={{ paddingTop: '28%'}}>
            <h2>Login here</h2>
            <p>Continue with your previous account ...</p>
        </div>

            { errorMessages && errorMessages.length > 0 && (
                <div className="error-messages" style={{ marginTop: '2.5%' }}>
                    {errorMessages.map((message, index) => (
                        <p key={index} className="error-message">{message}</p>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '17%' }}>
                <input 
                    type="email"
                    placeholder="Email"
                    style={{ marginTop: '2.5%' }}
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                />
                <input 
                    type="password"
                    placeholder="Password" 
                    style={{ marginTop: '2.5%' }} 
                    name="password" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                />
                <button className="login-btn1" style={{ marginTop: '12%' }}>Login</button>
            </form>


            <div className="login-btn" >
                <button className="login-btn2" style={{ marginTop: '2.5%' }}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93 72.5-66.8 114.4-165.2 114.4-282.1 0-27.2-2.4-53.3-6.9-78.5z"></path></svg>Login with google</button>
                <div class="login-remember-me" style={{ marginTop: '3%' }}>
                    <input type="checkbox" id="remember-me-checkbox" />
                    <span></span>
                    <label for="remember-me-checkbox">Remember me</label>
                </div>
            </div>
            
            <div className="login-forget-password" style={{ marginTop: '16%' }}>
                <a href="#" className="login-forget-password-a">Forgot your password?</a>
            </div>
    
            <div className="login-to-signup">
                <p className="login-to-signup-p">Don’t have an account? <strong onClick={handleGetStarted}>Register</strong></p>
            </div>
        </div>
    );
}

export default Login;
