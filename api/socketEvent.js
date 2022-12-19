import { io } from "./app.js";
import bcrypt from "bcrypt";
import { Person } from "./models/Persons.js";
import { Chat } from "./models/Chats.js";
import { json } from "express";

var users = [];
var salas = [];
var id = 0;

function AddUsers(user) {
  user.id = id;
  id++;
  users.push(user);
  console.log(`connect: ${users.length}`);
}
function DropUsers(token) {
  const indice = users.findIndex((el) => el.token === token);
  users.splice(indice, 1);
  console.log(`disconnect: ${users.length}`);
}
function GetIds() {
  let map = users.map((el) => {
    return { id: el.id, name: el.name };
  });
  return map;
}

io.sockets.disconnectSockets();

io.on("connection", (socket) => {
  let {
    handshake: {
      auth: { token },
    },
  } = socket;
  // Evento para login:
  socket.on("start", async (data) => {
    const { name, email } = data;
    let user = {
      name,
      email,
      socket_id: socket.id,
      token: token,
    };
    AddUsers(user);
    let person = await Person.findOne({ email });
    if (person) {
      person.chats.forEach((el) => {
        socket.join(el.chat_id);
      });
    }

    let active_users = GetIds();
    io.emit("new_user", { active_users: active_users });
  });
  // Evento de refresh ou exit
  socket.on("disconnect", () => {
    DropUsers(token);
    let active_users = GetIds();
    io.emit("new_user", { active_users: active_users });
  });
  // Evento de novo chat
  socket.on("new_chat", async (data) => {
    if (users) {
      const { id, email } = data;
      const usr = users.find((el) => el.id === id);
      const rem_usr = users.find((el) => el.email === email);
      if (usr && rem_usr) {
        if (id !== rem_usr.id) {
          let string =
            usr.email < email ? email + usr.email : usr.email + email;
          const chat_id = await bcrypt.hash(string, 10);
          // let comp = salas.find(
          // async (el) => await bcrypt.compare(el, chat_id)
          // );
          // if (!comp) {
          salas.push(string);
          io.sockets.sockets.forEach((el) => {
            if (el.id === usr.socket_id) {
              el.join(chat_id);
            }
          });
          socket.join(chat_id);
          const msg = "Um novo canal foi aberto, aproveite a conversa!";
          try {
            let quarry = {
              filter: { email: { $in: [email, usr.email] } },
            };

            let chats = new Chat({
              parts: {
                dest_name: usr.name,
                dest_email: usr.email,
                reme_name: rem_usr.name,
                reme_email: rem_usr.email,
              },
              chat_id,
              chat_messages: ["_s'rv#{?/" + msg],
            });

            await Person.updateMany(quarry, {
              $addToSet: { chats },
            });

            io.to(chats.chat_id).emit("new_chat_", chats);
            console.log(msg);

            // await chats.save();
          } catch (err) {
            console.log(err + "erro");
          }
          // }
        }
      }
    }
  });
  // Evento de mensagem
  socket.on("mensage", async (data) => {
    const { msg, chat } = data;
    if (msg && chat) {
      await Person.updateMany(
        { "chats.chat_id": chat },
        { $push: { "chats.$.chat_messages": msg } }
      );
      const { chats } = await Person.findOne({ "chats.chat_id": chat });
      const { chat_messages } = chats.find((el) => el.chat_id === chat);

      io.to(chat).emit("mensage", { chat, chat_messages });
    }
  });
});

export {};
