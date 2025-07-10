const { createUser, updateUser } = require('./database');

// // Create a user
// createUser({
//     userId: 'u123',
//     userName: 'Alice',
//     location: 'Bangalore',
//     trustScore: 90,
//     locationAccessTo: ['u456'],
//     aadharVerified: true
// }).then(console.log);

// Update the user
updateUser('u123', {
    trustScore: 95,
    newField: 'experimental value'
}).then(console.log);
