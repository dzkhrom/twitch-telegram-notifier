require("dotenv").config();
const axios = require("axios");
console.log("START");
async function main() {
    try {
      console.log("START");
  
      const tokenResponse = await axios.post(...);
  
      console.log("TOKEN OK");
  
      const result = await axios.get(...);
  
      console.log("GET SUBSCRIPTIONS OK");
  
      console.log(JSON.stringify(result.data, null, 2));
  
    } catch (error) {
      console.log("ERROR");
      console.log(error.response?.data || error.message);
    }
  }