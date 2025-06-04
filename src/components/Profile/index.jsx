import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshTokens} from "../../untils";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_BASE}/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('response', data);
                    setUser(data);
                    setOriginalData(data);

                } else if (response.status === 401 ) {
                    await refreshTokens();
                    return await Profile();

                } else {
                    let error = await response.json()
                    console.error('Error:', error);
                    throw new Error(error.message || 'Not found the profile');  
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                throw new Error(error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setUser({ ...user, profileImage: file});
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('profile user ', user);
            const formData = new FormData();

            formData.append("is_active", user.is_active);
            formData.append("is_staff", user.is_staff);   
            formData.append("username", user.username);

            if (user.profileImage) {
                formData.append("profile_image", user.profileImage);   
            };

            formData.append("email", user.email);

            const response = await fetch(`${process.env.REACT_APP_process.env.REACT_APP_API_URL_URL_BASE}/profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Update image: ', data);
                setUser(data);
            } else {
                let error = await response.json();
                console.error("Error:", error);
                throw new Error(error.message || "Not found the profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            throw new Error(error);
        }
    };

    const isChanged = originalData && JSON.stringify(user) !== JSON.stringify(originalData);

    return (
        <div className="profile-block">
            <div className="profile-navbar">
                <svg onClick={() => navigate(-1)} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="2.4em" width="2.4em" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>
                <h1 className='profile-navbar-h1'>Profile</h1>
            </div>

            <div className="profile-content">
                <form className="profile-form" onSubmit={handleSubmit}>   
                    <div className="profile-content-input">
                        {/* <input type="text" name="username" value={user?.username} onChange={handleChange}/> */}
                        <img src={user?.image_url} alt="image" />
                        <input type="file" name="image" onChange={handleImageChange} />
                    </div>

                    <div className="profile-content-input">
                        <p сlassName="profile-content-labell" >Name</p>
                        <input type="text" name="username" value={user?.username} onChange={handleChange}/>
                    </div>

                    <div className="profile-content-input">
                        <p сlassName="profile-content-labell">Email</p>
                        <input type="text" name="email" value={user?.email} disabled/>
                    </div>

                    <div className="profile-content-input">
                        <p сlassName="profile-content-labell">Password</p>
                        <input type="text" name="password" placeholder="******" disabled />
                    </div>

                    {isChanged && <button type="submit" className="profile-submit">Save changes</button> }  
                </form>
            </div>
        </div>
        
    );
}

export default Profile;


