const accountModel = require('../models/account.model');
const { get } = require('../services/email.service');

async function createAccountController(req, res) {
    const userId = req.user && (req.user._id || req.user.userId);

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const account = await accountModel.create({
        user: userId
    });

    res.status(201).json({
        success: true,
        account
    });
}

async function getUserAccountController(req,res){
    const accounts = await accountModel.find({user:req.user._id})

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req,res){
    const {accountId} =req.params

    const account = await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        return res.status(404).json({
            message:"account not found"
        })
    }

    const balance = await account.getBalance()

    return res.status(200).json({
        accountId:account._id,
        balance:balance
    })
}


module.exports = { createAccountController,getUserAccountController,getAccountBalanceController };