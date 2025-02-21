import express, { ErrorRequestHandler } from "express";
import Database from "./config/dbConn";
import cors from "cors";
import logger from "./utils/logger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressFileUpload from "express-fileupload";

import autoAsyncWrapper from "./utils/errors/autoAsyncWrap";
import { createError } from "./utils/errors/createError";
import authRouter from "./src/api/v1/auth/routes";
import AuthRouter from "./src/api/v1/auth/routes";
class Server {
  public app = express();
  public port?: Number;

  constructor() {
    this.config();
    this.router();
  }

  private async connectToDb() {
    return await Database.createConnection();
  }

  public async config() {
    // this.app.set('trust proxy', true)
    // this.app.set('case sensitive routing', true)
    // const corsOptions = {
    //   origin: process.env.CORS_ALLOW_ORIGIN || '*',
    //   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    // }
    // this.app.all('/*', function (request: express.Request, response: express.Response, next: express.NextFunction) {
    //     response.header('Access-Control-Allow-Origin', '*')
    //     response.header('Access-Control-Allow-Headers', 'X-Requested-With')
    //     next()
    //   })
    //   this.app.use(cors(corsOptions))
    const corsOptions = {
      origin: (origin: any, callback: any) => {
        const allowedOrigins = [
          "http://localhost:5173",
          "http://localhost:5505",
          "http://localhost:5500",
          "127.0.0.1:5500",
          "http://localhost:4200",
          "https://nxt-wave-assignment.vercel.app",
          process.env.CORS_ALLOW_ORIGIN || "*",
        ];

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
        "sentry-trace",
        "X-Client-Type",
      ],
    };
    this.app.use(cors(corsOptions));
    this.app.all("*", (request, response, next) => {
      logger?.debug(
        JSON.stringify({
          type: "CORS",
          hostname: request.hostname,
          path: request.url,
          // isAllowed:req.hostname.includes(variables.CORS_ALLOWED as string)
        }),
        response.header(
          "Access-Control-Allow-Origin",
          request.get("origin") ||
            "http://localhost:5173" ||
            "http://localhost:5505" ||
            request.get("host") ||
            `${request.protocol}://${request.hostname}`
        ),
        response.header("Access-Control-Allow-Credentials", "true"),
        response.header(
          "Access-Control-Allow-Headers",
          "Content-Type,Content-Length,Authorization,Accept,X-Requested-With,sentry-trace,X-Client-Type"
        ),
        response.header(
          "Access-Control-Allow-Methods",
          "PUT,POST,GET,DELETE,OPTIONS,PATCH"
        )
      );
      return next();
    });

    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb" }));
  }

  private async router() {
    this.app.use("/api/v1/auth", AuthRouter);

    this.app.use("/uploads", express.static(__dirname + "/uploads"));

    this.app.all("*", async (request, response, next) => {
      logger?.info(request.url);
      // throw new NotFoundError()
      next(createError({ status: 400, message: "not found" }));
    });

    const errorMiddleware: ErrorRequestHandler = (
      err: any,
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      const errorStatus = err.status || 500;
      const errorMessage = err.message || "something went wrong";
      console.log(err);

      response.status(errorStatus).json({
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
        success: false,
      });
    };
    this.app.use(errorMiddleware);
  }

  public async start(port: number) {
    await this.connectToDb();
    this.port = port;
    this.app.listen(this.port, () => {
      console.log(`Listening on ${this.port}`);
    });
  }
}

export default Server;
