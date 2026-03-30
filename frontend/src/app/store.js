import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import accountReducer from "../features/account/accountSlice";
import transactionReducer from "../features/transaction/transactionSlice";

export const store = configureStore({

  reducer: {
    auth: authReducer,
    account: accountReducer,
    transaction: transactionReducer
  }

});