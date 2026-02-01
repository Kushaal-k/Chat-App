import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, type KeyboardEvent } from "react";

function MessageInput({ onSend, disabled, onFocus }: { onSend: (text: string) => void, disabled: boolean, onFocus: () => void }) {
    const [message, setMessage] = useState("");

    const handleEnterKey = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }

    const handleSubmit = () => {
        onSend(message)
        console.log("Sending message");
        setMessage("")
    }
    return (
        <div className='flex gap-1 w-full'>
            <Input 
                className='border border-black m-2' 
                placeholder='Type a message...' 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                disabled={disabled} 
                onFocus={onFocus} 
                onBlur={onFocus} 
                onKeyDown={handleEnterKey} 
            />
            <Button className='m-2 ml-0 w-32 ' onClick={handleSubmit} >SEND</Button>
        </div>
    );
}

export default MessageInput;
