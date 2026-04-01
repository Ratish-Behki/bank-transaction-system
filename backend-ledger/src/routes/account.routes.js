const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');

const router = express.Router();

router.post('/', authMiddleware, accountController.createAccountController);

router.get("/",authMiddleware,accountController.getUserAccountController)

router.get("/balance/:accountId",authMiddleware,accountController.getAccountBalanceController)

router.get("/find-by-email",authMiddleware,accountController.findAccountByEmail);

module.exports = router;