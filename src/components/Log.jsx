import React from "react";

function Log({ logs }) {
  return (
    <section id="log" className="container">
      <h2>Battle Log</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <span>{log.isPlayer ? "Player" : "Monster"}</span>
            <span>
              {log.isDamage ? " takes" : " heals for"}{" "}
              {log.isDamage && log.isPlayer && log.text !== "killed themselves" && (
                <span className="log--damage">{log.text.split(" ")[0]}</span>
              )}
              {log.isDamage && !log.isPlayer && (
                <span className="log--damage">{log.text.split(" ")[0]}</span>
              )}
              {!log.isDamage && log.isPlayer && (
                <span className="log--heal">{log.text.split(" ")[0]}</span>
              )}{" "}
              {log.text.split(" ")[1] || log.text.split(" ")[0]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Log;