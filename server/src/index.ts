import "dotenv/config";
import app from "./api/api.js";
import { env } from "./lib/env.js";

app.listen(env.PORT);