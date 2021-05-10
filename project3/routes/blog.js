const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const { renderPostMarkdown } = require('../util');

const handleGetUserPosts = async(req, res, next) => {
    const { username } = req.params;
    const { start } = req.query;

    if (!username) {
        return res.status(404).send();
    }

    try {
        const userPostsResponse = await User.find(username)
            .then((user) => Post.findUserPosts(user, parseInt(start)));

        if (!userPostsResponse) {
            throw new Error("User posts not found.");
        }

        const { posts, hasMore, newStart } = userPostsResponse;
        return res.status(200).render('blogList', { posts: posts.map(p => renderPostMarkdown(p)), hasMore, newStart });
    } catch (e) {
        console.log(e);
        return next();
    }
}

const handleGetPost = async(req, res, next) => {

    const { username, postid } = req.params;

    if (!username) {
        return res.status(404).send();
    }

    try {
        const post = await User.find(username)
            .then((user) => Post.find(user, parseInt(postid)));
        if (!post) {
            throw new Error("User/Post not found");
        }

        return res.status(200).render('blog', { post: renderPostMarkdown(post) });
    } catch (e) {
        console.log(e);
        return next();
    }
}

const router = express.Router();

router.get('/:username', handleGetUserPosts);
router.get('/:username/:postid', handleGetPost);

module.exports = router;