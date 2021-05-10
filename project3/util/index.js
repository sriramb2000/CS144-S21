const MongoClient = require('mongodb').MongoClient;
const commonmark = require('commonmark');

const MONGO_CONFIG = {
    DB_NAME: 'BlogServer',
    CONNECTION_URL: 'mongodb://localhost:27017',
    COLLECTIONS: {
        USERS: 'Users',
        POSTS: 'Posts',
    }
};

let client = null;
const options = { useUnifiedTopology: true, writeConcern: { j: true } };

const connectMongoClient = async() => {
    if (client == null) {
        client = new MongoClient(MONGO_CONFIG.CONNECTION_URL, options);
        await client.connect();
    }

    return client;
}

const getDbMongoClient = () => {
    return client.db(MONGO_CONFIG.DB_NAME);
}

const closeMongoClient = (client) => {
    if (client) {
        client.close();
        client = null;
    }
}

const renderPostMarkdown = (post) => {
    const reader = new commonmark.Parser({ smart: true });
    const writer = new commonmark.HtmlRenderer({ sourcepos: true });

    if (post.title) {
        post.titleHtml = writer.render(reader.parse(post.title));
    }
    if (post.body) {
        post.bodyHtml = writer.render(reader.parse(post.body));
    }

    const createdDateString = new Date(post.created).toDateString();
    const modifiedDateString = new Date(post.modified).toDateString();

    post.authorLine = `Posted by <i>${post.username}</i>`;
    post.dateLine = `Created on ${ createdDateString }. Last modified on ${ modifiedDateString }.`;

    return post;
}

module.exports = {
    MONGO_CONFIG,
    connectMongoClient,
    getDbMongoClient,
    closeMongoClient,
    renderPostMarkdown
};