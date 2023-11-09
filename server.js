import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import "./passport.js"
import payment_route from "./routes/paymentRoute.js";



dotenv.config();

const app = express();

// Database
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "https://xiel-store.netlify.app",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoutes);



app.get("/", (req,res) => {
    res.send({
        message: "Welcome to Xiel store"
    })
})



app.use("/api", payment_route);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: "rzp_test_LLJ8rm0DIH6YtR"})
);


// PORT
const PORT = process.env.PORT || 5000;

// server listen
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
})
