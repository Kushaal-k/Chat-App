import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

function MessageInput({ onSend }: { onSend: (text: string) => void}) {
    const [message, setMessage] = useState("");
    
    const handleSubmit = () => {
        onSend(message)
        console.log("Sending message");
        setMessage("")
    }
	return (
		<div className='flex gap-1 w-full p-4 border border-gray-400'>
			<Input className='bg-gray-200' placeholder='Type a message...' value={message} onChange={(e)=>setMessage(e.target.value)}/>
			<Button className='ml-1' onClick={handleSubmit}>SEND</Button>
		</div>
	);
}

export default MessageInput;
