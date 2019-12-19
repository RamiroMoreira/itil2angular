const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TipoTicket = new Schema({
    tipo: {
        type: String
    }
},{collection: 'tipoTickets' });

module.exports =  mongoose.model('TipoTickets', TipoTicket);