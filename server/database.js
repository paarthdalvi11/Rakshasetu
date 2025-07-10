const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://maazmalik2004:abenzene1234@dspace.odk45.mongodb.net/'; // Change as needed
const dbName = 'rakshasetu';
const collectionName = 'users';

let client;
let db;
let users;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        users = db.collection(collectionName);
    }
}

// Create a new user
async function createUser(userData) {
    await connectDB();
    try {
        const result = await users.insertOne(userData);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, error };
    }
}

// Update user by userId (adds fields if they don't exist)
async function updateUser(userId, updates) {
    await connectDB();
    try {
        const result = await users.updateOne(
            { userId },
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return { success: false, message: 'User not found' };
        }
        return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, error };
    }
}

module.exports = {
    createUser,
    updateUser
};
