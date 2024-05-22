import mongoose from "mongoose";

const collectionName = "Tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetimer: {
        type: Array,
        require: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchase: {
        type: String,
        required: true,
    }
});

const Tickets = mongoose.model(collectionName, ticketSchema)
export default Tickets;