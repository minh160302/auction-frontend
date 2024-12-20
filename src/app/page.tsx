"use client";
import useWebSocket from "@/hooks/useWebSocket";
import { FormEventHandler, useState } from "react";

export default function Home() {
  const { messages, sendMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8080"
  );
  const [input, setInput] = useState<string>("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  return (
    <div>
      <h1>Real-time Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-black"
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <div>{msg}</div>
            <div>---------------------</div>
          </div>
        ))}
      </div>
    </div>
  );
}
