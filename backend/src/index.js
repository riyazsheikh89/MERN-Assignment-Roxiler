const express = require("express");
const path = require('path');
const cors = require("cors");

const { PORT } = require('./config/env-variables');
const connectDB = require("./config/db-config");
const v1Routes = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1", v1Routes);

                        // DEPLOYMENT
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname1, "./src/dist")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "dist", "index.html"));
  });
} 
else {
  // this is to just showcase the user that backend running successfully,
  // but, this is not inside PRODUCTION MODE
  app.use("/*", (req, res) => {
    res.send(`Backend is running successfuly on PORT: ${PORT}. Warning! This is a not inside PRODUCTION MODE`);
  });
}
                        // DEPLOYMENT


app.listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT}`);
    await connectDB();
})