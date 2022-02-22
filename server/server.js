import "./config/env.js";
import { fileURLToPath } from "url";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import express from "express";
import path, { dirname } from "path";
import db from "./config/connection.js";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authMiddleware } from "./utils/auth.js";
import webhookRouter from "./controllers/hook.js";

async function startServer(typeDefs, resolvers) {
  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const PORT = process.env.PORT || 3001;
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: ({ req, res }) => {
      return authMiddleware({ req: req });
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await gqlServer.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/hook", webhookRouter);

  gqlServer.applyMiddleware({ app });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("/*", function (req, res) {
      res.sendFile(
        path.join(__dirname, "../client/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.info(`Server is running on http://localhost:${PORT}`);
    });
  });
}

startServer(typeDefs, resolvers).catch((err) => console.log(err));
