const express = require("express");
const router = express.Router();

const buses = require("../models/BusesModel.js");
const users = require("../models/UserModel.js");

router.get("/fetch_users_count", (req, res) => {
  try {
    users.find({}, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ users_count: docs.length });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/fetch_users", (req, res) => {
  try {
    users.find({}, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        res.json(docs);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete_user", async (req, res) => {
  try {
    const email = req.body.email;
    const response = await users.findOneAndDelete({ email });

    if (response) {
      res.json({ msg: `User deleted successfully` });
    } else {
      res.json({ msg: " " });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/fetch_buses_count", (req, res) => {
  try {
    buses.find({}, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ buses_count: docs.length });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/fetch_busses", (req, res) => {
  try {
    buses.find({}, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        res.json(docs);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete_bus", async (req, res) => {
  try {
    const name = req.body.busname;
    const response = await buses.findOneAndDelete({ name });

    if (response) {
      res.json({ msg: `Bus deleted successfully` });
    } else {
      res.json({ msg: " " });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.post("/edit_bus", async (req, res) => {
//   try {
//     const data = req.body.editBusDetails;
//     const response = await buses.findByIdAndUpdate(data._id, data, {
//       new: true,
//     });

//     if (response) {
//       res.json({ msg: "Bus Updated Sucessfully" });
//     } else {
//       res.json({ msg: " " });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// });

router.put("/edit_bus/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const data = req.body.editBusDetails;
    console.log(data);
    const response = await buses.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (response) {
      res.json({ msg: "Bus Updated Sucessfully" });
    } else {
      res.json({ msg: " " });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
