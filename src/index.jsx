import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './components/Main'
import Login from './components/Login';
import SignUp from './components/SignUp';
import ErrorPage from './components/Error';
import Home from './components/Home';
import ChatList from './components/ChatList';
import Chat from './components/Chat';
import Profile from "./components/Profile";
import './reset.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign_up",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chats",
    element: <ChatList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat",
    element: <Chat />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <ErrorPage />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
