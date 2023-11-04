import express from "express";
import {loginController, registerController, testController} from "../controllers/authControler.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/test", requireSignIn,isAdmin, testController);

// Google Auth

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req?.user,
		});
		console.log(req.user._json?.picture)
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});
router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout(function(err) {
	  if (err) {
		// Handle any logout errors here
		console.error(err);
		return res.status(500).json({ error: true, message: "Logout failed" });
	  }
	  // Redirect to the client URL after successful logout
	  res.redirect(process.env.CLIENT_URL);
	});
  });

export default router;