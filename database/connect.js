const mongoose = require("mongoose");
const old =
  "mongodb+srv://SeetaRam217:mernstack@mern-project.cjeobsp.mongodb.net/?retryWrites=true&w=majority";
const connection =
  "mongodb+srv://saicharanyadavp20:2B8NIS5SI1YffM38@bookitcluster.dmsqigw.mongodb.net/?retryWrites=true&w=majority";
const connect = async () => {
  await mongoose
    .connect(connection)
    .then(() => console.log("MongoDB connection is SuccessFul"))
    .catch((err) => console.log(err));
};

module.exports = connect;
