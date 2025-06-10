import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import "./Home.css"
import { getUserProfile } from "../../untils";

function Home() {
  const navigate = useNavigate();


  const handleGetStarted=()=>{
    navigate('/chats')
  }

  async function refreshTokens() {
    const token=localStorage.getItem("refresh_token");
    const response=await fetch(`${process.env.REACT_APP_API_URL}/api/token/refresh`, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh: token
        })
    })
    if (response.ok){
        const data=await response.json();
        console.log("Refresh data: ", data);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
    }else{
        let error=await response.json()
        console.log("Error: ", error);
    }

    }


  useEffect(() => {
    async function getProfile() {
        try {
            const token = localStorage.getItem('access_token');
            if(!token) {
                navigate('/login');
                return;
            }

            const data = await getUserProfile(token);
            localStorage.setItem("user", JSON.stringify(data));

            console.log('User: ', data)
        }catch (e) {
            console.error('Error:', e)
        };
    }

    getProfile();
  });


  return (
    <div>
        <img className='image-home-back' src="images/backgroundHome2.png" alt="" />

        <button className="home-btn" onClick={handleGetStarted}>Home</button>
    </div>
  );
}

export default Home;
