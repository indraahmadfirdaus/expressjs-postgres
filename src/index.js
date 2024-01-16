import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import { getClient } from './db/index.js'
import router from "./routes/index.js";
import errorHandler from "./middlewares/errHandler.js";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
if(process.env.ENVIRONMENT?.toUpperCase() !== 'PRODUCTION') {
  dotenv.config()
  console.log('loaded .env file');
} else {
  console.log('loaded os env');
}

const app = express();
const port = process.env.PORT || 3333;

await getClient()

app.use(express.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.use('/api/v1', router)
app.use(errorHandler)
app.listen(port, () => {
  console.log(`Higo analytic service listening at http://localhost:${port}`);
});
