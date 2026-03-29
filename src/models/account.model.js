const mongoose = require('mongoose');
const { $where } = require('./user.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index:true,
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'INR'], 
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'inactive', 'suspended'],
        default: 'ACTIVE'
    }
}, { timestamps: true });

accountSchema.index({user:1,status:1})

const LedgerModel = require("./ledger.model");

accountSchema.methods.getBalance = async function () {

const balanceData = await LedgerModel.aggregate([
    {
        $match: {
            account: this._id
        }
    },
    {
        $group: {
            _id: null,

            totalDebit: {
                $sum: {
                    $cond: [
                        { $eq: ["$type", "debit"] },
                        "$amount",
                        0
                    ]
                }
            },

            totalCredit: {
                $sum: {
                    $cond: [
                        { $eq: ["$type", "credit"] },
                        "$amount",
                        0
                    ]
                }
            }

        }
    }

]);

const totalDebit = balanceData[0]?.totalDebit || 0;
const totalCredit = balanceData[0]?.totalCredit || 0;

const balance = totalCredit - totalDebit;

return {
    totalDebit,
    totalCredit,
    balance
};
};

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;