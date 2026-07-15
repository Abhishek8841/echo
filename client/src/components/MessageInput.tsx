import { useEffect, useRef, useState } from "react"
import type { singleMessageType } from "../types/message.types";
import { sendMessage, sendStartTyping, sendStopTyping } from "../services/websocket";
import type { UserType } from "../types/auth.types";
import { useAuth } from "../hooks/useAuth";

const MessageInput = ({ opened, appendMessage, setUserList }: {
    opened: UserType | null,
    appendMessage: (m: singleMessageType) => void,
    setUserList: React.Dispatch<React.SetStateAction<UserType[]>>
}) => {
    const { user } = useAuth();
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

        if (!opened) {
            return;
        }

        if (typingRef.current) {
            sendStopTyping(opened.id);
            typingRef.current = false;
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        }

        try {
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
                readAt: null,
            };
            appendMessage(newMessage);

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
        <div className="border-t border-[#F0F0EE] px-5 py-2.5 shrink-0">
            <form
                onSubmit={submitHandler}
                className="flex gap-2 items-center"
            >
                <input
                    type="text"
                    placeholder="Write a message..."
                    name="content"
                    onChange={changeHandler}
                    value={formData.content}
                    autoComplete="off"
                    className="flex-1 bg-transparent text-[13.5px] text-[#37352F] px-1 py-1.5 outline-none placeholder:text-[#B4B4B0]"
                />

                <button
                    type="submit"
                    className="bg-[#F4F3EF] hover:bg-[#EBEBEA] text-[#37352F] text-[12px] font-medium px-3.5 py-[6px] rounded-md transition-colors duration-100"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default MessageInput
