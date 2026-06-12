import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { getCurrentUser, getMessages, getUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { MessagesType } from '../types/message.types';
import type { UserType } from '../types/auth.types';
import Navbar from '../components/Navbar';
import { connect, disconnect, getSocket } from '../services/websocket';

const Chat = () => {
const navigate = useNavigate();
const [user, setUser] = useState<UserType | null>(null);
const [opened, setOpened] = useState<UserType | null>(null);
const [userList, setUserList] = useState<UserType[]>([]);
const [messages, setMessages] = useState<MessagesType>([]);
const openedRef = useRef<UserType | null>(null);

openedRef.current = opened;

// user
useEffect(() => {
    getCurrentUser().then(setUser).catch(() => navigate("/signin"));
}, [navigate])

// userList
useEffect(() => {
    getUsers().then(setUserList).catch(() => {
        alert("Not able to load the users")
    })
}, [])

// messages
useEffect(() => {
    if (!opened) return;

    const controller = new AbortController();

    getMessages(opened.id, controller.signal)
        .then(setMessages)
        .catch(() => {
            if (controller.signal.aborted) return;

            alert("Unable to load the conversation")
        })

    return () => {
        controller.abort()
    };
}, [opened])

// websocket connection
useEffect(() => {
    connect();

    const socket = getSocket();

    if (!socket)
        return;

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.payload.senderId === openedRef.current?.id)
            setMessages(prev => [
                ...prev,
                msg.payload
            ]);
    }

    return () => {
        disconnect();
    }
}, []);

return (
    <div className="h-screen bg-slate-100 flex flex-col">

        <Navbar
            user={user}
            setOpened={setOpened}
            opened={opened}
        />

        <div className="flex flex-1 overflow-hidden">

            <Sidebar
                userList={userList}
                setOpened={setOpened}
            />

            <div className="flex flex-col flex-1">

                <MessageList
                    messages={messages}
                    user={user}
                    opened={opened}
                />

                <MessageInput
                    user={user}
                    opened={opened}
                    setMessages={setMessages}
                />

            </div>

        </div>

    </div>
)
}

export default Chat
