const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Tickets = require('./models/Tickets');

// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import Tickets from './models/Tickets';

const socket = require('socket.io');

const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());


// Create link to Angular build directory
app.use(express.static(__dirname + '../dist'));

if(process.env.MONGOURL ){
    mongoose.connect(process.env.MONGOURL,{ useNewUrlParser: true, useUnifiedTopology: true  });
}
else{
    mongoose.connect("mongodb://localhost:27017",{ useNewUrlParser: true, useUnifiedTopology: true  })
}
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});



router.route('/tickets').get((req, res) => {
    Tickets.find((err, tickets) => {
        if (err)
            console.log(err);
        else
            res.json(tickets);
    });
});
router.route('/tickets/:id').get((req, res) => {
    Tickets.findById(req.params.id, (err, tickets) => {
        if (err)
            console.log(err);
        else
            res.json(tickets);
    })
});

router.route('/tickets/add').post((req, res) => {
    let tickets = new Tickets(req.body);
    tickets.save()
        .then(tickets => {
            res.status(200).json({'tickets': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

app.use('/', router);
const server = app.listen(process.env.PORT || 4000, () => {
    if(process.env.PORT ){
        console.log("Server started on port " + process.env.PORT  + "...");
    }
});
const io = socket.listen(server);
io.sockets.on('connection', (socket) => {
    console.log('a user connected');
    
    
    socket.on('newTicket', (data) => {
        let tickets = new Tickets(data);
        tickets.save()
        .then(tickets => {
            console.log(tickets);
            io.emit('new ticket', tickets);

        })
        .catch(err => {
            console.log(err);
        });
      
    });
})

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';");
    return next();
  });