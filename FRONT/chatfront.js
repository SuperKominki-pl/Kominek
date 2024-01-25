import { useState, useEffect } from 'react';
import * as bot from './ChatBot/bot.py';

const ChatbotComponent = () => {
  const [userMessage, setUserMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [response, setResponse] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  useEffect(() => {
    // Pobierz i ustaw początkową wiadomość od chatbota podczas otwierania komponentu
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chatbot/initial-message');
        const data = await response.json();
        setInitialMessage(data.initial_message);
      } catch (error) {
        console.error('Błąd podczas pobierania początkowej wiadomości od chatbota:', error);
      }
    };

    fetchInitialMessage();
  }, []); // Uruchomi się tylko raz podczas montowania komponentu

  const sendMessageToChatbot = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: userMessage, history }),
      });

      const data = await response.json();
      setResponse(data.response);
      // Dodaj logikę aktualizacji historii lub innych działań na odpowiedzi chatbota
    } catch (error) {
      console.error('Błąd podczas wysyłania żądania do chatbota:', error);
    }
  };

  return (
    <div>
      <div>
        {/* Wyświetl początkową wiadomość chatbota */}
        {initialMessage && <div>{initialMessage}</div>}
        {/* Tutaj możesz wyświetlać historię czatu lub inne elementy interfejsu użytkownika */}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button onClick={sendMessageToChatbot}>Wyślij</button>
      <div>
        {/* Tutaj możesz wyświetlać odpowiedzi od chatbota */}
        {response && <div>{response}</div>}
      </div>
    </div>
  );
};

export default ChatbotComponent;