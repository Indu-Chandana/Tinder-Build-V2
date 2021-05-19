import React from 'react';
import Avatar from "@material-ui/core/Avatar";
import "./Chat.css"
import { Link } from 'react-router-dom';



function Chat({ id, name, message }) {
    
    return (
        <Link to={`/chat/rooms/${id}`}>


            
        <div className="chat">
            <Avatar className="chat__image" src={`https://avatars.dicebear.com/api/human/${Math.floor(Math.random()*5000)}.svg`}/>
            <div className="chat__details">
                <h2>{name}</h2>
                <p>{message}</p>
            </div>
            <p className="chat__timestamp">{new Date().toUTCString()}</p>
        </div>

        </Link>
    )
}

export default Chat
