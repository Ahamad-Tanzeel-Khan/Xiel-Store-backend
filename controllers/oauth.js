import express from "express";
import dotenv from "dotenv";
import {OAuth2Client} from "google-auth-library"

const router = express.Router();
dotenv.config();


async function getUserData(access_token){
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data = await response.json();
    console.log('data',data);
}

router.get("/", async function(req,res, next){
    const code = req.query.code;
    try {
        const redirectUrl = "http://localhost:5000/oauth";

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);
        console.log("Token acquired");
        const user = oAuth2Client.credentials;
        await getUserData(user.access_token);
    } catch (error) {
        console.log("Error in signing with Google");
    }
})

