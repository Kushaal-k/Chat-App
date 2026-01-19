import { Input } from "./ui/input";
import { Button } from "./ui/button";

function MessageInput() {
	return (
		<div className='flex gap-1 w-full p-4 border border-gray-400'>
			<Input className='bg-gray-200' placeholder='Type a message...' />
			<Button className='ml-1'>SEND</Button>
		</div>
	);
}

export default MessageInput;
