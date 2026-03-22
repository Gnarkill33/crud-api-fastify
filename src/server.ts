import { startApp } from "./app.ts";
import { PORT } from "./constants.ts";

const fastify = startApp();

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${PORT}`);
});
