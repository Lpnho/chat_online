import mongoose from "mongoose";
import config from "./config.js";
import {} from "./socketEvent.js";
import { httpServer } from "./app.js";
const url = `mongodb+srv://${config.db_user}:${config.db_pass}@clusterdevweb.vlyaffy.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(url)
  .then(() => {
    httpServer.listen(config.port);
    console.log(`Servidor online em http://localhost:${config.port}`);
  })
  .catch((err) => {
    console.log(`Erro ao tentar conectar com o banco de dados:${err}`);
  });
