const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const query = `
        SELECT POSTS.*, AUTHORS.NAME AS AUTHOR_NAME FROM POSTS 
        INNER JOIN AUTHORS ON POSTS.AUTHOR_ID = AUTHORS.ID
    `;
  const [posts] = await db.query(query);
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM AUTHORS");
  res.render("create-post", { authors: authors });
});

router.get("/posts/:id", async function (req, res) {
  const query = `SELECT POSTS.*, AUTHORS.NAME AS AUTHOR_NAME, 
    AUTHORS.EMAIL AS AUTHOR_EMAIL FROM POSTS INNER JOIN AUTHORS ON POSTS.AUTHOR_ID = AUTHORS.ID
    WHERE POSTS.ID = ?
    `;
  const [post] = await db.query(query, [req.params.id]);

  if (!post || post.length === 0) {
    return res.status(404).render("404");
  }

  res.render("post-detail", { post: post[0] });
});

router.get("/posts/:id/edit", async function (req, res) {
  const query = "SELECT * FROM POSTS WHERE ID = ?";
  const [post] = await db.query(query, [req.params.id]);

  if (!post || post.length === 0) {
    return res.status(404).render("404");
  }

  res.render("update-post", { post: post[0] });
});


router.post("/posts", async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "INSERT INTO blogDB.posts (title, summary, body, author_id) VALUES (?)",
    [data]
  );
  res.redirect("/posts");
});

router.post("/posts/:id/edit", async function (req, res) {
    const query = `
          UPDATE POSTS SET TITLE = ?, SUMMARY = ?, BODY = ?
          WHERE ID = ? 
      `;
  
    await db.query(query, [
      req.body.title,
      req.body.summary,
      req.body.content,
      req.params.id,
    ]);
    res.redirect('/posts');
  });

  router.post("/posts/:id/delete", function(req,res){
    const query = `
        DELETE FROM POSTS WHERE ID = ?
    `;
    db.query(query, [req.params.id]);
    res.redirect("/posts");
  });
  

module.exports = router;
