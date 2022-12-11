const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");


const homeStartingContent = "The Weyland-Yutani Corporation applies science, technology and an unparralleled global network of resources to the pursuit of Building Better Worlds.";
const aboutContent = "As the largest company on the planet, we have taken it upon ourselves to constantly explore, expand and discover what lies beyond our own heavens. Every day, our biologists, military scientists, chemical engineers, geologists, mechanics and pilots work across our solar system to advance human interests and life. From Peter Weyland’s first commercially viable cybernetic android to the invention of the atmospheric processor, the Weyland-Yutani Corporation has continued to innovate and work towards the realization of a better world.";
const contactContent = "At this time, we are not accepting contact submissions.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", blogSchema);

// let posts = []; -> not needed anymore 

app.get("/", (req, res) => {
  Post.find((err, posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

const post = new Post({
  title: req.body.postTitle,
  content: req.body.postBody
});

post.save((err) => {
  if (!err) {
    res.redirect("/");
  } else {
    console.log("something went wrong while saving")
  };
});

  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  // posts.push(post);

  

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, (err, post) => {
if (err) {
  console.log("something went wrong while finding post")
} else {
  res.render("post", {title: post.title, content: post.content})
} 

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
