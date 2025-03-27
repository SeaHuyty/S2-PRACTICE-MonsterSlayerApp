import React from 'react'

function GameOver({ title, restartGame }) {
  return (
    <section className="container">
      <h2>Game Over!</h2>
      <h3>{title}</h3>
      <button onClick={restartGame}>Start New Game</button>
    </section>
  )
}

export default GameOver