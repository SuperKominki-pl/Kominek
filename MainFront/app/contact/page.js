"use client"
import PlaceholderIcon from "../../public/assets/arrow-small-right.svg"
import Image from "next/image";
import {useEffect, useRef, useState} from "react";

export default function Page() {

    const [messages, setMessages] = useState([]);
    const endOfMessagesRef = useRef(null);
    const [message, setMessage] = useState("");

    const receiveMessage = (text) => {
        const newMessage = {id: messages.length + 1, text, sender: 'other'};
        setMessages([...messages, newMessage]);
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);


    const sendMessage = (text) => {
        const newMessage = {id: messages.length + 1, text, sender: 'user'};
        setMessages([...messages, newMessage]);
        setMessage("");
    };


    return (
        <section className={"px-[15px]"}>

            <div className="chat-container">
                <div className="messages-container">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef}/>
                </div>
                <form className={"flex items-center rounded-md bg-[#292936] px-[16px] py-[12px]"}
                      onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                              e.preventDefault();
                          }
                        }}
                      >
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className={"flex-grow bg-transparent outline-none text-white"}
                        placeholder="Napisz wiadomość..."
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                    {/*<span className={"p-3 bg-accentColor rounded-md"}*/}
                    {/*    onClick={() => {*/}
                    {/*        sendMessage(message);*/}
                    {/*        setMessage('');*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Image src={PlaceholderIcon} alt={"placeholder-icon"} width={15} height={15}/>*/}
                    {/*</span>*/}
                </form>

            </div>

        </section>
    )
}