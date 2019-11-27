import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let Tickets = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }
});
export default mongoose.model('Tickets', Tickets);