import { useEffect, useRef, useState } from "react"
import type { MessagesType } from "../types/message.types";
import { sendMessage, sendStartTyping, sendStopTyping } from "../services/websocket";
import type { UserType } from "../types/auth.types";

const MessageInput = ({ user, opened, setMessages, setUserList }: {
    user: UserType | null,
    opened: UserType | null,
    setMessages: React.Dispatch<React.SetStateAction<MessagesType>>,
    setUserList: React.Dispatch<React.SetStateAction<UserType[]>>
}) => {
    const [formData, setFormData] = useState({
        content: ""
    })
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingRef = useRef(false);

    useEffect(() => {
        return () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!opened || !user || !user.id) return (<></>);

    function changeHandler(e: any) {
        if (!opened) return;
        const { name, value } = e.target;

        if (!typingRef.current) {
            sendStartTyping(opened?.id);
            typingRef.current = true;
        }

        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            sendStopTyping(opened.id);
            typingRef.current = false;

        }, 1500);

        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    async function submitHandler(e: React.FormEvent<HTMLFormElement>) {

        if (!opened || !user || !user.id) return;

        e.preventDefault();

        // console.log("hell");

        if (!opened) {
            // console.log("hell2");
            return;
        }

        if (typingRef.current) {
            sendStopTyping(opened.id);
            typingRef.current = false;
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        }

        try {
            // console.log("hell3");

            sendMessage(
                opened.id,
                formData.content
            );

            let newMessage = {
                id: 'temporary_id',
                content: formData.content,
                senderId: user.id,
                receiverId: opened.id,
                createdAt: new Date(Date.now()),
            };

            setMessages((prev) => {
                return [...prev, newMessage]
            });

            setUserList((prev) => {
                let updatedUser = prev.filter(u => u.id == newMessage.receiverId);

                return [
                    ...updatedUser,
                    ...prev.filter((p) => {
                        return p.id !== updatedUser[0].id
                    })
                ]
            })


        } catch (e) {
            console.log("error");
        }
        setFormData({
            content: ""
        });
    }

    return (
        <div className="bg-white border-t p-4">
            <form
                onSubmit={submitHandler}
                className="flex gap-3 items-center"
            >
                <label className="flex-1">

                    <input
                        type="text"
                        placeholder="Type your message here..."
                        name="content"
                        onChange={changeHandler}
                        value={formData.content}
                        className="w-full border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </label>

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                    SEND
                </button>

            </form>
        </div>
    )
}

export default MessageInput
