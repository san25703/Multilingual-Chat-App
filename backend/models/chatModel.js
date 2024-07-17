const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;

import React, { useState, useEffect } from 'react';

const Chats = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Handle incoming messages
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      translateMessage(message.text);
    });

    return () => socket.off('message');
  }, [socket]);

  // Translate message
  const translateMessage = async (text) => {
    const response = await fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang: selectedLanguage }),
    });
    const data = await response.json();
    setTranslatedMessages((prevMessages) => [...prevMessages, data.translation]);
  };

  return (
    <div>
      <select onChange={(e) => setSelectedLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>

      </select>

      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index}>
            <p><strong>{message.user}</strong>: {translatedMessages[index] || message.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
