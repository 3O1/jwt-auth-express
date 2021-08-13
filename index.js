const express = require("express");
const auth = require("./routes/auth");

const app = express();

app.use(express.json());

app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("hello-world");
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});
