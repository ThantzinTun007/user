const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require('./routes/user.route');

dotenv.config({ path: "./.env" });
let app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api/users', router);

const port = process.env.PORT || 8000;

mongoose.connect(process.env.DB_URL).then((conn) => {
  console.log(`Db is connected with ${conn.connection.host}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
