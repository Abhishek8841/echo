import "dotenv/config";
import app from "./api/api.js";
import { env } from "./lib/env.js";
import { initWebsockets } from "./ws/ws.js";

const server = app.listen(env.PORT, () => { console.log("Server is live") })
initWebsockets(server);
