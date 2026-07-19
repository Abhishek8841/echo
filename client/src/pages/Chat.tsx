import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { getUnreadList, getUsers } from '../services/api';
import type { OnlineList, readReceiptType, recieveMessage, startTypingType, statusIndicatorType, stopTypingType } from '../types/message.types';
import type { UserType } from '../types/auth.types';
import Navbar from '../components/Navbar';
import useMessage from '../hooks/useMessage';
import useSocket from '../hooks/useSocket';

const Chat = () => {
    const [opened, setOpened] = useState<UserType | null>(null);
    const [userList, setUserList] = useState<UserType[]>([]);
    const [onlineList, setOnlineList] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [unreadCount, setUnreadCount] = useState<Record<string, number>>({})
    const openedRef = useRef<UserType | null>(null);

    openedRef.current = opened;
    const { messages, fetchMessages, appendMessage, abortMessages, appendAndMarkMessageAsRead, receieveRead } = useMessage();
    useSocket({ recieve_message, status_indicator, online_list, start_typing, stop_typing, recieve_read_receipt })

    // userList
    useEffect(() => {
        getUsers().then(setUserList).catch(() => {
            console.log("Not able to load the users")
        })
    }, [])
    useEffect(() => {
        getUnreadList().then(setUnreadCount).catch(() => {
            console.log("Unable to load unread count")
        })
    }, [])

    // messages
    useEffect(() => {
        if (!opened) return;

        fetchMessages(opened.id);
        return () => { abortMessages() };
    }, [opened])

    function recieve_message(msg: recieveMessage) {
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
    }
    function status_indicator(msg: statusIndicatorType) {
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
    }
    function online_list(msg: OnlineList) {
        setOnlineList(new Set(msg.payload))
    }

    function start_typing(msg: startTypingType) {
        setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.add(msg.payload.from);
            return newSet;
        })
    }
    function stop_typing(msg: stopTypingType) {
        setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(msg.payload.from);
            return newSet;
        })
    }
    function recieve_read_receipt(msg: readReceiptType) {
        if (msg.payload.from === openedRef.current?.id) {
            receieveRead(msg);
        }
    }

    return (
        <div className="h-screen flex">

            <Sidebar
                userList={userList}
                setOpened={setOpened}
                opened={opened}
                onlineList={onlineList}
                unreadCount={unreadCount}
                setUnreadCount={setUnreadCount}
            />

            <div className="flex flex-col flex-1 min-w-0">

                <Navbar
                    setOpened={setOpened}
                    opened={opened}
                    onlineList={onlineList}
                    typingUsers={typingUsers}
                />

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
    )
}

export default Chat
