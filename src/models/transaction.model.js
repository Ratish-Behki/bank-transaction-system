const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index:true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index:true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending',
    },
    idempotencyKey: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = TransactionModel;