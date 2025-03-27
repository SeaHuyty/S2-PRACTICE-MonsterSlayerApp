import React, { useState, useEffect } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [logs, setLogs] = useState([]);
  const [turnCount, setTurnCount] = useState(0);
  const [attackCount, setAttackCount] = useState(0);
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // Handles player attack
  const attackHandler = () => {
    const playerDamager = getRandomValue(6, 15);
    const monsterDamage = getRandomValue(8, 15);
    setMonsterHealth((prev) => Math.max(prev - playerDamager, 0));
    setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
    setTurnCount((prev) => prev + 1);
    setAttackCount((prev) => prev + 1);
    setLogs((prev) => [
        createLogAttack(true, playerDamage),
        createLogAttack(false, monsterDamage),
        ...prev,
    ]);
  };

  // Handles player special attack (every 3rd attack)	
  const specialAttackHandler = () => {
    const playerDamage = getRandomValue(15, 30);
    const monsterDamage = getRandomValue(8, 15);
    setMonsterHealth((prev) => Math.max(prev - playerDamage, 0));
    setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
    setTurnCount((prev) => prev + 1);
    setAttackCount(0);
    setLogs((prev) => [
        createLogAttack(true, playerDamage),
        createLogAttack(false, monsterDamage),
        ...prev,
    ]);
  };

  // Enable special attack button every 3rd attack
  const specialAttackAvailable = attackCount >= 3;

  // Handles player healing
  const healHandler = () => {
    const healing = getRandomValue(8, 20);
    const monsterDamage = getRandomValue(8, 15);
    setPlayerHealth((prev) => {
      const afterHealing = Math.min(prev + healing, 100);
      return Math.max(afterHealing - monsterDamage, 0);
    });
    setTurnCount((prev) => prev + 1);
    setLogs((prev) => [
        createLogHeal(healing),
        createLogAttack(true, monsterDamage),
        ...prev,
    ]);
  };

  // Handles player surrender
  const killYourselfHandler = () => {
    setPlayerHealth(0);
    setLogs((prev) => [
      {
          isPlayer: true, isDamage: true, text: `surrendered`,
          ...prev,
      }
    ]);
    setGameOver(true);
  };

  // Reset Game
  const resetGameHandler = () => {
    setPlayerHealth(100);
    setMonsterHealth(100);
    setGameOver(false);
    setLogs([]);
    setTurnCount(0);
    setAttackCount(0);
  };

  // Gameover condition when health is 0
  useEffect(() => {
    if (playerHealth <= 0 || monsterHealth <= 0) {
      setGameOver(true);
    }
  }, [playerHealth, monsterHealth]);

  // Game result message
  const gameResult = () => {
    if (playerHealth <= 0 && monsterHealth <= 0) {
      return "It's a draw!";
    }
    if (playerHealth <= 0) {
      return "You lost!";
    }
    if (monsterHealth <= 0) {
      return "You won!";
    }
    return "Game is on...";
  }
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  return (
    <>
      <Entity title="Monster Health" health={monsterHealth} />
      <Entity title="Your Health" health={playerHealth} />
      {gameOver ? (
        <GameOver title={gameResult()} restartGame={resetGameHandler} />
      ) : (
        <section id="controls">
          <button onClick={attackHandler}>Attack</button>
          <button
            onClick={specialAttackHandler}
            disabled={!specialAttackAvailable}
          >
            SPECIAL !
          </button>
          <button onClick={healHandler}>Heal</button>
          <button onClick={killYourselfHandler}>KILL YOURSELF</button>
        </section>
      )}
      <Log logs={logs} />
    </>
  );
  // ----------------------------------------------------------------------------------------------------------
}

export default Game;
