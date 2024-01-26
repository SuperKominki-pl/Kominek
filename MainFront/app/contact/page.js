import PlaceholderIcon from "../../public/assets/arrow-small-right.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'; // Import dynamic z next/dynamic

const ClientOnlyComponent = dynamic(
  () => import('../path-to-your-client-only-component'), // ścieżka do komponentu używającego useRef
  { ssr: false } // Włącz wyłączanie Server-Side Rendering (SSR) dla tego komponentu
);

export default function Page() {
    const endOfMessagesRef = useRef(null);
    const [message, setMessage] = useState("");

    // Przenieś logikę do komponentu po stronie klienta
    const ClientComponent = () => {
        const sendMessageToChatbot = async (userMessage) => {
            try {
                const response = await axios.post('http://51.68.155.42:5000/api/chatbot', {
                    user_message: userMessage,
                    history: message,
                });

                const { response: chatbotResponse, initial_message: customChatbotMessage } = response.data;

                // Aktualizacja stanu wiadomości w React
                setMessage([...message, { text: chatbotResponse, sender: 'other' }]);

                // Aktualizacja stanu wiadomości w React dla wiadomości początkowej
                setMessage([...message, { text: customChatbotMessage, sender: 'other' }]);
            } catch (error) {
                console.error('Error sending message to chatbot:', error);
            }
        };

        useEffect(() => {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
            // Dodaj wywołanie funkcji dla wiadomości początkowej po pierwszym renderowaniu komponentu
            sendMessageToChatbot('');
        }, []);

        return (
            <section className={"px-[15px]"}>
                <div className="chat-container">
                    <div className="messages-container">
                        {message.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                    <form
                        className={"flex items-center rounded-md bg-[#292936] px-[16px] py-[12px]"}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    >
                        <input
                            value={message.text}
                            onChange={(e) => setMessage({ ...message, text: e.target.value })}
                            type="text"
                            className={"flex-grow bg-transparent outline-none text-white"}
                            placeholder="Napisz wiadomość..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessageToChatbot(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                    </form>

                    {/* Wyrenderuj komponent tylko po stronie klienta */}
                    {typeof window !== 'undefined' && <ClientOnlyComponent />}
                </div>
            </section>
        );
    }

    // Renderuj komponent po stronie klienta
    return <ClientComponent />;
}