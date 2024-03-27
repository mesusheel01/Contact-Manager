const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());//middleware to accept json format
app.use(errorHandler);
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
})
