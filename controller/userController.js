const Users = require("../modals/UserModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userController = {
  register: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = await Users.findOne({
        email,
      });
      if (user)
        return res.status(400).json({
          msg: "email already registered",
        });
      if (password.length < 6)
        return res.status(400).json({
          msg: "password length less than 6",
        });

      //   password encryption

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({
        username,
        email,
        password: hashPassword,
      });
      // save to mongo
      await newUser.save();

      // create json web token
      const accessToken = createAccessToken({
        id: newUser._id,
      });

      const refreshToken = createRefreshToken({
        id: newUser._id,
      });

      res.cookie("refreshtoken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      // registration success
      res.status(200).json({
        msg: "registration successful",
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  refreshtoken: async (req, res) => {
    try {
      
     
      const rft = req.cookies.refreshtoken; 
      console.log("rft", rft);
      if (!rft)
        return res.status(400).json({
          msg: "rft not found",
        });

      jwt.verify(rft, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          console.log(user);
          console.log(err);
          return res.status(400).json({
            msg: "rft dont match ",
          });
        }
        console.log(user);
        const accesstoken = createAccessToken({
          id: user.id,
        });

        res.json({
          accesstoken,
        });
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json("user not there ");

      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.status(400).json("password in wrong ");
      }

      // create accesstoken

      const accessToken = createAccessToken({
        id: user._id,
      });
      const refreshToken = createRefreshToken({
        id: user._id,
      });

      res.cookie("refreshtoken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json(accessToken);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      console.log("hello");
      await res.clearCookie("refreshtoken");
    
      return res.status(200).json({ msg: "Logged out" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  getLeaderBoard: async (req, res) => {
    try {
      const data = await Users.find().select("-password");
      if (!data) return res.status(400).json("User not found");
      data.sort((d1, d2) => {
        if (d1.time > d2.time) return 1;
        return -1;
      });

      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  updateUserPuzzleTime: async (req, res) => {
    const { puzzleName, newTime } = req.body;
    const user = req.user;
    user[puzzleName] = newTime;
    const data = await Users.findByIdAndUpdate({ _id: user.id }, user, {
      new: true,
    });

    res.status(200).json(data);
  },
  updateUserTime: async (req, res) => {
    const { newTime } = req.body;
    const user = req.user;
    const data = await Users.findByIdAndUpdate(
      { _id: user.id },
      { ...user, time: newTime },
      {
        new: true,
      }
    );

    res.status(200).json(data);
  },
  getAverageTime: async (req, res) => {
    Users.aggregate([
      {
        $group: {
          _id: null,
          mirrorPuzzle: {
            $avg: { $convert: { input: "$mirrorPuzzle", to: "double" } },
          },
          flexboxPuzzle: {
            $avg: { $convert: { input: "$flexboxPuzzle", to: "double" } },
          },
          mathPuzzle: {
            $avg: { $convert: { input: "$mathPuzzle", to: "double" } },
          },
          puzzlerModalPuzzle: {
            $avg: { $convert: { input: "$puzzlerModalPuzzle", to: "double" } },
          },
          recurrsionPuzzle: {
            $avg: { $convert: { input: "$recurrsionPuzzle", to: "double" } },
          },
        },
      },
    ])
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json("User not found");

      res.json(user);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "11m",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};
module.exports = userController;
