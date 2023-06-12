const User = require("../models/user");
const Exercise = require("../models/exercise");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");