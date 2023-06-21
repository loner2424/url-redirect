const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const base62 = require("base62")
require("dotenv").config()

const app = express();
const PORT = 3001;

connectToMongoDB(process.env.MONGO_URI).then(() =>
  console.log("Mongodb connected")
);
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });
app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
    
  );
  const newurl = entry.redirectURL.toString()
  if(newurl!=null) {
    res.redirect("https://"+ newurl);
  }
  
  
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
