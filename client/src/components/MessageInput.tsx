import { useState } from "react"
import type { MessagesType } from "../types/message.types";
import { sendMessage } from "../services/websocket";

const MessageInput = ({ opened, setMessages }: {
    opened: string | null, setMessages: React.Dispatch<React.SetStateAction<MessagesType>>
}) => {
    const [formData, setFormData] = useState({
        content: ""
    })
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
        e.preventDefault();
        console.log("hell");
        if (!opened)
        {
            console.log("hell2");
            return;
        }
        try {
            console.log("hell3");
            sendMessage(
                opened,
                formData.content
            );

        } catch (e) {
            console.log("error");
        }
        setFormData({
            content: ""
        });
    }
    if (!opened) return (<></>);
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