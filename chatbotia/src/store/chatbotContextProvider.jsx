import { createContext, useState } from "react";
import bot from '../services/bot';

export const ChatbotContext = createContext({
    input: "",
    setInput: () => {},
    messages: [],
    post: () => {},
});

export default function ChatbotContextProvider({ children }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const post = async () => {
        if (!input.trim()) return;

        const userMsg = {
            from: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Adiciona mensagem do usuário
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true); // mostra digitando...

        try {
            const response = await bot.post(
                '/ia',
                JSON.stringify({ text: input }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const botMsg = {
                from: 'bot',
                text: response.data.response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error.message);
            setMessages(prev => [
                ...prev,
                {
                    from: 'bot',
                    text: 'Desculpe, houve um erro ao responder.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsTyping(false)
        }
    };

    const ctxValue = {
        input,
        setInput,
        messages,
        isTyping,
        post
    };

    return (
        <ChatbotContext.Provider value={ctxValue}>
            {children}
        </ChatbotContext.Provider>
    );
}
