const express = require("express");
const router = express.Router();

const buses = require("../models/BusesModel.js");
// const redisClient = require("../Redis/redis");

router.post("/insert", async (req, res) => {
  console.log(req.body);
  const {
    name,
    source,
    destination,
    startdate,
    starttime,
    endtime,
    bustype,
    busclass,
    traveltime,
    no_of_tickets_available,
    rating,
    ticket_cost,
    via,
  } = req.body;

  const date1 = new Date();
  date1.setHours(starttime.split(":")[0], starttime.split(":")[1], 0, 0);

  const date2 = new Date();
  date2.setHours(endtime.split(":")[0], endtime.split(":")[1], 0, 0);

  const diff = Math.abs(date2 - date1); // difference in milliseconds

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60 / 60 - hours) * 60);

  try {
    await new buses({
      name,
      source: source.toLowerCase(),
      destination: destination.toLowerCase(),
      startdate,
      starttime,
      endtime,
      bustype,
      busclass,
      traveltime: `${hours}hr ${minutes}min`,
      no_of_tickets_available,
      rating,
      ticket_cost,
      via,
    }).save();
    res.json({ msg: "Bus inserted" });
  } catch (error) {
    res.json({ msg: "error" });
  }
});

router.post("/search", async (req, res) => {
  const { source, destination, date } = req.body;

  const redisKey = `${source.toLowerCase()}:${destination.toLowerCase()}:${date}`;

  // const c = await redisClient.get(redisKey);
  // if (c != null) {
  //   console.log("hit");
  //   return res.json({ msg: JSON.parse(c) });
  // } else {
  //   console.log("miss");
  // }
  const allbuses = await buses.find({
    $and: [
      {
        $and: [
          {
            $or: [
              { source: source.toLowerCase() },
              { via: { $regex: source.toLowerCase(), $options: "i" } },
            ],
          },
          {
            $or: [
              { destination: destination.toLowerCase() },
              { via: { $regex: destination.toLowerCase(), $options: "i" } },
            ],
          },
        ],
      },
      { startdate: date },
    ],
  });
  console.log(allbuses);
  if (allbuses.length == 0) {
    console.log("in else part");
    return res.json({ msg: "No buses found" });
  } else {
    // await redisClient.set(redisKey, JSON.stringify(allbuses));
    return res.json({ msg: allbuses });
  }
});

module.exports = router;
