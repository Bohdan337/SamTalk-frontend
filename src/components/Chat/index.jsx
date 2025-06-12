import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import myImage from './image.jpg';
import './Chat.css'
import { chatDetails, refreshTokens, removeUser, searchUsers, updateChat } from "../../untils";

function Chat() {
    const location = useLocation();
    const navigate = useNavigate();

    const [chatData, setChatData] = useState({});
    const [chatId, setChatId] = useState(location.state?.chatId);

    const [requestUser, setRequestUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [settings, setSettings] = useState(false);

    const [isInputVisible, setInputVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const reqUser = requestUser;


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const accessToken = localStorage.getItem("access_token");

        setRequestUser(user);

        if (!user) {
            navigate('/login');
            return;
        };

        if (!accessToken) {
            refreshTokens();
        };

        console.log('User: ', user);
    }, []);



    useEffect(() => {
        function connectWebsocket() {
            const socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/chat/${chatId}/`);
            socket.onopen = () => {
                console.log('Connected to WebSocket Server');
            };
            socket.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                console.log('Received message: ', messageData);
                setChatData((chat) => ({
                    ...chat,
                    messages: [...chat.messages, messageData],
                }));
            };
            socket.onclose = () => {
                console.log('Disconnected from WebSocket Server');
            };
            socket.onerror = (e) => {
                console.log('WebSocket error: ', e);
            }
            setSocket(socket);
        }

        async function getChats() {
            console.log('getChats');

            try {
                const result = await chatDetails(chatId);
                setChatData(result);
                console.log('Chat;', result);
            } catch (e) {
                console.log('Error')
                navigate('/login')
            };
        };

        getChats();
        connectWebsocket();
    }, []);

    function converImageToBase64(image) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const data = reader.result;
                resolve(data);
            };

            reader.onerror = reject;
            reader.readAsDataURL(image);
        })
    };



    async function sendMessage() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            // if (!content.trim()) {
            //     console.log("Cannot send an empty message");
            //     return;
            // };
            
            const messageData = {
                content: content,
                author: requestUser.email,
                image: null,
            };

            if (image) {
                messageData.image = await converImageToBase64(image);
                console.log('Set image');
            };

            console.log('Finish read image')

            // console.log('Sending message: ', JSON.stringify(messageData), messageData);         
            socket.send(JSON.stringify(messageData));

            setContent('');
            setImage(null);

        } else {
            console.log("WebSocket is not open");
        }
    };



    const handleAddUser = () => {
        setInputVisible(!isInputVisible);
    };



    async function handleSearchUsers(e) {
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
    

    async function handleUpdateChat(user) {
        try {
            const updateChatData = {...chatData, members: [...chatData.members, user]};
            console.log('Update object:', updateChatData);

            const chat = await updateChat(updateChatData);
            setChatData(chat);
            setInputVisible(!isInputVisible);
        } catch (error) {
            console.error('Error updating chat:', error);
        };
    };

    const handleRemoveUser = async (user) => {
        try {
            const newChatData = await removeUser(user, chatId);
            setChatData(newChatData);
        } catch (error) {
            console.error('Error removing user:', error);
        };
    };
    
    

    return (
        <div className="chat">
            <img className='image-home-back' src="" alt="" />
            <div className="navbar">
                <div className="navbar-content">
                    <div className="navbar-info-user" style={{ marginTop: '4%' }}>
                        <svg onClick={() => navigate(-1)} stroke="gray" fill="rgb(210, 210, 210)" stroke-width="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg>
                        <img className="navbar-info-user-image" src={chatData.members?.filter(p => p.username !== requestUser?.username)[0].image_url} alt="" />
                        <p className="navbar-info-username">{chatData.members?.filter(p => p.username !== requestUser?.username)[0].username}</p>
                    </div>

                    <div className="navbar-button" style={{ marginTop: '4%' }}>
                        {/* <svg stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 1024 1024" height="1.7em" width="1.7em" xmlns="http://www.w3.org/2000/svg"><path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560zm176-167l-104-59.8V458.9L888 399v226zM208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path></svg>
                        <svg stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 24 24" height="1.6em" width="1.6em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M16.585,19.999l2.006-2.005l-2.586-2.586l-1.293,1.293c-0.238,0.239-0.579,0.342-0.912,0.271 c-0.115-0.024-2.842-0.611-4.502-2.271s-2.247-4.387-2.271-4.502c-0.069-0.33,0.032-0.674,0.271-0.912l1.293-1.293L6.005,5.408 L4,7.413c0.02,1.223,0.346,5.508,3.712,8.874C11.067,19.643,15.337,19.978,16.585,19.999z"></path><path d="M16.566 21.999c.005 0 .023 0 .028 0 .528 0 1.027-.208 1.405-.586l2.712-2.712c.391-.391.391-1.023 0-1.414l-4-4c-.391-.391-1.023-.391-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594c.391-.391.391-1.023 0-1.414l-4-4c-.375-.375-1.039-.375-1.414 0L2.586 5.999C2.206 6.379 1.992 6.901 2 7.434c.023 1.424.4 6.37 4.298 10.268S15.142 21.976 16.566 21.999zM6.005 5.408l2.586 2.586L7.298 9.287c-.239.238-.341.582-.271.912.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271c.333.07.674-.032.912-.271l1.293-1.293 2.586 2.586-2.006 2.005c-1.248-.021-5.518-.356-8.873-3.712C4.346 12.921 4.02 8.636 4 7.413L6.005 5.408zM19.999 10.999h2c0-5.13-3.873-8.999-9.01-8.999v2C17.051 4 19.999 6.943 19.999 10.999z"></path><path d="M12.999,8c2.103,0,3,0.897,3,3h2c0-3.225-1.775-5-5-5V8z"></path></svg>            */}
                        <svg onClick={() => { setSettings((s) => !s) }} stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 12 16" height="1.6em" width="1.6em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"></path></svg>
                    </div>
                </div>
            </div>
            {settings ? (
                <div className="settings">  
                    <h1>Users</h1>
                    <div className="list-users">
                        {
                            chatData.members?.map((user, index) => (
                                <div key={index} className="list-chat-style" style={{ paddingTop: '5%' }}>
                                    <img className="chat-style-img" src={user.image_url} alt="" />
                                    <div className="chat-style-discription">
                                        <div className="discprition-sender">
                                            <h2 className="chat-sender-name">{user.username}</h2>
                                        </div>
                                       { chatData?.members?.length > 2 && user.username !== requestUser?.username && chatData?.is_admin === requestUser?.username && (
                                            <button className="remove-user-btn" onClick={() => handleRemoveUser(user)}>Remove</button>
                                        )} 
                                    </div>
                                </div>
                            ))

                        }
                        
                        <button className="list-users-btn-add" onClick={handleAddUser}>Add</button>





                        {isInputVisible && (
                            <div className="search-bar" style={{ marginTop: '3%' }}>
                                <input  value={search} onChange={handleSearchUsers} type="text" placeholder="Enter username or email" className="search-add-user-input" />
                            </div>
                        )}


                        <div>
                            {
                            isInputVisible && searchResult && searchResult.length > 0 ? (
                                searchResult?.filter((user) => !chatData?.members?.includes(user.username)).map((user, index) => (
                                    <div key={index} className="list-chat-style" style={{ paddingTop: '5%' }} onClick={()=>handleUpdateChat(user)}>
                                        <img className="chat-style-img" src={user.image_url} alt="" />
                                        <div className="chat-style-discription">
                                            <div className="discprition-sender">
                                                <h2 className="chat-sender-name">{user.username}</h2>
                                            </div>
                                        </div>
                                    </div>      
                                ))
                            ) : (
                                <div className="user-not-found">User not found</div>
                            )} 
                        </div>



                    </div>
                </div>
            ) : (
                <div className="content">
                    <div className="content-messages" style={{ marginTop: '8%' }}>
                        {chatData?.messages?.map((message, index) => {
                            if (message.author === requestUser?.email) {
                                return (
                                    <div
                                        key={index}
                                        className="messages-second-user"
                                        style={{ marginTop: '2%' }}
                                    >
                                        {message.content && (
                                            <p className="message-content">{message.content}</p>
                                        )}
                                       
                                        {message.image && (
                                            <img
                                                src={`${message.image}`}
                                                alt="Sent"
                                            />
                                        )}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={index}
                                        className="messages-first-user"
                                        style={{ marginTop: '2%' }}
                                    >
                                        {message.content && (
                                            <p className="message-content">{message.content}</p>
                                        )}
                                       
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="Sent"
                                            />
                                        )}
                                    </div>
                                );
                            }
                        })}
                    </div>


                    <div className="send-messages">
                        <div className="send-message-content">
                            <div className="send-message-input">
                                {/* <button className="send-message-input-emoji"><svg stroke="darkseagreen" fill="darkseagreen" stroke-width="0" viewBox="0 0 24 24" height="1.9em" width="1.9em" xmlns="http://www.w3.org/2000/svg"><path d="M16 11H14C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11H8C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z" fill="darkseagreen"></path><path d="M10 14C10 13.4477 9.55228 13 9 13C8.44772 13 8 13.4477 8 14C8 14.5523 8.44772 15 9 15C9.55228 15 10 14.5523 10 14Z" fill="darkseagreen"></path><path d="M15 13C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15C14.4477 15 14 14.5523 14 14C14 13.4477 14.4477 13 15 13Z" fill="darkseagreen"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12Z" fill="darkseagreen"></path></svg></button> */}
                                <input className='send-message-input-mesContent' type="text" id="input" value={content} onChange={(e) => setContent(e.target.value)} />
                                <label className="send-message-input-file">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setImage(e.target.files[0])} 
                                        style={{ display: 'none' }} 
                                    />
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path>
                                    </svg>
                                </label>
                            </div>
                            <button className="send-message-button-dispatch" onClick={sendMessage}><svg stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 24 24" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg"><path d="M20.563,3.34c-0.292-0.199-0.667-0.229-0.989-0.079l-17,8C2.219,11.429,1.995,11.788,2,12.18 c0.006,0.392,0.24,0.745,0.6,0.902L8,15.445v6.722l5.836-4.168l4.764,2.084c0.128,0.057,0.265,0.084,0.4,0.084 c0.181,0,0.36-0.049,0.52-0.146c0.278-0.169,0.457-0.463,0.479-0.788l1-15C21.021,3.879,20.856,3.54,20.563,3.34z M18.097,17.68 l-5.269-2.306L16,9.167l-7.649,4.25l-2.932-1.283L18.89,5.794L18.097,17.68z"></path></svg></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat;