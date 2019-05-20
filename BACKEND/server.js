const express = require('express');
const app = express();
const handoffRoutes = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

let Handoff = require('./handoff.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/handoffs', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB database connection established successfully");
})

handoffRoutes.route('/').get(function(req, res) {
  Handoff.find(function(err, handoffs) {
    if (err) {
      console.log(err);
    } else {
      res.json(handoffs);
    }
  });
});

handoffRoutes.route('/:id').get(function(req, res) {
  Handoff.findById(req.params.id, function(err, handoff) {
    res.json(handoff);
  });
});

handoffRoutes.route('/add').post(function(req, res) {
  let handoff = new Handoff(req.body);
  handoff.save()
    .then(handoff => {
      res.json('Handoff created!');
      res.status(200);
    })
    .catch(err => {
      res.json('Error: Unable to create new handoff');
      res.status(400);
    });
});

handoffRoutes.route('/update/:id').post(function(req, res) {
  Handoff.findById(req.params.id, function(err, handoff) {
    if (!handoff) {
      res.status(404).send("data is not found");
    } else {
      handoff.description = req.body.description;
      handoff.responsible = req.body.responsible;
      handoff.priority = req.body.priority;
      handoff.completed = req.body.completed;

      handoff.save()
        .then(handoff => {
          res.json('Handoff updated!');
        })
        .catch(err => {
          res.json('Error: Unable to update handoff');
          res.status(400);
        });
    }
  });
});

handoffRoutes.route('/delete/:id').get(function(req, res) {
  Handoff.findByIdAndRemove(req.params.id, function(err, handoff) {
    if (err) {
      res.json('Error: Unable to delete handoff');
      res.status(400);
    } else {
      res.json('Handoff deleted');
    }
  });
});

app.use('/handoffs', handoffRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});