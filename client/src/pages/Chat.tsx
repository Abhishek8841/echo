import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { getCurrentUser, getMessages, getUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { MessagesType, serverMessageType } from '../types/message.types';
import type { UserType } from '../types/auth.types';
import Navbar from '../components/Navbar';
import { connect, disconnect, getSocket } from '../services/websocket';

const Chat = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType | null>(null);
    const [opened, setOpened] = useState<UserType | null>(null);
    const [userList, setUserList] = useState<UserType[]>([]);
    const [messages, setMessages] = useState<MessagesType>([]);
    const [onlineList, setOnlineList] = useState<Set<string>>(new Set());
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
            try {
                const msg: serverMessageType = JSON.parse(event.data);
                switch (msg.type) {
                    case "recieve_message":
                        if (msg.payload.senderId === openedRef.current?.id)
                            setMessages(prev => [
                                ...prev,
                                msg.payload
                            ]);
                        break;

                    case "status_indicator":
                        if (msg.payload.content == "ONLINE") {
                            setOnlineList((prev) => {
                                let newList = Array.from(prev);
                                newList = [...newList, msg.payload.from]
                                return new Set(newList);
                            })
                        }
                        else {
                            setOnlineList((prev) => {
                                let newList = Array.from(prev);
                                newList = newList.filter(id => id !== msg.payload.from);
                                return new Set(newList);
                            })
                        }
                        break;

                    case "online_list":
                        setOnlineList(new Set(msg.payload))
                        break;
                }
            }
            catch (e) {
                console.error(e);
            }

        };
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
                    onlineList={onlineList}
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
