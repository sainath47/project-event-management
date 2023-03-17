const mongoose = require("mongoose");

let validateEmail = function (email) {
    let emailRegex = /^\w+[\.-]?\w+@\w+[\.-]?\w+(\.\w{1,3})+$/;
    return emailRegex.test(email)
};


const userSchema = mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "name is required"],
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: [true, "email is required"],
            validation: [validateEmail, "please enter a valid email address"],
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "password is required"],
            minLen: 8,
            maxLen: 15,
            trim: true
        },

        attending:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
              },
        ]

    },

    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
