import {Strategy} from "passport-google-oauth20"
import passport from "passport";
import {User} from "./models/userModels.js"
import dotenv from "dotenv";
dotenv.config();

passport.use(
	new Strategy(
	  {
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: "/auth/google/callback",
		scope: ["profile", "email"],
	  },
	  async function (accessToken, refreshToken, profile, callback) {
		callback(null, profile);
		const email = profile._json.email;
		try {
		  const user = await User.findOne({ email });
		  if (!user) {
			await new User({name: profile._json.name, email: profile._json.email, password: profile.id,}).save();
			console.log("User Registered Successfully");
		  } else {
			console.log("User already exists");
		  }
		} catch (error) {
		  console.error(error);
		}
	  }
	)
  );
  

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});