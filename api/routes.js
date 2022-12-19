import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./config.js";
import cors from "cors";
import { Person } from "./models/Persons.js";


const app = express();
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  return res.status(200).json({ msg: "batata" });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, pass } = req.body;
  if (!(name && email && pass))
    return res.status(401).json({ msg: "Erro, algum campo inválido" });
  let person = await Person.findOne({ email: email });
  if (person)
    return res.status(401).json({ msg: "Erro, este usuário já existe" });
  try {
    let pass_hash = await bcrypt.hash(pass, 12);
    person = new Person({ name: name, email: email, pass: pass_hash });
    await person.save();
    return res.status(200).json({ msg: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Erro ao tentar cadastrar um novo usuário!" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, pass } = req.body;
  if (!(email && pass))
    return res.status(401).json({ msg: "Erro, algum campo inválido" });
  let person = await Person.findOne({ email: email });
  if (!person)
    return res
      .status(401)
      .json({ msg: "Erro, usuário  ou senha inválido(s)!" });
  let pass_validation = await bcrypt.compare(pass, person.pass);
  if (!pass_validation)
    return res
      .status(401)
      .json({ msg: "Erro, usuário  ou senha inválido(s)!" });

  let token = jwt.sign({ id: person._id }, config.key, { expiresIn: "3d" });
  let { chats, name } = person;
  return res.status(200).json({ token, chats, name });
});

export { app };
