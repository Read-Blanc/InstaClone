import express, { json } from "express"; //middleware in express i.e json
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan"; //logger middleware for express
import cors from "cors"; //middleware for cross-origin resource sharing
import { cacheMiddleware } from "./middleware/cache.js";

// import routes
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js"; // import post routes
import commentRoutes from "./routes/comment.js";

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:4600",
    "https://insta-clone-01.vercel.app/api",
  ], // Allow requests from this origin
  methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}; //cors options
app.use(cors(corsOptions)); //allows external origin points to communicate with our server
app.use(morgan("dev")); //logger middleware for express
app.use(json({ limit: "25mb" })); //parses requests to client side in json body format
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by"); //disable tech-stack

// home server route
app.get("/", (req, res) => {
  res.send("Welcome to InstaShots server");
});

app.get("/user", cacheMiddleware("auth_user"), (req, res) => {
  res.send("User data cached successfully");
});

// api
app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comments", commentRoutes);

// handle route errors
app.use((req, res, next) => {
  return next(createHttpError(404, `Route ${req.originalUrl} not found`));
});

//handle specific app errors
app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "Internal Server Error";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  //sending error to client
  res.status(statusCode).json({ error: error.message });
});

export default app;
