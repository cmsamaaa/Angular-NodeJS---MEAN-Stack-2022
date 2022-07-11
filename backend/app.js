require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const Post = require('./models/post');

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_COLLECTION = "cm";

const app = express();

mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@testcluster.rq9su.mongodb.net/${MONGODB_COLLECTION}?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
//   next();
// });

// whitelist angular frontend server for CORS
const whitelistUrls = ['http://localhost:4200']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelistUrls.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: "GET, POST, PATCH, DELETE, OPTIONS"
}
app.use(cors(corsOptions));

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });
})

app.get("/api/posts", (req, res, next) => {
  Post.find().then(documents => {
    // console.log(documents);

    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});

module.exports = app;
