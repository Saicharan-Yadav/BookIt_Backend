const express = require("express");
const JWT = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const router = express.Router();

const users = require("../models/UserModel.js");
const validateUser = require("../validation/SignUpValidation.js");
const AuthorizeUser = require("../auth/Authorize.js");

let finalOTP = "";
let passwordchangeOTP = "";

router.post("/sendOTP", async (req, res) => {
  const { firstname, lastname, email } = req.body;

  const msg = validateUser(req.body);
  if (msg !== undefined) {
    return res.json(msg);
  }

  const user = await users.findOne({ email }).lean();
  if (user) return res.json({ msg: "User exists with this email" });

  let OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "bookitofficialmail@gmail.com",
      pass: "dwcazjzmubagpbtp",
    },
  });

  let mailOptions = {
    from: ' "Verify your email" <bookitofficialmail@gmail.com>',
    to: email,
    subject: "Your OTP",
    html: `Dear ${firstname + " " + lastname},<br></br><br></br>
             <b>Your one time password is</b> - <h1>${OTP}</h1>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      finalOTP = OTP;
      res.json({ msg: "OTP sent to your email" });
    }
  });
});

router.post("/sendOTPforpasswordchange", async (req, res) => {
  const { email } = req.body;

  const user = await users.findOne({ email }).lean();
  try {
    if (user) {
      let OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: "bookitofficialmail@gmail.com",
          pass: "dwcazjzmubagpbtp",
        },
      });

      let mailOptions = {
        from: ' "Verify your email" <bookitofficialmail@gmail.com>',
        to: email,
        subject: "Your OTP",
        html: `Dear ${user.firstname + " " + user.lastname},<br></br><br></br>
                   <b>Your one time password is</b> - <h1>${OTP}</h1>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ msg: "error" });
        } else {
          passwordchangeOTP = OTP;
          res.json({ msg: "OTP sent to your email" });
        }
      });
    } else res.json({ msg: "No user present with this email" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "error" });
  }
});

router.post("/verifyOTPforpasswordchange", (req, res) => {
  const { OTP } = req.body;

  if (OTP === passwordchangeOTP) {
    res.json({ msg: "OTP verification SuccessFul" });
  } else res.json({ msg: "Invalid OTP" });
});

router.post("/changepassword", async (req, res) => {
  const { email, password, confirmpassword } = req.body;

  try {
    if (password === confirmpassword) {
      const encrypted = await bycrypt.hash(password, 10);
      await users.updateOne({ email }, { $set: { password: encrypted } });

      res.json({ msg: "Password Update SuccessFul" });
    } else {
      res.json({ msg: "password and confirmpassword are not matching" });
    }
  } catch (error) {
    res.json({ msg: "error" });
  }
});

router.post("/signup", async (req, res) => {
  if (finalOTP === req.body.OTP) {
    const {
      firstname,
      lastname,
      gender,
      phone,
      email,
      password,
      profileimage,
    } = req.body.final_user;

    try {
      const encrypted = await bycrypt.hash(password, 10);
      const user = {
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        phone: phone,
        email: email,
        password: encrypted,
        profileimage: profileimage,
      };

      await new users(user).save();
      return res.json({ msg: "Profile Creation SuccessFul" });
    } catch (error) {
      return res.json({ msg: error });
    }
  }

  res.json({ msg: "OTP is not valid" });
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email: email });

    if (user) {
      const present = await bycrypt.compare(password, user.password);
      // console.log(user.password);
      console.log(present);
      if (present) {
        if (email == "charan7115@gmail.com") {
          const admintoken = JWT.sign(
            {
              user: {
                userid: user._id,
              },
            },
            "jwtSecret"
          );
          return res.json({
            msg: "admin login sucessful",
            token: admintoken,
          });
        }
        const token = JWT.sign(
          {
            user: {
              userid: user._id,
            },
          },
          "jwtSecret"
        );
        return res.json({ msg: "Login SuccessFul", token: token });
      }
      //  else return res.json({ msg: "Password incorrect" });
      else return res.json({ msg: "No user present with these credentials" });
    }
  } catch (error) {
    res.json({ msg: "error" });
  }
});

router.get("/getuser", AuthorizeUser, async (req, res) => {
  try {
    const user = await users.findById(req.user.userid);
    if (user) res.json({ user: user });
    else res.json({ msg: "no user found" });
  } catch (error) {
    res.json({ msg: "error" });
  }
});

router.get("/getadmin", AuthorizeUser, async (req, res) => {
  try {
    const user = await users.findById(req.user.userid);
    if (user) {
      res.json({ user: user });
    } else res.json({ msg: "no admin found" });
  } catch (e) {
    console.log(e);
    res.json({ msg: error });
  }
});

router.post("/updateuser", (req, res) => {
  const { firstname, lastname, id, phone, gender } = req.body;
  users.findByIdAndUpdate(
    id,
    { firstname: firstname, lastname: lastname, phone: phone, gender: gender },
    (err) => {
      if (err) {
        res.json({ msg: "error" });
      } else {
        res.json({ msg: "Update SuccessFul" });
      }
    }
  );
});

router.post("/insertrecentsearches", async (req, res) => {
  const searches = [req.body.travelDetails, ...req.body.user.recentsearches];
  const email = req.body.user.email;

  try {
    await users.updateOne({ email }, { $set: { recentsearches: searches } });
  } catch (error) {
    console.log(error);
  }
});

const upload = path.join(__dirname, "..", "..", "Frontend", "public", "Images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageupload = multer({ storage: storage });

router.post(
  "/uploadprofilepicture",
  imageupload.single("file"),
  async (req, res) => {
    const filename = req.file.filename;
    const email = req.body.email;
    await users.updateOne(
      { email },
      { $set: { profileimage: `/Images/${filename}` } }
    );
  }
);

module.exports = router;
