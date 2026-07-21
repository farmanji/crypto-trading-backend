import { app } from "./app.js"; 
import 'dotenv/config';
import db from "./config/dbConfig.js";


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
});
