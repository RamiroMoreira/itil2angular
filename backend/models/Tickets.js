const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Tickets = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    fechaIngreso: {
        type: Date
    },
    tipoTicket: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TipoTickets',
        required:true
    }
});
Tickets.pre('save',function (next) {
    var self = this;
    self.fechaIngreso = new Date();
    next();
}) ;
module.exports =  mongoose.model('Tickets', Tickets);