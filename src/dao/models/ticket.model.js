import mongoose from 'mongoose';

const ticketsColeccion = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    strict: false
});

export const TicketEsquema = mongoose.model(ticketsColeccion, ticketSchema);
