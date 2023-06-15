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

},{
  "versionKey": false,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

const logSchema = mongoose.Schema({

  "username" : String,
  "count" : Number,
  "log" : Array,
}, {
  "versionKey": false,
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
        "date": data.date.toDateString(),
        "_id": idToCheck,
      })

    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })

});

app.get('/api/users/:_id/logs', async(req, res) => {

  let {from, to, limit} = req.query;
  let userId = {"id": req.params._id};
  let idToCheck = userId.id;

  //checkId
  User.findById(idToCheck).then((data)=> {

    var query = {
      username: data.username
    }

    if(from !== undefined && to === undefined) {
      query.date = { $gte: new Date(from) }
    } else if(to !== undefined && from === undefined) {
      query.date = { $lte: new Date(to) }
    } else if(from !== undefined && to !== undefined) {
      query.date = { $gte: new Date(from), $lte: new Date(to) }
    }

    let limitChecker = (limit) => {
      let maxLimit = 100;
      if(limit) {
        return limit;
      } else {
        return maxLimit;
      }
    }

    Exercise.find((query)).limit(limitChecker(+limit)).then((docs) => {

      let documents = docs;
      let loggedArray = documents.map((item) => {
        return {
          "description": item.description,
          "duration": item.duration,
          "date": item.date.toDateString()
        }
      })

      const test = new Log({
        "username": data.username,
        "count": loggedArray.length,
        "log": loggedArray
      });

      test.save().then((data) => {

        res.json({
          "_id": idToCheck,
          "username": data.username,
          "count": data.count,
          "log": loggedArray
        })

      }).catch((err) => {
        console.log(err);
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