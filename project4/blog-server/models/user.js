const { getDbMongoClient: db, MONGO_CONFIG } = require('../util');
const bcrypt = require('bcryptjs');

const find = async(username, password = null) => {
    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.USERS);
    const user = await collection.findOne({ username: username });

    if (user && password) {
        return (bcrypt.compareSync(password, user.password)) ? user : null;
    }

    return user;
}

const update = async(user, maxid) => {
    const collection = db().collection(MONGO_CONFIG.COLLECTIONS.USERS);
    const filter = { username: user.username };
    const updateDoc = {
        $set: {
            maxid
        }
    }

    await collection.updateOne(filter, updateDoc);

    return;
}

module.exports = {
    find,
    update
}