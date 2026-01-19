import { io } from "socket.io-client";
import MessageInput from "./components/MessageInput";
import { useEffect } from "react";

function App() {
	const socket = io("http://localhost:3000");

  function connectServer() {
    socket.on("connection", (socket) => {
      console.log(socket.id);
    })
  }
  useEffect(() => {
    connectServer()
  }, []);
	return (
    <>
    <MessageInput />
    </>
  );
}

export default App;
