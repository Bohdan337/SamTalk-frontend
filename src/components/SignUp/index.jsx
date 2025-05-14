import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import KeepMountedModal from './KeepMountedModal';
import Typography from '@mui/material/Typography';

function SignUp() {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false); 
    const [errorMessages, setErrorMessages] = useState([]); 

    const handleGetStarted = () => {
        navigate('/login');
    };


    const [formData, setFormData] = useState({
        username: '',
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
            const response = await fetch('http://localhost:8000/api/sign_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const user = await response.json();
                console.log('User: ', user);
                setErrorMessages([]);
                setFormData({
                    username: '',
                    email: '',
                    password: ''
                });
                alert('Registration successful! Please verify your email to continue.');
                // navigate('/login')

            } else {
                const errors = await response.json();
                console.error('Error: ', errors);

                let errorList = [];
                for (let key in errors) {
                    errorList = [...errorList, ...errors[key]];
                }
                setErrorMessages(errorList);
                setOpenModal(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="login">
            <div className="login-title" style={{ paddingTop: '28%' }}>
                <h2>Let’s get started!</h2>
                <p>Create a new account with us ...</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '17%' }}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    name="username" 
                    required 
                    value={formData.username}
                    onChange={handleChange}
                />
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
                <button className="login-btn1" type="submit" style={{ marginTop: '12%' }}>Register</button>
            </form>

            <div className="login-btn">
                <button className="login-btn2" style={{ marginTop: '2.5%' }}>Register with Google</button>
            </div>

            <div className="login-to-signup" style={{ marginTop: '29%' }}>
                <p className="login-to-signup-p">Already have an account? <strong onClick={handleGetStarted}>Login</strong></p>
            </div>

            <KeepMountedModal open={openModal} handleClose={() => setOpenModal(false)}>
                <div>
                    {errorMessages.map((message, index) => (
                        <Typography key={index} variant="body2" color="error">{message}</Typography>
                    ))}
                </div>
            </KeepMountedModal>
        </div>
    );
}

export default SignUp;
