const Exercise = require("../models/exercise");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.user_list = asyncHandler(async (req, res, next) => {

    const allUserList = await User.find().exec();

    res.json({
        allUserList
    });
});


exports.user_create_post = [ asyncHandler(async (req, res , next) => {

    const errors = validationResult(req);

    const user = new User({

        username : req.body.username
    });

    if (!errors.isEmpty()) {
  
        res.json({
            error: errors
        });
        return;

      } else {
        // Data from form is valid
        await user.save();
        res.json({
            username: user.username,
            _id: user._id
        });
      }



}),
];