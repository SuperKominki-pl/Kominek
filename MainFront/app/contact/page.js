"use client"
import PlaceholderIcon from "../../public/assets/arrow-small-right.svg"
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import axios from 'axios'
export default function Page() {

    const [messages, setMessages] = useState([]);
    const endOfMessagesRef = useRef(null);
    const [message, setMessage] = useState("");

    const receiveMessage = (text) => {
        const newMessage = {id: messages.length + 1, text, sender: 'other'};
        setMessages([...messages, newMessage]);
    };

    useEffect(() => {
    const fetchInitialMessage = async () => {
        try {
            const response = await axios.get('http://51.68.155.42:5000/api/chatbot/initial-message');
            const initialMessage = response.data.initial_message;
            receiveMessage(initialMessage);
        } catch (error) {
            console.error('Error fetching initial message:', error);
        }
    };

    fetchInitialMessage();
    endOfMessagesRef.current?.scrollIntoView({behavior: 'smooth'});
}, []);


    const sendMessage = async (text) => {
    const newMessage = {id: messages.length + 1, text, sender: 'user'};
    setMessages([...messages, newMessage]);
    setMessage("");

    try {
        // Wyślij wiadomość do chatbota
        const response = await axios.post('http://51.68.155.42:5000/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_message: text,
                history: messages,
            })
        });

        // Odbierz odpowiedź od chatbota
        const chatbotMessage = response.data.response;

        // Dodaj odpowiedź chatbota do wiadomości
        receiveMessage(chatbotMessage);
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
    }
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