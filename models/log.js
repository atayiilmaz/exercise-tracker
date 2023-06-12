const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogSchema = new Schema({

    username: { type: Schema.Types.String, ref:"User", required: true},
    count: { type: Number},
    _id: { type: Schema.Types.ObjectId, ref:"User", required: true},
    log: [{ type: Schema.Types.String, ref:"Exercise",
            type: Schema.Types.Number, ref:"Exercise",
            tpye: Schema.Types.Date, ref:"Exercise"
            }]
});


module.exports = mongoose.model("Log", LogSchema);