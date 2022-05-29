require('dotenv').config({path : './config.env'})
import express from 'express';
  
const app = express();
  
app.get('/',(req,res) => {
    res.send('Hello word');
})
  
const PORT = process.env.PORT || 5000;
  
app.listen(PORT,() => {
    console.log(`Running on PORT ${PORT}`);
})