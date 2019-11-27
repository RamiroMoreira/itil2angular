const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Tickets = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }
});
module.exports =  mongoose.model('Tickets', Tickets);