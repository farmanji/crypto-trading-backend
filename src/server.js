import { app } from "./app.js"; 
import 'dotenv/config';
import db from "./config/dbConfig.js";


const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    console.error(`Server error: ${err.message}`);
    server.close(() => {
      process.exit(1);
    });
  }
});
