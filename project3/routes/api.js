const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');

// GET /api/posts?username=:username
// GET /api/posts?username=:username&postid=:postid
const handleGet = async(req, res, next) => {
    const { username, postid } = req.query;

    if (!username) {
        res.status(400).send();
    }

    try {
        const user = await User.find(username);

        let data = null;
        if (postid) {
            data = await Post.find(user, parseInt(postid));
            if (!data) {
                throw new Error("Post not found.");
            }
        } else {
            data = await Post.findAllUserPosts(user);
        }

        res.json(data).send();
    } catch (e) {
        console.log(e);
        next();
    }
}

// POST /api/posts
const handlePost = async(req, res, next) => {
    let { username, postid, title, body } = req.body;
    if (!title || !body) {
        return res.sendStatus(400);
    }
    postid = parseInt(postid);


    const user = await User.find(username);
    if (!user) {
        return res.sendStatus(404);
    }


    let data = null;
    if (postid > 0) {
        const post = await Post.find(user, postid);
        if (!post) {
            return res.sendStatus(404);
        }

        data = await Post.update(post, title, body);
        return res.json(data).status(200);
    } else {
        // Create post
        newPostId = user.maxid + 1
            // Update max post id for user
        await User.update(user, newPostId);
        data = await Post.create(user, newPostId, title, body);
        return res.status(201).json(data);
    }
}

// DELETE /api/posts?username=:username&postid=:postid
const handleDelete = async(req, res, next) => {
    let { username, postid } = req.query;
    postid = `${postid}`;
    if (!username || !postid) {
        return res.status(400).json({ message: "Bad request" }).send();
    }
    postid = parseInt(postid);

    try {
        const user = await User.find(username);
        const post = await Post.find(user, postid);

        if (!post) {
            throw new Error("User and/or Post does not exist.");
        }

        await Post.remove(post);

        res.status(204).json({ message: "Deleted post." }).send();
    } catch (e) {
        console.log(e);
        next();
    }
}

const router = express.Router();

router.get("/", handleGet);
router.post("/", handlePost);
router.delete("/", handleDelete);

module.exports = router;