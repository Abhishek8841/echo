import { useState } from "react"
import type { MessagesType } from "../types/message.types";
import { sendMessage } from "../services/websocket";
import type { UserType } from "../types/auth.types";

const MessageInput = ({ user, opened, setMessages }: {
    user: UserType | null, opened: UserType | null, setMessages: React.Dispatch<React.SetStateAction<MessagesType>>
}) => {
    const [formData, setFormData] = useState({
        content: ""
    })
    if (!opened || !user || !user.id) return (<></>);
    function changeHandler(e: any) {
        const { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }
    async function submitHandler(e: React.FormEvent<HTMLFormElement>
    ) {
        if (!opened || !user || !user.id) return (<></>);
        e.preventDefault();
        console.log("hell");
        if (!opened) {
            console.log("hell2");
            return;
        }
        try {
            console.log("hell3");
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
            setMessages((prev) => { return [...prev, newMessage] });
        } catch (e) {
            console.log("error");
        }
        setFormData({
            content: ""
        });
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <label>
                    <input
                        type="text"
                        placeholder="type your message here..."
                        name="content"
                        onChange={changeHandler}
                        value={formData.content}
                    ></input>
                    MESSAGE_INPUT:
                </label>
                <button>SEND</button>
            </form>
        </div>
    )
}

export default MessageInput