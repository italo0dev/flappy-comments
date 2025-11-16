(function flappyInComments() {
  const container = document.querySelector('ytd-comments#comments');
  if (!container) return alert("Comentários não encontrados!");

  // Ativa suporte ao TrustedHTML para evitar erro de segurança
  if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
    window.trustedTypes.createPolicy('default', {
      createHTML: input => input
    });
  }

  function createRestartButton(restartFn) {
    const btn = document.createElement("button");
    btn.textContent = "🔄 Reiniciar";
    btn.style.padding = "10px";
    btn.style.marginTop = "10px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.onclick = restartFn;
    container.appendChild(btn);
  }

  function startGame() {
    container.innerHTML = "";
    container.style.whiteSpace = "pre";
    container.style.fontFamily = "monospace";
    container.style.height = "300px";
    container.style.overflow = "hidden";

    const columns = 50;
    const rows = 20;
    let playerX = Math.floor(columns / 2);
    let bullets = [];
    let enemies = [];
    let frame = 0;

      function generateEnemies() {
      for (let i = 0; i < columns; i += 5) {
        enemies.push({ x: i, y: 0 });
      }
    }

    function handleGameOver() {
      clearInterval(gameLoop);
      container.innerHTML = "💥 GAME OVER 💥\n";
      createRestartButton(() => startGame());
    }

     document.onkeydown = e => {
      if (e.code === "ArrowLeft") playerX = Math.max(0, playerX - 1);
      if (e.code === "ArrowRight") playerX = Math.min(columns - 1, playerX + 1);
      if (e.code === "Space") bullets.push({ x: playerX, y: rows - 2 });
    };

     generateEnemies();

    const gameLoop = setInterval(() => {
      frame++;

      // Move bullets
      bullets = bullets.map(b => ({ x: b.x, y: b.y - 1 })).filter(b => b.y >= 0);

      // Move enemies
      if (frame % 10 === 0) {
        enemies = enemies.map(e => ({ x: e.x, y: e.y + 1 }));
      }

      // Check collisions
      bullets.forEach(b => {
        enemies.forEach((e, i) => {
          if (b.x === e.x && b.y === e.y) {
            enemies.splice(i, 1);
            b.y = -1; // remove bullet
          }
        });
      });

      // Check if enemies reached bottom
      if (enemies.some(e => e.y >= rows - 1)) {
        handleGameOver();
        return;
      }

      // Draw screen
      let screen = "";
      for (let y = 0; y < rows; y++) {
        let row = "";
        for (let x = 0; x < columns; x++) {
          if (y === rows - 1 && x === playerX) row += "🚀";
          else if (bullets.some(b => b.x === x && b.y === y)) row += "🔺";
          else if (enemies.some(e => e.x === x && e.y === y)) row += "👾";
          else row += " ";
        }
        screen += row + "\n";
      }

      container.innerHTML = screen;
    }, 100);
  }

  startGame();
})();
