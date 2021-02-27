const Admin = require('../../models/admin');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
// const admin = require('../../models/admin');

exports.signup = (req, res) => {
  Admin.findOne({ email: req.body.email }).exec((error, admin) => {
    if(admin)
      return res.status(400).json({
        message: "Admin already registered",
      });

    Admin.estimatedDocumentCount(async (err, count) => {
      if (err) return res.status(400).json({ error });
      let role = "admin";
      if (count === 0) {
        role = "super-admin";
      }

      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _admin = new Admin({
        firstName,
        lastName,
        email,
        hash_password,
      });

      _admin.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }

        if(data) {
          return res.status(201).json({
            message: "Admin created Successfully..!",
          });
        }
      });
    });
  });
};

exports.signin = (req, res) => {
  Admin.findOne({ email: req.body.email }).exec(async (error, admin) => {
    if (error) return res.status(400).json({ error });
    if (admin) {
      const isPassword = await admin.authenticate(req.body.password);
      if (
        isPassword &&
        (admin.role === "admin" || admin.role === "super-admin")
      ) {
        const token = jwt.sign(
          { _id: admin._id, role: admin.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        const { _id, firstName, lastName, email, role, fullName } = admin;
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token,
          admin: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};