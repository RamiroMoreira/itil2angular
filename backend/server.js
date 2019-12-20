const express = require('express')
const cors = require('cors')
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


var server = require("./router").server

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

exports.io = io;
var ml = require("./mailListener.js");

