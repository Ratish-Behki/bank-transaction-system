const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const emailServices = require('../services/email.service')
const AccountModel = require('../models/account.model')

const checkFraud = require("../services/fraudService");
const userModel = require('../models/user.model')
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
            return new Promise((resolve) => setTimeout(resolve, 2 * 10));
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
     * SEND EMAIL TO BOTH USERS
     */


    const receiverAccount = await AccountModel.findById(toAccount)


    const receiverUser = await userModel.findById(

        receiverAccount.user

    )



    await emailServices.sendTransactionEmail({

        senderEmail: req.user.email,

        senderName: req.user.name,

        receiverEmail: receiverUser.email,

        receiverName: receiverUser.name,

        amount,

        fromAccount,

        toAccount,

        transactionId: transaction._id

        })



    return res.status(201).json({

        message:"transaction completed successfully",

        transaction

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

async function transferMoney(req,res){

 const {fromAccount,toAccount,amount} = req.body;

 // 1. check balance
 const sender = await AccountModel.findById(fromAccount);

 if(sender.balance < amount){

  return res.status(400).json({

   message:"Insufficient balance"

  });

 }

 // 2. fraud detection call
 const fraudResult = await checkFraud({

  amount,
  location:req.ip,
  device:req.headers["user-agent"],
  time:new Date()

 });

 console.log("fraud response",fraudResult);

 // 3. block suspicious transaction
 if(fraudResult.reward === 0){

  return res.status(403).json({

   message:"Suspicious transaction blocked"

  });

 }

 // 4. safe DB transaction
 const session = await mongoose.startSession();

 await session.withTransaction(async()=>{

  sender.balance -= amount;

  const receiver = await AccountModel.findById(toAccount);

  receiver.balance += amount;

  await sender.save({session});
  await receiver.save({session});

 });

 res.json({

  message:"Transaction successful"

 });

}

module.exports ={createTransaction,createInitialFundsTransaction,getTransactions,transferMoney};