const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const buses = require("../models/BusesModel.js");
const redisClient = require("../Redis/redis");

router.post("/orders", async (req, res) => {
  const { source, destination, date, amount } = req.body;
  console.log(req.body);
  try {
    // redisKey = "vizag:chennai:2023-03-20";
    console.log(source, destination, date);
    redisKey = source + ":" + destination + ":" + date;
    // const c = await redisClient.del(redisKey);
    // console.log("Redis Deletion", c);

    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/confirm", async (req, res) => {
  const { selectedSeats, busid } = req.body;

  console.log(selectedSeats);

  const bus = await buses.findById(busid);
  let bookedseats = bus.booked_seats;

  for (let i = 0; i < selectedSeats.length; i++) {
    bookedseats.push(selectedSeats[i]);
  }

  try {
    await buses.updateOne({ busid }, { $set: { booked_seats: bookedseats } });

    res.json({ msg: "Marked SuccessFully" });
  } catch (error) {
    res.json({ msg: "Not marked" });
  }

  //   const reply = await buses.updateOne(
  //     { _id: busid },
  //     { $push: { tags: { $each: [...selectedSeats] } } }
  //   );
});

module.exports = router;
