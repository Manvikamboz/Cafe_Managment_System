import { useState } from 'react';
import API from '../api/axios';
import { MessageSquare, Send, X } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to Smart Café! I am your personal barista assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const { data } = await API.post('/chatbot/message', { message: userMsg });
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="chatbot-window card">
          <div className="chatbot-header">
            <h3>Smart Assistant</h3>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className="message-bubble">{m.text}</div>
              </div>
            ))}
            {isTyping && <div className="message bot"><div className="message-bubble typing">...</div></div>}
          </div>
          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
