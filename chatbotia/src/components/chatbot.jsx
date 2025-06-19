import 'bootstrap/dist/css/bootstrap.min.css';
import botimag from '../assets/istockphoto-1221348467-612x612.jpg'
import * as Icon from 'react-icons/bs';
import ChatbotContextProvider, { ChatbotContext } from '../store/chatbotContextProvider';
import { useContext, useRef, useEffect } from 'react';


export default function Chatbot() {
    return (
        <ChatbotContextProvider>
            <ChatbotContent />
        </ChatbotContextProvider>
    )
}


function ChatbotContent() {
    const ctx = useContext(ChatbotContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Rola até o fim sempre que as mensagens mudarem
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [ctx.messages]);

    return (
        <div className="container py-4">
            <div className="chat_box_wrapper border rounded shadow p-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                <div className="d-flex align-items-center mb-3 popup-head">
                    <img src={botimag} className="rounded-circle me-2" alt="User" width="50" />
                    <div>
                        <h5 className="mb-0">ArcoBot</h5>
                        <small className="text-muted">IA Assistant</small>
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-outline-danger btn-sm">
                            <i><Icon.BsFillXCircleFill /></i>
                        </button>
                    </div>
                </div>

                <div className="chat_box mb-3">
                    {
                        ctx.messages.map((msg, index) => (
                            <div className={`mb-2 ${msg.from === 'user' ? 'text-end' : ''} `} key={index}>
                                <div className={`d-flex ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`${msg.from === 'user' ? 'bg-success text-white' : 'bg-light'} rounded p-2 chat_message`}>
                                        <p className="mb-1">{msg.text}</p>
                                        <small className="text-muted ">{msg.time}</small>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        ctx.isTyping && (
                            <div className="d-flex">
                                <div className="bg-light rounded p-2">
                                    <p className="mb-1"><div className='loader'></div></p>
                                </div>
                            </div>
                        )
                    }
                    <div ref={messagesEndRef} /> {/* âncora para scroll automático */}
                </div>

                <form className="d-flex border-top pt-3" onSubmit={(e) => {
                    e.preventDefault();
                    ctx.post();
                }}>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type a message"
                        value={ctx.input}
                        onChange={(e) => ctx.setInput(e.target.value)}
                    />
                    <button className="btn btn-success px-3" type="submit">
                        <i><Icon.BsSendFill /></i>
                    </button>
                </form>
            </div>
        </div>
    );
}

