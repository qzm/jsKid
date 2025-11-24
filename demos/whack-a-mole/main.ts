/**
 * 打地鼠游戏
 */
const container = document.getElementById('holes-container')!;
const holes: HTMLElement[] = [];
let score = 0, timeLeft = 30, gameRunning = false, moleTimer: any;

for (let i = 0; i < 9; i++) {
  const hole = document.createElement('div');
  hole.className = 'hole';
  hole.innerHTML = '<div class="mole">🐹</div>';
  hole.onclick = () => whackMole(i);
  container.appendChild(hole);
  holes.push(hole);
}

function showMole() {
  const randomHole = holes[Math.floor(Math.random() * holes.length)];
  randomHole.classList.add('active');
  setTimeout(() => randomHole.classList.remove('active'), 800);
}

function whackMole(index: number) {
  if (!gameRunning) return;
  if (holes[index].classList.contains('active')) {
    holes[index].classList.remove('active');
    score += 10;
    updateUI();
  }
}

function startGame() {
  score = 0; timeLeft = 30; gameRunning = true;
  updateUI();
  moleTimer = setInterval(showMole, 1000);
  const timer = setInterval(() => {
    timeLeft--;
    updateUI();
    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(moleTimer);
      gameRunning = false;
      alert(`游戏结束！得分: ${score}`);
    }
  }, 1000);
}

function updateUI() {
  document.getElementById('score')!.textContent = score.toString();
  document.getElementById('time')!.textContent = timeLeft.toString();
}

document.getElementById('start-btn')!.onclick = startGame;
console.log('🔨 打地鼠游戏加载完成！');
