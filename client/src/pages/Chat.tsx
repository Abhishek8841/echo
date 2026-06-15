import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { getUnreadList, getUsers } from '../services/api';
import type { serverMessageType } from '../types/message.types';
import type { UserType } from '../types/auth.types';
import Navbar from '../components/Navbar';
import { connect, disconnect, getSocket } from '../services/websocket';
import useMessage from '../hooks/useMessage';

const Chat = () => {
    const [opened, setOpened] = useState<UserType | null>(null);
    const [userList, setUserList] = useState<UserType[]>([]);
    const [onlineList, setOnlineList] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [unreadCount, setUnreadCount] = useState<Record<string, number>>({})
    const openedRef = useRef<UserType | null>(null);

    openedRef.current = opened;

    const { messages, fetchMessages, appendMessage, abortMessages, appendAndMarkMessageAsRead, receieveRead } = useMessage();

    // userList
    useEffect(() => {
        getUsers().then(setUserList).catch(() => {
            alert("Not able to load the users")
        })
    }, [])
    useEffect(() => {
        getUnreadList().then(setUnreadCount).catch(() => {
            alert("Unable to load unread count")
        })
    }, [])

    // messages
    useEffect(() => {
        if (!opened) return;

        fetchMessages(opened.id);
        return () => { abortMessages() };
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
                        setUserList((prev) => {
                            let updatedUser = prev.filter(u => u.id == msg.payload.senderId);
                            return [
                                ...updatedUser,
                                ...prev.filter((p) => {
                                    return p.id !== updatedUser[0].id
                                }
                                )
                            ]
                        })
                        if (msg.payload.senderId === openedRef.current?.id) {
                            appendAndMarkMessageAsRead(msg.payload, openedRef.current.id);
                        }
                        else {
                            setUnreadCount(prev => ({
                                ...prev,
                                [msg.payload.senderId]:
                                    (prev[msg.payload.senderId] || 0) + 1
                            }));
                        }
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

                    case "start_typing":
                        setTypingUsers((prev) => {
                            const newSet = new Set(prev);
                            newSet.add(msg.payload.from);
                            return newSet;
                        })
                        break;

                    case "stop_typing":
                        setTypingUsers((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(msg.payload.from);
                            return newSet;
                        })
                        break;
                    case "recieve_read_receipt":
                        if (msg.payload.from === openedRef.current?.id) {
                            receieveRead(msg);
                        }
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
                setOpened={setOpened}
                opened={opened}
                typingUsers={typingUsers}
            />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar
                    userList={userList}
                    setOpened={setOpened}
                    onlineList={onlineList}
                    unreadCount={unreadCount}
                    setUnreadCount={setUnreadCount}
                />

                <div className="flex flex-col flex-1">

                    <MessageList
                        messages={messages}
                        opened={opened}
                    />

                    <MessageInput
                        setUserList={setUserList}
                        opened={opened}
                        appendMessage={appendMessage}
                    />

                </div>

            </div>

        </div>
    )
}

export default Chat
