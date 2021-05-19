import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Header';
import SwipeButtons from './SwipeButtons';
import TinderCards from './TinderCards';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Chats from './Chats';
import ChatScreen from './ChatScreen';
import Pusher from 'pusher-js';
import axios from "./axios";

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
    .then(response => {
      setMessages(response.data);
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('2755642c9f1c095fcfbe', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('insterted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages]);

  console.log(messages);

  return (
    <div className="app">

      <Router>

      
        <Switch>
        <Route path="/chat/rooms/:roomId">
            <Header backButton="/chat" />
            <ChatScreen messages={messages}/>
          </Route>
          <Route path="/chat">
            <Header backButton="/" />
            <Chats/>
          </Route>
          <Route path="/">
            <Header/>
            <TinderCards/>
            <SwipeButtons/>
          </Route>
        </Switch>

      </Router>
      

    </div>
  );
}

export default App;
