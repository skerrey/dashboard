/* eslint-disable max-len */
// Description: This file is used to deploy firebase functions

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const cors = require("cors")();

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get all users
exports.getUsers = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // List batch of users, 1000 at a time.
    // eslint-disable-next-line require-jsdoc
    const listUsers = (nextPageToken) => {
      admin.auth().listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
          const users = listUsersResult.users.map((user) => Object.assign({}, user.toJSON()));
          if (listUsersResult.pageToken) {
            // List next batch of users.
            listUsers(listUsersResult.pageToken);
          } else {
            res.setHeader("Content-Type", "application/json");
            res.send({
              "status": "success",
              "message": "Users fetched successfully",
              "data": users,
            });
          }
        })
        .catch((error) => {
          console.log("Error fetching users: ", error);
          res.status(500).send("Error fetching users");
        });
      };
      listUsers();
  });
});
