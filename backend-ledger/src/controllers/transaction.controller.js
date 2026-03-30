const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const emailServices = require('../services/email.service')
const AccountModel = require('../models/account.model')
const mongoose = require('mongoose')
/**
 * steps:
 * -validate request,idempotency key
 * -check account status
 * -sender balance from ledger
 * -create transaction(pending)
 * -create debit and credit ledger entry
 * -mark transaction complete
 * -commit mongodb
 * -send email notification(via emailServies)
 */

async function createTransaction(req,res){

    /**
     * -validate request
     */
    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"need fromAccount,toAccount,amount,idempotencyKey"
        })
    }

    const fromUserAccount = await AccountModel.findOne({
        _id:fromAccount,
    })

    const toUserAccount = await AccountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        res.status(400).json({
            message:"Invalid from or to account"
        })
    }

    /**
     * -idempotencykey(so that 2 transaction not happen)
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status == "pending"){
            return res.status(200).json({
                success: true,
                message: "Transaction already pending",
                data: { transaction: isTransactionAlreadyExists }
            });
        }
        if(isTransactionAlreadyExists.status == "completed"){
            return res.status(200).json({
                success: true,
                message: "Transaction already completed",
                data: { transaction: isTransactionAlreadyExists }
            });
        }
        if(isTransactionAlreadyExists.status == "failed"){
            return res.status(400).json({
                success: false,
                message: "Transaction already failed",
                data: { transaction: isTransactionAlreadyExists }
            });
        }
        if(isTransactionAlreadyExists.status == "cancelled"){
            return res.status(400).json({
                success: false,
                message: "Transaction already cancelled",
                data: { transaction: isTransactionAlreadyExists }
            });
        }
    }

    /**
     * -check account status
     */

    if(fromUserAccount.status!="ACTIVE" || toUserAccount.status !="ACTIVE"){
        return res.status(400).json({
            message: "not active status"
        });
    }

    /**
     * -derive sender balance from ledger(aggregation pipeline inside account.model.js)
     */
    const balance = await fromUserAccount.getBalance()

    if(balance<amount){
        return res.status(400).json({
            message:"Insufficient balance"
        })
    }

    /**
     * -create transaction(pending)
     */
    let transaction;
    try{
        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"pending"
        }],{session}))[0]

        const debitLedgerEntry = await ledgerModel.create([{
            account:fromAccount,
            amount:amount,
            transaction:transaction._id,
            type:"debit"
        }],{session})

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        })()

        const creditLedgerEntry = await ledgerModel.create([{
            account:toAccount,
            amount:amount,
            transaction:transaction._id,
            type:"credit"
        }],{session})

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "completed" },
            { session }
        )
        
        await session.commitTransaction()
        session.endSession()
    }

    catch (error) {

        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })

    }
    
    /**
     * Send email notification
     */

    await emailServices.sendTransactionEmail(req.user.email, req.user.name, amount, fromAccount, toAccount)
    return res.status(201).json({
        message:"transaction completed successfully",
        transaction:transaction
    })
}

async function createInitialFundsTransaction(req,res){
    const{toAccount,amount,idempotencyKey}=req.body

    if( !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"need toAccount,amount,idempotencyKey"
        })
    }

    const toUserAccount = await AccountModel.findOne({
        _id:toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toaccount"
        })
    }

    const fromUserAccount = await AccountModel.findOne({
        user: req.user._id,
        status: "ACTIVE"
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"Invalid system user account"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"pending"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"debit"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"credit"
    }],{session})

    transaction.status = "completed"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"initial funds transaction completed successfully",
        transaction:transaction
    })
}

const getTransactions = async (req, res) => {

 const accounts = await AccountModel.find({

  user: req.user._id

 });

 const accountIds = accounts.map(a => a._id);


 const transactions = await transactionModel
 .find({

  $or: [

   { fromAccount: { $in: accountIds } },

   { toAccount: { $in: accountIds } }

  ]

 })

 .populate({

  path: "fromAccount",

  populate: {

   path: "user",

   select: "name email"

  }

 })

 .populate({

  path: "toAccount",

  populate: {

   path: "user",

   select: "name email"

  }

 })

 .sort({ createdAt: -1 });


 res.status(200).json(transactions);

};
module.exports ={createTransaction,createInitialFundsTransaction,getTransactions};