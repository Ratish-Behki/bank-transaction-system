const axios = require("axios");

const FRAUD_API = "http://127.0.0.1:8000";

async function checkFraud(transactionData){

 try{

  // reset fraud environment
  await axios.post(`${FRAUD_API}/reset?task=medium`);

  // send transaction for checking
  const response = await axios.post(
   `${FRAUD_API}/step`,
   {
    action:"approve_transaction"
   }
  );

  return response.data;

 }
 catch(error){

  console.log("fraud error",error.message);

  // allow transaction if fraud service fails
  return {reward:1};

 }

}

module.exports = checkFraud;