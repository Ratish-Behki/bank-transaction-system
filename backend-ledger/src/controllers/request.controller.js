const mongoose=require("mongoose")
const Request = require("../models/request.model");
const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");

async function requestMoney(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { to, amount } = req.body;

    if (!to || !amount) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    if (to === req.user._id.toString()) {
      return res.status(400).json({
        message: "Cannot request from yourself",
      });
    }

    const receiver = await userModel.findById(to);
    if (!receiver) {
      return res.status(404).json({
        message: "TO User not found",
      });
    }

    // 🔥 OPTION 2 — Prevent duplicate pending request
    const existing = await Request.findOne({
      from: req.user._id,
      to,
      amount,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "Request already exists",
      });
    }

    // 🔥 OPTION 3 — Limit pending requests (max 5)
    const pendingCount = await Request.countDocuments({
      from: req.user._id,
      status: "pending",
    });

    if (pendingCount >= 5) {
      return res.status(400).json({
        message: "You already have too many pending requests",
      });
    }

    const request = await Request.create({
      from: req.user._id,
      to,
      amount,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });

    } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}


async function getIncomingRequests(req,res){
    try{
        const userId=req.user._id;

        const requests=await Request.find({
            to: userId,
            status: "pending"
        })
        .populate("from", "name email") // Harneet requested ₹30 for this in frontend
        .sort({ createdAt: -1 });

        res.status(200).json({
        count: requests.length,
        requests
    });
    }catch (err) {
    res.status(500).json({
      message: err.message
    });
    }
}

async function acceptRequest(req,res){
    const session =await mongoose.startSession();
    session.startTransaction()

    try{
        const requestId=req.params.id;
        const request=await Request.findById(requestId).session(session);

        if (!request || request.status !== "pending") {
            throw new Error("Invalid or already processed request");
        }

        // 🔒 Only receiver (payer) can accept
        if (request.to.toString() !== req.user._id.toString()) {
            throw new Error("Unauthorized");
        }

        // 🧠 Generate idempotency key
        const idempotencyKey = `request_${requestId}`;

        // 🔁 Check if transaction already exists
        const existingTransaction = await transactionModel.findOne({ idempotencyKey });

        if (existingTransaction) {
            if (existingTransaction.status === "completed") {
                return res.status(200).json({
                message: "Request already accepted",
                });
            }

            if (existingTransaction.status === "pending") {
                return res.status(200).json({
                message: "Request is still processing",
                });
            }
        }

        // fetching accounts

        const fromAccount = await accountModel.findOne({ user: request.to }).session(session);
        const toAccount = await accountModel.findOne({ user: request.from }).session(session);

        if (!fromAccount || !toAccount) {
            throw new Error("Account not found");
        }

        // 💸 Check balance using ledger
        const balance = await fromAccount.getBalance();

        if (balance < request.amount) {
            throw new Error("Insufficient balance");
        }

        // 🧾 Create transaction (PENDING)
        const transaction = (await transactionModel.create([{
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            amount: request.amount,
            idempotencyKey,
            status: "pending",
        }], { session }))[0];

        // 💰 CREDIT receiver
        
        await ledgerModel.create([{
            account: toAccount._id,
            amount: request.amount,
            transaction: transaction._id,
            type: "credit",
        }], { session });

        // 💸 DEBIT sender
        await ledgerModel.create([{
            account: fromAccount._id,
            amount: request.amount,
            transaction: transaction._id,
            type: "debit",
        }], { session });

        // ✅ Mark transaction completed
        transaction.status = "completed";
        await transaction.save({ session });

        // ✅ Update request
        request.status = "accepted";
        await request.save({ session });

        await session.commitTransaction();

        res.json({
            message: "Request accepted and money transferred",
            transactionId: transaction._id,
        });

    }
    
    catch (err) {
        await session.abortTransaction();
        res.status(400).json({
            message: err.message,
        });
    } 
    
    finally {
        session.endSession();
    }
} 

async function rejectRequest(req, res) {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({
        message: "Invalid or already processed request",
      });
    }

    // 🔒 Only receiver can reject
    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      message: "Request rejected successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
module.exports = {
  requestMoney,getIncomingRequests,acceptRequest,rejectRequest
};