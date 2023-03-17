const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");




//---------------------------------validation-----------------------

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length == 0) return false;
  return true;
};

const isvalidRequestBody = function (requestbody) {
  return Object.keys(requestbody).length > 0;
}

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}



//============================================================ create user controller ==========================================================================//



const register = async function (req, res) {

  try {

    let data = req.body;

    if (!isvalidRequestBody(data)) {
           return res.status(400).send({ status: false, message: "data not found" });

    } else {

      const { name, email, password} = data;

      //-----------------------------------------------validation start from here------------------------------------------------//


    //----------validation for profileImage---------------

    // if (!(req.files && req.files.length)) {
    //   return res.status(400).send({ status: false, message: "Image file is missing." });
    // }

 

      //----------validation for name  & unique name---------------

      if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "name is required" });
      }
      let uniquename = await userModel.findOne({ name });
      if (uniquename){
            return res.status(400).send({ status: false, message: "first name already exist" });
      }



      //------------validation for email & unique email---------------

      if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
      }

      let uniqueEmail = await userModel.findOne({ email });
      if (uniqueEmail){
            return res.status(400).send({ status: false, message: "email already exist" });
      }

      if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "Please enter a valid email" });
      }
//-----------------validation for password-----------------------------

if (!isValid(password)) {
    return res.status(400).send({ status: false, message: "password is required" });
}
if (password.length < 8 || password.length > 15) {
    return res.status(400).send({ status: false, message: "password must be 8-15 characters" });
}


    }
    //-------------------------for encrypted password--------------------------------
    let password = req.body.password
    const saltRounds = 10
    data["password"] = await bcrypt.hash(password, saltRounds);

    let createUser = await userModel.create(data)
          return res.status(201).send({ status: true, message: "User created successfully", data: createUser })

  } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
  }

};



//================================================ login user controller ====================================================================//



const userlogin = async function (req, res) {

  try {

    const email = req.body.email;
    const password = req.body.password;


    if (!email) {
        return res.status(400).send({ status: false, message: "email is required" })
    }

    if (!password) {
        return res.status(400).send({ status: false, message: "password is required" })
    }

    const validEmail = validator.isEmail(email)
    if (!validEmail) {
        return res.status(400).send({ status: false, message: "email is not valid" })
    }

    const checkedUser = await userModel.findOne({ email });
    if (!checkedUser) {
        return res.status(404).send({ status: false, message: "no user with this emailId" });
    }

    let userId = checkedUser._id.toString()

    const match = await bcrypt.compare(password, checkedUser.password);
    if (!match) {
        return res.status(400).send({ status: false, message: "password wrong" });
    }

    const token = jwt.sign(
      { userId },
      "sainath",
      { expiresIn: '4d' });

    const result = { userId, token }
       return res.status(200).send({ status: true, message: "User login successfully", data: result });

  }
  catch (error) {
       return res.status(500).send({ status: false, message: error.message })
  }

};



//======================================================== get user controller ==============================================================//



const getUserdata = async function (req, res) {

  try {

    let userId = req.params.userId

    if (!isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "UserId is invalid" })

    let finddata = await userModel.findById(userId)
    if (!finddata) return res.status(404).send({ status: false, message: "No user found" })

        return res.status(200).send({ status: true, message: "User profile details", data: finddata })
  }

  catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
  }

}



//=================================================== update user controller ===================================================================//



const updatePassword = async function (req, res) {

  try {

    let userId = req.params.userId;

    //-------- Id validation---------

    if (!isValidObjectId(userId))
         return res.status(400).send({ status: false, message: "Not a valid user ID" });

    //---------Id verification-----------

    let userDetails = await userModel.findById(userId);
    if (!userDetails)
         return res.status(404).send({ status: false, message: "User not found." });

    let data = req.body;

    //------------validation of pasword-------
    if (password === "") return res.status(400).send({ status: false, message: "password can't be empty" })

    if (password) {
      if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, message: "Password length should be 8 to 15" });

      const saltRounds = 10
      var encryptedPassword = await bcrypt.hash(password, saltRounds);

    }


    
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
 password: encryptedPassword
        }
      },
      { new: true }
    );
    return res.status(200).send({ status: true, message: "User profile updated", data: updatedUser });

  } catch (err) {
       return res.status(500).send({ status: false, message: err.message });
  }
};




module.exports = { register, userlogin, getUserdata, updatePassword }
