import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Messages array will store objects like { text: 'message content', sender: 'user' | 'bot' }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Placeholder for sending message to backend/chatbot service
      // In a real application, you would send 'input.trim()' to your backend API
      // and handle the response to add the bot's message.
      const newUserMessage = { text: input, sender: 'user' };

      // Add user message with a temporary animating class
      setMessages(prevMessages => [...prevMessages, { ...newUserMessage, animating: true }]);

      setInput('');
      // Placeholder for receiving response from backend/chatbot service
      // Replace this with your actual API call
      setTimeout(() => {
        const botResponse = { text: 'This is a placeholder response.', sender: 'bot' };
        // Add bot response with a temporary animating class
        setMessages(prevMessages => [...prevMessages, { ...botResponse, animating: true }]);
      }, 500); // Simulate bot response delay
    }
  };

  // Effect to remove animating class after animation
  useEffect(() => {
    // Remove the animating class after the animation duration for each message
    messages.forEach((msg, index) => {
      if (msg.animating) {
        const timer = setTimeout(() => {
          setMessages(prevMessages => prevMessages.map((item, i) => (i === index ? { ...item, animating: false } : item)));
        }, 500); // Match the CSS animation duration
      }
    });

    // Cleanup function for useEffect (optional, but good practice)
    // if you were setting up subscriptions or event listeners that need to be cleaned up
    // Cleanup function for useEffect (optional, but good practice)
    // if you were setting up subscriptions or event listeners that need to be cleaned up
    // return () => {
    //   // cleanup code here
    // };
  }, [messages]); // Dependency array: re-run effect when messages change

  // --- JSX for rendering starts here ---
  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle-button" onClick={toggleChat}>
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              // Apply animation styles conditionally
              <div
 key={index}
 className={`message ${msg.sender} ${msg.animating ? 'message-animating' : ''}`}
 style={{
 opacity: msg.animating ? 0 : 1,
 transform: msg.animating ? 'translateY(10px)' : 'translateY(0)',
 transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
 }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;