import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I\'m your Streamifyy assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
      setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: getBotResponse(inputValue.trim()),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (input) => {
    const responses = {
      'hello': 'Hi there! How can I assist you today?',
      'help': 'I can help you with: \n- Finding videos\n- Managing your playlists\n- Account settings\n- Technical support',
      'upload': 'To upload a video:\n1. Click the upload button in the top right\n2. Select your video file\n3. Fill in the details\n4. Click publish',
      'playlist': 'You can create and manage playlists from your library section. Need more specific help?',
      'account': 'For account-related questions, please visit your account settings or contact our support team.',
      'default': 'I\'m not sure about that. Could you try rephrasing or ask something else?'
    };

    const lowercaseInput = input.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowercaseInput.includes(key)) {
        return value;
      }
    }
    return responses.default;
  };

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <>
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" className={`chatbot-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? (
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          ) : (
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          )}
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chatbot-header">
              <h2>Streamifyy Assistant</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
      </button>
            </div>

          <div className="chatbot-messages">
              {messages.map((message, index) => (
                <motion.div
 key={index}
                  className={`message ${message.type}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {message.type === 'bot' && (
                    <div className="bot-avatar">
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
              </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  className="typing-indicator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
          </div>

            <form onSubmit={handleSubmit} className="chatbot-input">
            <input
                ref={inputRef}
              type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
            />
              <button type="submit" disabled={!inputValue.trim()}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
          </form>
          </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
