import mongoose from "mongoose";

const collectionName = "Message";

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, // Establece la fecha actual como valor predeterminado
    }
});

const messageModel = mongoose.model(collectionName, messageSchema);
export default messageModel;
