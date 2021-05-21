const { getDbMongoClient: db, MONGO_CONFIG } = require('../util');

const pageSize = 5;

// Gets a post belonging to user with postid=postid
const find = async(user, postid) => {
    // If postid is not valid, return null
    if (!user) {
        return null;
    }

    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.POSTS);
    const post = await collection.findOne({ username: user.username, postid: postid });

    return post;
}

// Gets next 5 posts of user starting from start
const findUserPosts = async(user, start) => {
    if (!user) {
        return
    }

    if (!start) {
        start = 1;
    }
    const endPostId = start + pageSize;
    const hasMore = user.maxid >= endPostId;

    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.POSTS);
    const posts = await collection.find({ username: user.username, postid: { $gte: start, $lt: endPostId } }).toArray();

    return { posts, hasMore, newStart: endPostId };
}

// Gets all of a user's posts
const findAllUserPosts = async(user) => {
    if (!user) {
        return [];
    }

    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.POSTS);
    const posts = await collection.find({ username: user.username }).toArray();

    return posts;
}

// Create a new post
const create = async(user, postid, title, body) => {
    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.POSTS);
    let currentTimeMs = new Date().getTime();

    await collection.insertOne({
        username: user.username,
        postid,
        title,
        body,
        created: currentTimeMs,
        modified: currentTimeMs
    });

    return {
        postid,
        title,
        body,
        created: currentTimeMs,
        modified: currentTimeMs
    };
}

// Updates an existing post
const update = async(post, title, body) => {
    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.POSTS);
    let currentTimeMs = new Date().getTime();

    const filter = { postid: post.postid, username: post.username };
    const updateDoc = {
        $set: {
            title,
            body,
            modified: currentTimeMs
        }
    }

    await collection.updateOne(filter, updateDoc);

    return {
        modified: currentTimeMs
    };
}

// Removes an existing post
const remove = async(post) => {
    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.POSTS);

    const query = { postid: post.postid, username: post.username };

    await collection.deleteOne(query);
}

module.exports = {
    find,
    findUserPosts,
    findAllUserPosts,
    create,
    update,
    remove
}