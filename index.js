const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'))

//Db connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
  username : {
    type: String,
    unique: true
  },
}, {
  versionKey: false
})

const User = mongoose.model('User', userSchema);

const exerciseSchema = mongoose.Schema({

  username: String,
  description: String,
  duration: Number,
  date: Date,
  userId: String

}, {
  versionKey: false
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {

  const allUsers = await User.find().exec();

  res.json(allUsers);
});

app.post('/api/users', async(req,res) => {

  const username = req.body.username;

  const foundUser = await User.findOne({ username });

  if(foundUser) {
    res.json(foundUser);
  }

  const user = await User.create({

    username,

  });

  res.json(user);

});


app.post('/api/users/:_id/exercises', async (req ,res) => {

  let { description, duration, date}= req.body; 

  const userId = req.body[':_id'];

  const foundUser = await User.findById(userId);

  if(!foundUser){

    res.json({ message: "No user exists" });
  }

  if(!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  await Exercise.create({

    username: foundUser.username,
    description,
    duration,
    date,
    userId

  });

  res.send({
    username: foundUser.username, 
    description,
    duration,
    date: date.toDateString(),
    _id: userId
  });


});

app.get('/api/users/:_id/logs', async(req, res) => {

  let {from, to, limit} = req.query;
  const userId = req.params._id;
  const foundUser = await User.findById(userId);

  if(!foundUser) {
    res.json({ message: 'No user exists' });
  }

  let filter = { userId };
  let dateFilter = {};

  if(from) {

    dateFilter['$gte'] = new Date(from);
  }
  if(to) {
    dateFilter['$lte'] = new Date(to);
  }
  if(from || to) {
    filter.date = dateFilter;
  }

  if(!limit) {
    limit = 100;
  }

  let exercises = await Exercise.find(filter).limit(limit);
  
  exercises.map((exercise) => {
    
    return {
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }
  });
  
  res.json({
    username: foundUser.username,
    count: exercises.length,
    _id: userId,
    log: exercises

  })

});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = app;