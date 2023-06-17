// Description: Deploy firebase functions and backend server

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const cors = require("cors")();

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get stripe key
const stripe = require("stripe")(functions.config().stripe.secret_key);

/**
 * Get all users
 */
exports.getUsers = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // List batch of users, 1000 at a time.
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

/**
 * Get all users
 */
exports.getAllUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // List batch of users, 1000 at a time.
    const listUsers = async (nextPageToken) => {
      try {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
        const users = listUsersResult.users.map((user) => user.toJSON());

        // Initialize Firestore database
        const db = admin.firestore();

        // Use Promise.all to fetch all Firestore documents in parallel
        const firestoreDataPromises = users.map((user) =>
          db.collection("users").doc(user.uid).get(),
        );

        // Get Firestore documents
        const firestoreDocs = await Promise.all(firestoreDataPromises);

        // Merge auth and Firestore data
        const mergedData = users.map((user, index) => {
          // Get Firestore data for this user
          const firestoreData = firestoreDocs[index].data();

          // Merge data
          return {...user, ...firestoreData};
        });

        if (listUsersResult.pageToken) {
          // List next batch of users.
          listUsers(listUsersResult.pageToken);
        } else {
          res.setHeader("Content-Type", "application/json");
          res.send({
            "status": "success",
            "message": "Users fetched successfully",
            "data": mergedData,
          });
        }
      } catch (error) {
        console.log("Error fetching users: ", error);
        res.status(500).send("Error fetching users");
      }
    };
    listUsers();
  });
});

/**
 * Delete all users
 */
exports.deleteAllUsers = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const deleteUsersRecursively = (nextPageToken) => {
      admin.auth().listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
          listUsersResult.users.forEach((userRecord) => {
            admin.auth().deleteUser(userRecord.uid)
              .then(() => {
                console.log("Successfully deleted user", userRecord.uid);
              })
              .catch((error) => {
                console.error("Error deleting user", userRecord.uid, error);
              });
          });

          if (listUsersResult.pageToken) {
            deleteUsersRecursively(listUsersResult.pageToken);
          } else {
            res.setHeader("Content-Type", "application/json");
            res.send({
              "status": "success",
              "message": "All users deleted successfully",
              "data": null,
            });
          }
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
          res.status(500).send("Error deleting users");
        });
    };

    deleteUsersRecursively();
  });
});

/**
 * Payment Intent WITH ID for creating a payment using Stripe
 */
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const {amount, customerId, payment_method} = req.body;

    if (!amount || !customerId || !payment_method) {
      res.status(400).send("Bad Request: Missing fields");
      return;
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        customer: customerId,
        payment_method: payment_method,
      });

      // Saves transaction to db on frontend

      res.json({clientSecret: paymentIntent.client_secret});
    } catch (error) {
      console.error("Error creating PaymentIntent", error);
      res.status(500).json({error: "An error occurred attempting to create PaymentIntent"});
    }
  });
});

/**
 * Payment Intent WITHOUT STRIPE ID for creating a payment using Stripe
 */
exports.createPaymentIntentWithoutId = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const {amount, userId} = req.body;

    if (!amount || !userId) {
      res.status(400).send("Bad Request: Missing fields");
      return;
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
      });

      // Saves transaction to db on frontend

      res.json({clientSecret: paymentIntent.client_secret});
    } catch (error) {
      console.error("Error creating PaymentIntent", error);
      res.status(500).json({error: "An error occurred attempting to create PaymentIntentWithoutId"});
    }
  });
});

/**
 * Create Setup Intent for setting up a payment method in Stripe
 */
exports.createSetupIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const setupIntent = await stripe.setupIntents.create();
      res.status(200).send({clientSecret: setupIntent.client_secret});
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  });
});

/**
 * Get Payment method via ID
 */
exports.getPaymentMethod = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const paymentMethodId = req.body.paymentMethodId;

    if (!paymentMethodId) {
      res.status(400).send({error: "Bad Request: Missing PaymentMethod ID"});
      return;
    }

    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      res.status(200).send({paymentMethod});
    } catch (error) {
      console.error("Error retrieving PaymentMethod:", error);
      res.status(500).send({error: "An error occurred while retrieving a PaymentMethod"});
    }
  });
});

/**
 * Create Stripe customer in Stripe
 */
exports.createStripeCustomer = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const user = req.body.user;

    if (!user) {
      res.status(400).send({error: "Bad Request: Missing fields"});
      return;
    }

    try {
      const customer = await stripe.customers.create({
        id: user.uid,
        name: user.displayName,
        email: user.email,
      });

      // Save the customer ID to the Firestore database
      const db = admin.firestore();
      await db.collection("users").doc(user.uid).set({
        stripeCustomerId: customer.id,
      }, {merge: true});

      res.status(200).send({success: true});
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      res.status(500).send({error: "An error occurred while creating a Stripe customer"});
    }
  });
});

/**
 * Set up a PaymentMethod via Stripe
 */
exports.setupPaymentMethod = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const {paymentMethodId, customerId} = req.body;

    if (!paymentMethodId || !customerId) {
      res.status(400).send({error: "Bad Request: Missing fields"});
      return;
    }

    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        {customer: customerId},
      );

      // Card details
      const cardData = {
        _id: paymentMethod.id,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
      };

      // // Save the payment method to db
      const db = admin.firestore();
      await db.collection("users").doc(customerId).set({
        payments: {
          cards: admin.firestore.FieldValue.arrayUnion(cardData),
        },
      }, {merge: true});

      res.status(200).send({success: true});
    } catch (error) {
      console.error("Error setting up PaymentMethod:", error);
      res.status(500).send({error: "An error occurred while setting up a PaymentMethod"});
    }
  });
});

/**
 * Delete Card from Stripe customer
 */
exports.deleteCard = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const {customerId, cardId} = req.body;

    if (!customerId || !cardId) {
      res.status(400).json({error: "Bad Request: Missing fields"});
      return;
    }

    try {
      await stripe.paymentMethods.detach(cardId);

      // Remove the card from the user's payment methods in the db
      const db = admin.firestore();
      await db.collection("users").doc(customerId).update({
        "payments.cards": admin.firestore.FieldValue.arrayRemove(cardId),
      });

      res.status(200).json({success: true});
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).json({error: "An error occurred while deleting the card"});
    }
  });
});
