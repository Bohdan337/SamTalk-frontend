import { Link, useNavigate } from "react-router-dom";
import "./Main.css"

function Main() {
  const navigate = useNavigate();


  const handleGetStarted=()=>{
    navigate('/login')
  }

  return (
    <div>
        <img className='image-logo' src="images/background_logo.png" alt="" />
        <div className="description">
            <hr className="line"/>
            <h3 className="description-title" style={{ marginTop: '5%' }}>Infinitely Secure chats <br />between you,<br />your friends and loved ones</h3>
            <p className="description-text" style={{ marginTop: '4%' }}>Your conversations are shielded by top-notch <strong>encryption</strong>, ensuring that only you and your chosen recipients have access.</p>
            <p className="description-text" style={{ marginTop: '3%' }}> Feel at ease sharing messages and files, knowing that your <strong>privacy</strong> is our priority.</p>
            <button className="description-btn" onClick={handleGetStarted}>Get Started</button>
        </div>
    </div>
  );
}

export default Main;
