import { useEffect, type RefObject } from "react";
import type { Message } from "@/hooks/useChat";

interface useAutoScrollPorps {
    messages: Message[],
    typingUser: string[],
    messageEndRef: RefObject<HTMLDivElement>
}

const useAutoScroll = ({messages, typingUser, messageEndRef}: useAutoScrollPorps) => {
    useEffect(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth"});
        }, [messages, typingUser])
}

export default useAutoScroll