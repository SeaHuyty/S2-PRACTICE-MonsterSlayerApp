import React, { useState, useEffect } from "react";
import Entity from "./Entity";
import GameOver from "./GameOver";
import Log from "./Log";

// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Creates a log entry for an attack action
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer,
    isDamage: true,
    text: `${damage} damages`,
  };
}

// Creates a log entry for a healing action
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: `${healing} life points`,
  };
}

function Game() {
  // State for tracking player and monster health, game status, logs, and turns
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [logs, setLogs] = useState([]);
  const [turnCount, setTurnCount] = useState(0);
  const [attackCount, setAttackCount] = useState(0);

  // Handles player's regular attack
  const attackHandler = () => {
    const playerDamage = getRandomValue(10, 18); // Player deals 10-18 damage
    const monsterDamage = getRandomValue(8, 15); // Monster counters with 8-15
    setMonsterHealth((prev) => Math.max(prev - playerDamage, 0));
    setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
    setTurnCount((prev) => prev + 1);
    setAttackCount((prev) => prev + 1); // Tracks regular attacks for special
    setLogs((prev) => [
      createLogAttack(true, playerDamage),
      createLogAttack(false, monsterDamage),
      ...prev,
    ]);
  };

  // Handles player's special attack (available after 3 regular attacks)
  const specialAttackHandler = () => {
    const playerDamage = getRandomValue(20, 35); // Player deals 20-35 damage
    const monsterDamage = getRandomValue(8, 15); // Monster counters with 8-15
    setMonsterHealth((prev) => Math.max(prev - playerDamage, 0));
    setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
    setTurnCount((prev) => prev + 1);
    setAttackCount(0); // Resets attack count after special
    setLogs((prev) => [
      createLogAttack(true, playerDamage),
      createLogAttack(false, monsterDamage),
      ...prev,
    ]);
  };

  // Handles player healing, with monster counterattack
  const healHandler = () => {
    const healing = getRandomValue(10, 18); // Player heals 10-18
    const monsterDamage = getRandomValue(5, 12); // Monster deals 5-12
    setPlayerHealth((prev) => {
      const afterHeal = Math.min(prev + healing, 100); // Caps at 100
      return Math.max(afterHeal - monsterDamage, 0); // Floors at 0
    });
    setTurnCount((prev) => prev + 1);
    setLogs((prev) => [
      createLogHeal(healing),
      createLogAttack(true, monsterDamage), // Player takes damage
      ...prev,
    ]);
  };

  // Ends the game by setting player health to 0
  const killYourselfHandler = () => {
    setPlayerHealth(0);
    setLogs((prev) => [
      { isPlayer: true, isDamage: true, text: "killed themselves" },
      ...prev,
    ]);
    setGameOver(true);
  };

  // Resets the game to initial state
  const resetGameHandler = () => {
    setPlayerHealth(100);
    setMonsterHealth(100);
    setGameOver(false);
    setLogs([]);
    setTurnCount(0);
    setAttackCount(0);
  };

  // Checks for game over condition when health reaches 0
  useEffect(() => {
    if (playerHealth <= 0 || monsterHealth <= 0) {
      setGameOver(true);
    }
  }, [playerHealth, monsterHealth]);

  // Determines the game result text
  const gameResult = () => {
    if (playerHealth <= 0 && monsterHealth <= 0) return "Draw!";
    if (playerHealth <= 0) return "You lost!";
    if (monsterHealth <= 0) return "You won!";
    return "";
  };

  // Enables special attack after 3 regular attacks
  const specialAttackAvailable = attackCount >= 3;

  // Renders the game UI
  return (
    <>
      <Entity title="Monster Health" health={monsterHealth} />
      <Entity title="Your Health" health={playerHealth} />
      {gameOver ? (
        <GameOver title={gameResult()} restartGame={resetGameHandler} />
      ) : (
        <section id="controls">
          <button onClick={attackHandler}>ATTACK</button>
          <button
            onClick={specialAttackHandler}
            disabled={!specialAttackAvailable}
          >
            SPECIAL !
          </button>
          <button onClick={healHandler}>HEAL</button>
          <button onClick={killYourselfHandler}>KILL YOURSELF</button>
        </section>
      )}
      <Log logs={logs} />
    </>
  );
}

export default Game;