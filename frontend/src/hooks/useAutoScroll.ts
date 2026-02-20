import { useEffect, type RefObject } from "react";
import type { Message } from "@/hooks/useChat";

interface useAutoScrollProps {
    messages: Message[],
    typingUser: string[],
    messageEndRef: RefObject<HTMLDivElement> 
}

const useAutoScroll = ({messages, typingUser, messageEndRef}: useAutoScrollProps) => {
    useEffect(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth"});
        }, [messages, typingUser])
}

export default useAutoScroll