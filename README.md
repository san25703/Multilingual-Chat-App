# MERN Chat App with Real-Time Translation

This project is a chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with an integrated real-time translation feature using the LibreTranslate API.

### Usage

The MERN Chat App allows users to register and log in to engage in real-time messaging. Users can select their preferred language from a dropdown menu, enabling messages to be translated automatically into the chosen language. This feature facilitates seamless communication between users speaking different languages, making the app a versatile tool for multilingual chat environments.

## Features

- Real-time messaging
- User authentication
- Real-time translation of messages into selected languages
- Responsive design

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** Socket.io
- **Translation API:** LibreTranslate

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mern-chat-app.git
   cd mern-chat-app
   ```

2. **Install dependencies:**
   ```bash
   # For backend
   cd server
   npm install

   # For frontend
   cd ../client
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `server` directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Run the application:**
   ```bash
   # Start the backend server
   cd server
   npm start

   # Start the frontend server
   cd ../client
   npm start
   ```

5. **Access the application:**
   Open your browser and go to `http://localhost:3000`.

## Usage

1. **Register and log in:**
   Create a new account or log in with your existing credentials.

2. **Select a language:**
   Use the dropdown menu to select your preferred language for message translation.

3. **Send and receive messages:**
   Messages will be translated in real-time to the selected language.

## Code Structure

### Backend (`/server`)

- **`server.js`:** Main server file that sets up the Express server and routes.
- **`routes/`:** Contains API routes for user authentication, messaging, and translation.
- **`models/`:** Contains Mongoose models for User and Message.
- **`controllers/`:** Contains logic for handling requests and business logic.

### Frontend (`/client`)

- **`src/components/`:** Contains React components such as `Chat`, `Login`, `Register`, and others.
- **`src/App.js`:** Main React component that sets up routing.
- **`src/context/`:** Contains context providers for global state management.

## API Endpoints

### Authentication

- **`POST /api/auth/register`:** Register a new user.
- **`POST /api/auth/login`:** Log in an existing user.

### Messaging

- **`GET /api/messages`:** Get all messages.
- **`POST /api/messages`:** Send a new message.

### Translation

- **`POST /translate`:** Translate a message to the selected language.

## Real-Time Translation Integration

### Backend (`/server/server.js`)

```javascript
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: 'auto',
      target: targetLang,
    });
    res.send({ translation: response.data.translatedText });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### Frontend (`/client/src/components/Chat.js`)

```javascript
import React, { useState, useEffect } from 'react';

const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      translateMessage(message.text);
    });

    return () => socket.off('message');
  }, [socket]);

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
        {/* Add more languages as needed */}
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
```
## Acknowledgements

- [LibreTranslate](https://libretranslate.com/) for providing the translation API.
- The MERN stack community for providing excellent resources and support.
