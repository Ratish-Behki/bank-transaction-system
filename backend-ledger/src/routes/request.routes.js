const express = require("express");
const router = express.Router();

const { requestMoney, getIncomingRequests, acceptRequest, rejectRequest } = require("../controllers/request.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

/**
 * /api/request
 */

// create request
router.post("/", authMiddleware, requestMoney);

//get notification
router.get("/incoming",authMiddleware,getIncomingRequests)

//accepting for trasaction
router.post("/:id/accept", authMiddleware,acceptRequest);

//rejecting
router.post("/:id/reject", authMiddleware,rejectRequest);

module.exports = router;