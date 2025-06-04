// const API_BASE = 'http://127.0.0.1:8000/api'
const API_BASE = process.env.REACT_APP_API_URL;

;
// import { useNavigate } from "react-router-dom";


export async function refreshTokens() {
    const token = localStorage.getItem("refresh_token");
    const response = await fetch(`${API_BASE}/token/refresh`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  
            refresh: token
        })
    })
    if (response.ok) {
        const data = await response.json();
        console.log("Refresh data: ", data);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        return true
    } else {
        let error = await response.json()
        console.log("Error: ", error);
        throw new Error('Invalid authorization')
    }
}


export const fetchChats = async () => {

    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`${API_BASE}/chats`,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            return data;
        } else if (response.status === 401) {
            await refreshTokens();

            return await fetchChats();
        }

        else {
            let error = await response.json()
            console.error('Error:', error);
            throw new Error(error.message || 'Failed to get chats');  
        }

    } catch (error) {
        console.error('Error fetching chats:', error);
        throw new Error(error || 'Failed to get chats');  
    }
}

export const chatDetails = async (id) => {

    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch(`${API_BASE}/chats/${id}`,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            return data;
        } else if (response.status === 401 ) {
            await refreshTokens();

            return await chatDetails(id);
        }

        else {
            let error = await response.json()
            console.error('Error:', error);
            throw new Error(error.message || 'Not found the chat');  
        }

    } catch (error) {
        console.error('Error fetching chats:', error);
        throw new Error(error);
    }
}

export const searchUsers = async (query) => {
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`${API_BASE}/user/search?query=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // body: JSON.stringify({ value: query }),
        })

        if (response.ok) {
            const data = await response.json();
            console.log('Search data:', data);

            return data;  
        } else if (response.status === 401) {

            await refreshTokens();
            return await searchUsers(query);
        
        } else {
            let error = await response.json()
            console.error('Error:', error);

            throw new Error(error.message || 'Failed to search users');  

        }
    } catch(error) {
        throw new Error(error || 'Failed to search users');  
    }
}

export const updateChat = async (chatData) => {
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(`${API_BASE}/chats/${chatData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(chatData),
        });

        if (response.ok) {
            const newChat = await response.json();
            return newChat;
        } else {
            let error = await response.json()
            console.error('Error:', error);
            throw new Error(error.message || 'Failed to update chat');  
        }
    } catch (error) {
        console.error("Request error:", error);
    }
}



export const removeUser = async (user, chatId) => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await fetch(`${API_BASE}/chats/${chatId}/remove-member`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  
            },
            body: JSON.stringify({ user: user }),
        });

        if (response.ok) {
            const data = await response.json();

            return data;

        } else if (response.status === 401) {

            await refreshTokens();
            return await removeUser(user);
        
        } else {
            let error = await response.json()
            console.error('Error:', error);

            throw new Error(error.message || 'Failed to delete users');  
        }
        
    } catch (error) {
        throw new Error(error);  
    }
};


export const getUserProfile = async (token) => {
    try {
        const response = await fetch(`${API_BASE}/profile`,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        if (response.ok) {
            const data = await response.json();
            return data;

        } else if (response.status==401){
            await refreshTokens();
            getUserProfile();
        }
        
        else {
            let error = await response.json()
            throw new Error(error.message || 'Failed to get user profile'); 
        }

    }catch (error) {
        throw new Error(error);  

    };
};