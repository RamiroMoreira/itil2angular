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
            Tickets.findOne({_id: tickets._id}).populate('tipoTicket').exec(function(err,res){
                if (err)
                    console.log(err);
                else
                    io.emit('new ticket', res);
              });

            

        })
        .catch(err => {
            console.log(err);
        });
    });
})

var MailListener = require("mail-listener2");

var username = process.env.USERNAME_MAIL || "testitilmail@gmail.com";
var password = process.env.PASSWORD_MAIL || "itilmail"; 
var mailListener = new MailListener({
    username: username,
    password: password,
    host: "imap.gmail.com",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});
mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
    // do something with mail object including attachments
    // mail processing code goes here
    var tipo = TipoTicket.findOne({}, function(err,res){
        if(!res){
            return;
        }
        let tickets = new Tickets({title:mail.subject, description: mail.text, tipoTicket: res._id});
        tickets.save()
        .then(tickets => {
            Tickets.findOne({_id: tickets._id}).populate('tipoTicket').exec(function(err,res){
              if (err)
                  console.log(err);
              else
                  io.emit('new ticket', res);
            });
         })
        .catch(err => {
            console.log(err);
        });
    });
   

});

mailListener.on("attachment", function(attachment){
  console.log(attachment.path);
});

