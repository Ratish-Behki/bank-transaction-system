const express = require('express');

const { authMiddleware } = require('../middleware/auth.middleware');

const settingsController = require('../controllers/settings.controller');

const router = express.Router();


router.put(
  "/",
  authMiddleware,
  settingsController.updateSettingsController
);


router.put(
  "/password",
  authMiddleware,
  settingsController.changePasswordController
);


router.delete(
  "/delete",
  authMiddleware,
  settingsController.deleteAccountController
);


module.exports = router;