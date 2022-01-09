import express from "express";
import config from "config";
import bodyParser from "body-parser";
import routes from "./routes";
import db from "./db";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: config.get("corsOrigin"),
  })
);

const port = config.get("port");

//parse aplication/json
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
  db();
  routes(app);
});
