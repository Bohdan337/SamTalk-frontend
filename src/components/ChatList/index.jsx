import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './ChatList.css'
import myImage from './image.jpg';
import { fetchChats, refreshTokens, searchUsers } from "../../untils";
import { useEffect } from 'react';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

function ChatList() {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const openChat = (chat) => {
        console.log('openChat: ', chat)
        navigate('/chat', { state : {chatId : chat.id} });
    };

    useEffect(()=>{ 
        async function getChats(){
            try {
                console.log('getChats');

                const result = await fetchChats();
                console.log('Chats: ', result);
                const data = result.map((chat) => {
                    // chat.created_at = formatDistance(new Date(chat.messages.at(-1)?.created_at), new Date(), { addSuffix: true });
                    return chat;
                });
                setChats(data);
                console.log('Receive chats;', result);
            } catch (e) {
                console.error('Error fetching chats 4:', e);
                navigate('/login');
            }
        }
       
        getChats();
    },[]);

    const [requestUser, setRequestUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setRequestUser(user);
        console.log('User: ', user);
    }, []);




    function handleSearchClick() {
        const searchInput = document.querySelector('.search-input');
        const listChats = document.querySelector('.list-chats');
        const listSearch = document.querySelector('.list-search');
        const userNotFound = document.querySelector('.user-not-found');
    
        searchInput?.classList.toggle('active');
        listChats?.classList.toggle('active');
        listSearch?.classList.toggle('active');
        userNotFound?.classList.toggle('active');
    }
    
    async function  handleSearchUsers(e) {
        const query = e.target.value;

        setSearch(query);

        try {
            if (query.trim()) {
                const data = await searchUsers(query);
                setSearchResult(data);
            };
        } catch(error) {
            console.error('Error searching:', error);
            navigate('/login');
        };
    };

    async function createChat(user) {
        const token = localStorage.getItem('access_token');
        console.log('Local storage token:', token);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ members: [{
                    'username': user.username,
                    'email': user.email,
                    'image_url': user.image_url,
                }] }),
            });
    
            if (response.ok) {
                const newChat = await response.json();
                console.log("Chat created:", newChat);
                openChat(newChat);
            }
        } catch (error) {
            console.error("Request error:", error);
        }
    }
    

    return (
        <div className="chat-list">
            <div className="chat-list-navbar" style={{ marginTop: '17%' }}>
                <h1 className="chat-list-navbar-h1">Chats</h1>
                <div className="navbar-svg">
                    <svg onClick={handleSearchClick} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg"><path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"></path><path d="M11.412,8.586C11.791,8.966,12,9.468,12,10h2c0-1.065-0.416-2.069-1.174-2.828c-1.514-1.512-4.139-1.512-5.652,0 l1.412,1.416C9.346,7.83,10.656,7.832,11.412,8.586z"></path></svg>
                    <svg onClick={() => navigate('/profile')} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.7em" width="1.7em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v14h16V5H4zm2 2h6v6H6V7zm2 2v2h2V9H8zm-2 6h12v2H6v-2zm8-8h4v2h-4V7zm0 4h4v2h-4v-2z"></path></g></svg>
                    <svg onClick={() => navigate(-1)} stroke="black" fill="black" stroke-width="0" viewBox="0 0 24 24" height="1.7em" width="1.7em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg>
                </div>                    
            </div>

            <div className="search-bar" style={{ marginTop: '3%' }}>
                <input type="text" value={search} onChange={handleSearchUsers} placeholder="Enter username or email" className="search-input" />
            </div>


            <div className="list-chat" style={{ marginTop: '11%' }}>
                <div className="list-chats">
                    {
                    chats.length > 0 ? (
                    chats.map((chat, index) => (
                        <div key={index} className="list-chat-style" style={{ paddingTop: '5%' }} onClick={()=>openChat(chat)}>
                            <img className="chat-style-img" src={chat.members.filter(p=>p.username!==requestUser?.username)[0].image_url} alt="" />
                            <div className="chat-style-discription">
                                <div className="discprition-sender">
                                    <h2 className="chat-sender-name">{chat.members.filter(p=>p.username!==requestUser?.username)[0].username}</h2>
                                    <p className="chat-send-time">{chat.created_at}</p>
                                </div>
                                {chat.messages.at(-1)?.content ? (
                                    <p style={{ marginTop: '1%' }}>{chat.messages.at(-1)?.content}</p>
                                ) : (
                                    <p style={{ marginTop: '1%' }}>Image</p>
                                )}
                            </div>
                        </div>
                        ))
                    ) : (
                        <h2 style={{ marginTop: '5%', textAlign: 'center' }}>Let's go to create a new chat!</h2>
                    )
                    }
                </div>

                <div className="list-search">
                    {
                    searchResult && searchResult.length > 0 ? (
                        searchResult?.map((user, index) => (
                            <div key={index} className="list-chat-style" style={{ paddingTop: '5%' }} onClick={()=>createChat(user)}>
                                <img className="chat-style-img" src={myImage} alt="" />
                                <div className="chat-style-discription">
                                    <div className="discprition-sender">
                                        <h2 className="chat-sender-name">{user.username}</h2>
                                    </div>
                                </div>
                            </div>      
                        ))
                    ) : (
                        <div className="user-not-found">User not found</div>
                    )
                    }
                </div>
            </div>
        </div>
    );  
};


export default ChatList;