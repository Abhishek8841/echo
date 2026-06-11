import { useEffect, useState } from 'react'
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
    const [opened, setOpened] = useState<string | null>(null);
    const [userList, setUserList] = useState<UserType[]>([]);
    const [messages, setMessages] = useState<MessagesType>([]);

    // user
    useEffect(() => {
        getCurrentUser().then(setUser).catch(() => navigate("/signin"));
    }, [])

    // userList
    useEffect(() => {
        getUsers().then(setUserList).catch(() => { alert("Not able to load the users") })
    }, [])

    // messages
    useEffect(() => {
        if (opened)
            getMessages(opened).then(setMessages).catch(() => { alert("Not able to load the message") })
    }, [opened])

    // websocket connection
    useEffect(() => {
        connect();
        const socket = getSocket();
        if (!socket)
            return;
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            setMessages(prev => [
                ...prev,
                msg.payload
            ]);
        }
        return () => { disconnect(); }

    }, []);

    return (
        <div>
            <Navbar user={user}></Navbar>
            <Sidebar userList={userList} setOpened={setOpened}></Sidebar>
            <MessageList messages={messages}></MessageList>
            <MessageInput opened={opened} setMessages={setMessages}></MessageInput>
        </div>
    )
}

export default Chat