import admin from "firebase-admin";

require("dotenv").config();

let serviceAccount: admin.ServiceAccount = {
  projectId: process.env.project_id,
  clientEmail: process.env.client_email,
  privateKey: process.env.private_key,
};

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const verifyAuthentication = async (bearerToken: string) => {
  let idToken = bearerToken.split(" ")[1];
  let result: any = null;
  if (bearerToken == process.env.dev_token) {
    return true;
  } else if (bearerToken.split(" ")[0] === "Bearer") {
    result = app
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        return decodedToken;
      })
      .catch(() => {
        return null;
      });
    return result;
  } else {
    return result;
  }
};

//TODO Rest of the stuff https://firebase.google.com/docs/admin/setup#linux-or-macos
