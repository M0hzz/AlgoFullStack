const { db } = require("./firebaseConfig");

const getCollection = async (collectionName) => {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

module.exports = { getCollection };
