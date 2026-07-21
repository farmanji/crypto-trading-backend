import mongoose from 'mongoose';

// Connecting to mongodb database
mongoose.connect(process.env.MONGO_URI);

//connnection state
const db = mongoose.connection;

//Check DB connection
db.on('connected', ()=>{
    console.log('DB Connection Successful!');
    
})
db.on('err', (err)=>{
    console.log('DB Connection failed!');
    
})

export default db;