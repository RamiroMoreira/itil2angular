const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Tickets = require('./models/Tickets');
const TipoTicket = require('./models/TipoTicket');
const path = require('path');

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
app.use('/', router);


// Create link to Angular build directory
app.use(express.static(__dirname + '/../dist/frontend'));
// Serve application paths
const dist = 'dist';



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
    console.log("Listing tickets");
    Tickets.find().populate('tipoTicket').sort({fechaIngreso: -1}).exec((err, tickets) => {
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
    console.log("Adding ticket");
    let tickets = new Tickets(req.body);
    tickets.save()
        .then(tickets => {
            console.log("Ticket added");
            res.status(200).json({'tickets': 'Added successfully'});
        })
        .catch(err => {
            console.log("Ticket error"+err);
            res.status(400).send('Failed to create new record');
        });
});

router.route('/tipoTickets').get((req, res) => {
    TipoTicket.find((err, tipo) => {
        if (err){
            console.log(err);
        }
        else{
            res.json(tipo);
        }
            
    });
});
app.all('*', function (req, res) {
    
    const fullPath = path.join(__dirname + '/../dist/frontend/index.html');
    console.log("la ruta es: "+fullPath);
    res.status(200).sendFile(`/`, { root: fullPath });
});

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
