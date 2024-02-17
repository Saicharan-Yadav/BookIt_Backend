const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const connect = require("./database/connect.js");
const LogSign = require("./routes/LogSignRoutes.js");
const Buses = require("./routes/BusesRoutes.js");
const AdminCRUD = require("./routes/AdminCRUD.js");
const paymentRoutes = require("./routes/payment.js");

const PORT = 4000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  interval: "1h",
});
app.use(morgan(":method :url :response-time ms", { stream: accessLogStream }));

connect();

let swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
  },
};

swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/user", LogSign);
app.use("/buses", Buses);
app.use("/admin", AdminCRUD);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log("Server is running at http://localhost:4000");
});

module.exports = app;
