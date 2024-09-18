import express from "express";
import db from './db/db.js'
import rentalcar from "./routes/rentalbook.routes.js"
import carroute from './routes/car.routes.js';
import bodyParser from "body-parser";
import cors from "cors"
import userroute from './routes/user.routes.js'
const app = express();

app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//       limit: "50mb",
//       extended: true,
//   })
// );
// for parsing multipart/form-data
// app.use(upload.array());
let webLocalURL="http://localhost:3000";
// let webDevURL="https://dolphin-app-8au4n.ondigitalocean.app";
const corsOptions = {
  origin: [webLocalURL],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.use('/rental',rentalcar)
app.use('/car',carroute)
app.use('/user',userroute)
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
