const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { check } = require('express-validator');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'))

//Db connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
  "username" : String,
}, {
  "versionKey": false,
});

const User = mongoose.model('User', userSchema);

const exerciseSchema = mongoose.Schema({

  "username": String,
  "description": String,
  "duration": Number,
  "date": Date,

});

const Exercise = mongoose.model('Exercise', exerciseSchema);

const logSchema = mongoose.Schema({

  "username" : String,
  "count" : Number,
  "log" : Array,
});

const Log = mongoose.model('Log', logSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {

  const allUsers = await User.find().exec();

  res.json(allUsers);
});

app.post('/api/users', async(req,res) => {

  User.find({ "username": req.body.username }).then((userData) => {

    if(userData.length === 0) {
      const test = new User({
        "_id": req.body.id,
        "username": req.body.username,
      })

      test.save().then((data) =>{ 

        res.json({
          "_id": data.id,
          "username": data.username
        })

      }).catch((err) => {
        console.log(err);
      })

    } else {
      res.json({
        "message": "Username already exists",
      })
    }

  }).catch((err) => {
    console.log(err);
  })

});

app.post('/api/users/:_id/exercises', async(req, res) => {

  let userId = {"id": req.params._id};
  let checkedDate = new Date(req.body.date);
  let idToCheck = userId.id;

  let noDateHandler = () => {
    if(checkedDate instanceof Date && !isNaN(this.checkedDate)) {
      return checkedDate;
    } else {
      checkedDate = new Date();
    }
  }


  User.findById(idToCheck).then((data) => {
    noDateHandler(checkedDate);

    const test = new Exercise({
      "username": data.username,
      "description": req.body.description,
      "duration": req.body.duration,
      "date": checkedDate.toDateString(),
    });

    test.save().then((data) => {

      res.json({
        "username": data.username,
        "description": data.description,
        "duration": data.duration,
        "_id": userId,
      })

    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })


});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = app;