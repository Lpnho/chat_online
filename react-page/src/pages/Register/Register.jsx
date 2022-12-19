import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { url } from "../..";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();
  const sendReq = async () => {
    let response;
    try {
      response = await axios({
        method: "post",
        url: url + 'auth/register',
        headers: {},
        data: { name, email, pass },
      });
    } catch (err) {
      window.alert(err.response.data.msg);
    }
    if (response.status === 200) nav("/Login");
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
          <h1>Registrar</h1>

          <label>
            Nome:
            <input
              className="field"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
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
          <button
            id="submit-button"
            type="button"
            onClick={(e) => {
              if (name && pass && email) sendReq();
            }}
          >
            Enviar
          </button>
          <Link to="/login">Entrar</Link>
        </form>
      </fieldset>
    </>
  );
}
