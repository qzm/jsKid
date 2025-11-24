/**
 * 记忆配对游戏
 */
const container = document.getElementById('cards-container')!;
const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎸', '🎹'];
const cards = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
let flipped: number[] = [], matched: number[] = [], moves = 0;

function createCard(emoji: string, index: number) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<div class="front">?</div><div class="back">${emoji}</div>`;
  card.onclick = () => flipCard(index, card);
  container.appendChild(card);
}

function flipCard(index: number, cardEl: HTMLElement) {
  if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
  
  cardEl.classList.add('flipped');
  flipped.push(index);
  
  if (flipped.length === 2) {
    moves++;
    document.getElementById('moves')!.textContent = moves.toString();
    
    if (cards[flipped[0]] === cards[flipped[1]]) {
      matched.push(...flipped);
      flipped = [];
      if (matched.length === cards.length) gameWin();
    } else {
      setTimeout(() => {
        document.querySelectorAll('.card').forEach((c, i) => {
          if (flipped.includes(i)) c.classList.remove('flipped');
        });
        flipped = [];
      }, 1000);
    }
  }
}

function gameWin() {
  setTimeout(() => alert(`恭喜完成！用了 ${moves} 步`), 500);
}

cards.forEach((emoji, i) => createCard(emoji, i));
console.log('🎴 记忆配对游戏加载完成！');
