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

    let birdY = 10;
    let velocity = 0;
    const gravity = 0.25;   // QUEDA MAIS SUAVE
    const jump = -4.5;     // PULO MAIS CONTROLADO
    const columns = 50;
    const rows = 20;
    const gapSize = 6;
    const pipes = [];
    let frame = 0;

    function generatePipe() {
      const gapStart = Math.floor(Math.random() * (rows - gapSize - 2)) + 1;
      pipes.push({ x: columns - 1, gapStart });
    }

    function handleGameOver() {
      clearInterval(gameLoop);
      container.innerHTML = "💥 GAME OVER 💥\n";
      createRestartButton(() => startGame());
    }

    document.onkeydown = e => {
      if (["Space", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.code)) {
        velocity = jump;
      }
    };

    const gameLoop = setInterval(() => {
      velocity += gravity;
      birdY += velocity;
      birdY = Math.max(0, Math.min(rows - 1, birdY));

      if (frame % 20 === 0) generatePipe();
      pipes.forEach(p => p.x--);
      if (pipes.length > 0 && pipes[0].x < -1) pipes.shift();

      if (pipes.some(p =>
        p.x === 5 &&
        (Math.floor(birdY) < p.gapStart || Math.floor(birdY) > p.gapStart + gapSize)
      )) {
        handleGameOver();
        return;
      }

      let screen = "";
      for (let y = 0; y < rows; y++) {
        let row = "";
        for (let x = 0; x < columns; x++) {
          if (Math.floor(birdY) === y && x === 5) row += "🐤";
          else {
            const p = pipes.find(p => p.x === x);
            row += p && (y < p.gapStart || y > p.gapStart + gapSize) ? "🟩" : " ";
          }
        }
        screen += row + "\n";
      }

      container.innerHTML = screen;
      frame++;
    }, 120); // RITMO MAIS LENTO E SUAVE
  }

  startGame();
})();