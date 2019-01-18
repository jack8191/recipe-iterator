require('dotenv').config()
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan');
const passport = require('passport');


app.use(morgan('common'));
const jsonParser = bodyParser.json()
app.use(express.json());

mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Bucket, Iteration, User } = require('./models')
const { router: usersRouter } = require('./users/router');
const { router: authRouter } = require('./auth/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies.js')

app.use(express.static('public'));
app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});









app.post('/bucket', jsonParser, jwtAuth, (req, res) => {
  const requiredFields = ['title', 'description', 'user']
  for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  Bucket 
    .create({
        title: req.body.title,
        description: req.body.description,
        user: req.body.user
    })
    .then(bucket => res.status(201).json(bucket.serialize()))
      .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

})



//view all buckets for a given account GET

app.get('/bucket/:userId', jwtAuth, (req,res) => {
//console.log(1)
Bucket.find({user: req.params.userId})
  .then(bucket => {
    res.json(bucket.map(bucket => bucket.serialize()))
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'something went terribly wrong' });
  })
})


//update bucket PATCH
app.patch('/bucket/:id', jsonParser, jwtAuth, (req,res) => {
  const updated = {};
  const updateableFields = ['title', 'description'];
  updateableFields.forEach(field => {
  if (field in req.body) {
    updated[field] = req.body[field];
  }
})
Bucket
  .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(bucket => res.json(bucket.serialize()))
  .catch(err => res.status(500).json({ message: 'there was an error' }))

})

app.delete('/bucket/:id', jwtAuth, (req,res) => {
  Bucket
    .findByIdAndRemove(req.params.id)
  // Iteration
  //   .deleteMany({ iterationOf: req.params.id })
    .then(() => {
      res.status(204).json({ message: 'bucket deleted'})
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    })
})


//iteration endpoints
app.post('/iteration', jsonParser, jwtAuth, (req, res) => {
  const requiredFields = ['iterationOf', 'date', 'ingredients', 'procedure', 'notes']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Iteration 
  .create({
    iterationOf: req.body.iterationOf,
    date: req.body.date,
    ingredients: req.body.ingredients,
    procedure: req.body.procedure,
    notes: req.body.notes
  })
  .then(iteration => res.status(201).json(iteration.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });
  
})

app.get('/iteration/:iterationOf', jsonParser, jwtAuth, (req, res) => {
  Iteration.find({ iterationOf: req.params.iterationOf })
  .then(iteration => {
    res.json(iteration.map(iteration => iteration.serialize()))
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'something went terribly wrong' });
  })
})

app.patch('/iteration/:id', jsonParser, jwtAuth, (req, res) => {
  const updated = {};
  const updateableFields = ['date', 'ingredients', 'procedure', 'notes'];
  updateableFields.forEach(field => {
  if (field in req.body) {
    updated[field] = req.body[field];
  }
})
Iteration
  .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
  .then(updatedIteration => res.json(updatedIteration.serialize()))
  .catch(err => res.status(500).json({ message: 'there was an error' }))
})

app.delete('/iteration/:id', jsonParser, jwtAuth, (req, res) => {
  Iteration
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'iteration deleted'})
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    })
})

//this endpoint exists to test the authentication system
app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});


// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}
  
  module.exports = { app, runServer, closeServer };
