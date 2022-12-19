import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { url } from "../..";
export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();


  const sendReq = async () => {
    let response;
    try {
      response = await axios({
        method: "post",
        url: url + 'auth/login',
        headers: {},
        data: { email: email, pass: pass },
      });
    } catch (err) {
      window.alert(err.response.data.msg);
    }
    if (response.status === 200) {
      const { data: { token, chats, name } } = response
      if (token && chats && name) {
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("chats", JSON.stringify(chats));
        localStorage.setItem("email", JSON.stringify(email));
        localStorage.setItem("name", JSON.stringify(name));
        nav("/chat");
      }
    }
  };

  return (
    <>
      <fieldset
        id="form-env"
        onSubmit={(e) => {
          e.defaultPrevented();
        }}
      >
        <form id="form">
          <h1>Login</h1>
          <label>
            Email:
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <label>
            Senha:
            <input
              className="field"
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
          </label>
          <Link to="/register">registrar-se</Link>
          <button
            id="submit-button"
            type="button"
            onClick={(e) => {
              if (pass && email) sendReq();
            }}
          >
            Enviar
          </button>
        </form>
      </fieldset>
    </>
  );
}
