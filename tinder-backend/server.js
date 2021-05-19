import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';

import Cards from "./dbCards.js";

import Messages from "./dbMessages.js"
import Pusher from "pusher";

// App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = 'mongodb+srv://admin:Abcd1234@cluster0.niyxo.mongodb.net/tinderdb?retryWrites=true&w=majority'

const pusher = new Pusher({
    appId: "1205409",
    key: "2755642c9f1c095fcfbe",
    secret: "384dfe12cee53c203cd3",
    cluster: "ap2",
    useTLS: true
  });

// Middlewares
app.use(express.json());
app.use(Cors());


// DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open',() => {
    console.log('DB connected');

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change);

        if(change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'insterted', 
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        }else {
            console.log("Error triggering Pusher");
        }
    });
});

// API Endpoints
app.get("/", (req, res) => res.status(200).send("HELLO PROGRAMMERS!!!"));

app.post('/tinder/cards', (req, res) => {
    const dbCard = req.body; 

    Cards.create(dbCard, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    });
});

app.get('/messages/sync', (req,res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.get('/tinder/cards', (req, res) => {
    Cards.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));

