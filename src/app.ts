import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./routes/books.route";
import borrowRouter from "./routes/borrow.route";
import { success } from "zod/v4";
import errorHandler from "./middleware/errorHandler";
import { connectToDatabase } from "./utils/db";

// Connect to DB and log any potential errors
connectToDatabase().catch((err) => {
  console.error("Startup database connection failed:", err);
});

const app: Application = express();

// middleware
app.use(express.json()); //for body parser

// routes
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

// global error handler
app.use(errorHandler);

// root path
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to library management app",
  });
});

// 404 route
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(404).json({
      success: false,
      message: `Your request path doesn't exist.`,
      path: req.originalUrl,
    });
  } catch (error) {
    console.log("Something went wrong");
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  } finally {
    next();
  }
});

export default app;
