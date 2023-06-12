const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({

    username: {type: Schema.Types.String, ref:"User", required: true},
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date},
    _id: {type: Schema.Types.ObjectId, ref:"User"}
    
});


module.exports = mongoose.model("Exercise", ExerciseSchema);