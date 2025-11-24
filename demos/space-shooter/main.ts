/**
 * 太空射击游戏 - 使用 jsKid 引擎重构版本
 *
 * 展示功能:
 * - jsKid 游戏循环和渲染系统
 * - 完整的游戏机制：移动、射击、碰撞、得分
 * - Boss战斗系统
 * - 道具系统和玩家升级
 * - 粒子特效
 * - 波次系统和难度递增
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { Vector2, Color } from '../../packages/utils/src/index';

// ==================== 游戏配置 ====================
const GAME_CONFIG = {
  width: 800,
  height: 600,
  player: {
    speed: 300,
    size: 40,
    fireRate: 0.15,
    maxHealth: 100,
  },
  bullet: {
    speed: 500,
    size: 5,
    damage: 10,
  },
  enemy: {
    speed: 100,
    size: 30,
    spawnRate: 1.5,
    health: 30,
  },
  powerup: {
    speed: 80,
    size: 20,
    spawnChance: 0.2, // 20%概率掉落
  },
  boss: {
    speed: 50,
    size: 80,
    health: 300,
    fireRate: 0.5,
  },
};

// ==================== 游戏对象基类 ====================
abstract class GameObject {
  position: Vector2;
  velocity: Vector2;
  size: number;
  color: Color;
  alive: boolean = true;

  constructor(x: number, y: number, size: number, color: Color) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.size = size;
    this.color = color;
  }

  abstract update(deltaTime: number): void;

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color.toRGBA();
    ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
  }

  isOffScreen(): boolean {
    return (
      this.position.x < -this.size ||
      this.position.x > GAME_CONFIG.width + this.size ||
      this.position.y < -this.size ||
      this.position.y > GAME_CONFIG.height + this.size
    );
  }

  collidesWith(other: GameObject): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size + other.size) / 2;
  }
}

// ==================== 玩家飞船 ====================
class Player extends GameObject {
  health: number;
  fireTimer: number = 0;
  canFire: boolean = true;

  constructor() {
    super(GAME_CONFIG.width / 2, GAME_CONFIG.height - 60, GAME_CONFIG.player.size, new Color(0, 200, 255));
    this.health = GAME_CONFIG.player.maxHealth;
  }

  update(deltaTime: number): void {
    // 更新射击冷却
    if (!this.canFire) {
      this.fireTimer += deltaTime;
      if (this.fireTimer >= GAME_CONFIG.player.fireRate) {
        this.canFire = true;
        this.fireTimer = 0;
      }
    }

    // 边界限制
    this.position.x = Math.max(this.size / 2, Math.min(GAME_CONFIG.width - this.size / 2, this.position.x));
  }

  render(ctx: CanvasRenderingContext2D): void {
    // 绘制飞船主体
    ctx.fillStyle = this.color.toRGBA();
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y - this.size / 2);
    ctx.lineTo(this.position.x - this.size / 2, this.position.y + this.size / 2);
    ctx.lineTo(this.position.x + this.size / 2, this.position.y + this.size / 2);
    ctx.closePath();
    ctx.fill();

    // 绘制发动机火焰
    ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
    ctx.fillRect(this.position.x - 8, this.position.y + this.size / 2, 4, 8);
    ctx.fillRect(this.position.x + 4, this.position.y + this.size / 2, 4, 8);
  }

  moveLeft(deltaTime: number): void {
    this.position.x -= GAME_CONFIG.player.speed * deltaTime;
  }

  moveRight(deltaTime: number): void {
    this.position.x += GAME_CONFIG.player.speed * deltaTime;
  }

  fire(): Bullet | null {
    if (!this.canFire) return null;
    this.canFire = false;
    return new Bullet(this.position.x, this.position.y - this.size / 2);
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
    }
  }
}

// ==================== 子弹 ====================
class Bullet extends GameObject {
  damage: number;

  constructor(x: number, y: number) {
    super(x, y, GAME_CONFIG.bullet.size, new Color(255, 255, 0));
    this.velocity.y = -GAME_CONFIG.bullet.speed;
    this.damage = GAME_CONFIG.bullet.damage;
  }

  update(deltaTime: number): void {
    this.position.y += this.velocity.y * deltaTime;
    if (this.isOffScreen()) {
      this.alive = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color.toRGBA();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'yellow';
    ctx.fillRect(this.position.x - this.size / 2, this.position.y - 10, this.size, 20);
    ctx.shadowBlur = 0;
  }
}

// ==================== 敌人 ====================
class Enemy extends GameObject {
  health: number;
  maxHealth: number;

  constructor(x: number, y: number) {
    super(x, y, GAME_CONFIG.enemy.size, new Color(255, 50, 50));
    this.velocity.y = GAME_CONFIG.enemy.speed;
    this.health = GAME_CONFIG.enemy.health;
    this.maxHealth = GAME_CONFIG.enemy.health;
  }

  update(deltaTime: number): void {
    this.position.y += this.velocity.y * deltaTime;
    // 左右摇摆
    this.position.x += Math.sin(this.position.y * 0.01) * 50 * deltaTime;
    if (this.isOffScreen()) {
      this.alive = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // 绘制敌人主体
    ctx.fillStyle = this.color.toRGBA();
    ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);

    // 绘制眼睛
    ctx.fillStyle = 'white';
    ctx.fillRect(this.position.x - 10, this.position.y - 8, 6, 6);
    ctx.fillRect(this.position.x + 4, this.position.y - 8, 6, 6);

    // 绘制生命条
    const healthBarWidth = this.size;
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.position.x - healthBarWidth / 2, this.position.y - this.size / 2 - 8, healthBarWidth, 4);
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(
      this.position.x - healthBarWidth / 2,
      this.position.y - this.size / 2 - 8,
      healthBarWidth * healthPercent,
      4
    );
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.alive = false;
    }
  }
}

// ==================== 粒子系统 ====================
class Particle {
  position: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  size: number;
  color: Color;
  alpha: number = 1;

  constructor(x: number, y: number, color: Color, size: number = 3) {
    this.position = new Vector2(x, y);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 150 + 50;
    this.velocity = new Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.life = 0;
    this.maxLife = Math.random() * 0.5 + 0.3;
    this.size = size;
    this.color = color;
  }

  update(deltaTime: number): boolean {
    this.life += deltaTime;
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.alpha = 1 - this.life / this.maxLife;
    return this.life < this.maxLife;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
  }
}

// ==================== 道具系统 ====================
enum PowerUpType {
  HEALTH = 'health',
  WEAPON = 'weapon',
  SHIELD = 'shield',
  RAPID_FIRE = 'rapid_fire',
}

class PowerUp extends GameObject {
  type: PowerUpType;
  rotation: number = 0;

  constructor(x: number, y: number, type: PowerUpType) {
    const colors = {
      [PowerUpType.HEALTH]: new Color(0, 255, 0),
      [PowerUpType.WEAPON]: new Color(255, 165, 0),
      [PowerUpType.SHIELD]: new Color(100, 100, 255),
      [PowerUpType.RAPID_FIRE]: new Color(255, 255, 0),
    };

    super(x, y, GAME_CONFIG.powerup.size, colors[type]);
    this.type = type;
    this.velocity.y = GAME_CONFIG.powerup.speed;
  }

  update(deltaTime: number): void {
    this.position.y += this.velocity.y * deltaTime;
    this.rotation += deltaTime * 3;
    if (this.isOffScreen()) {
      this.alive = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color.toRGBA();
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color.toRGBA();

    if (this.type === PowerUpType.HEALTH) {
      ctx.fillRect(-3, -10, 6, 20);
      ctx.fillRect(-10, -3, 20, 6);
    } else if (this.type === PowerUpType.WEAPON) {
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(-8, 10);
      ctx.lineTo(8, 10);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === PowerUpType.SHIELD) {
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === PowerUpType.RAPID_FIRE) {
      ctx.fillRect(-2, -10, 4, 8);
      ctx.fillRect(-6, -4, 8, 4);
      ctx.fillRect(-2, 0, 4, 10);
    }

    ctx.restore();
  }
}

// ==================== Boss敌人 ====================
class Boss extends GameObject {
  health: number;
  maxHealth: number;
  fireTimer: number = 0;
  phase: number = 1;
  movePattern: number = 0;
  moveTimer: number = 0;

  constructor() {
    super(GAME_CONFIG.width / 2, 100, GAME_CONFIG.boss.size, new Color(255, 0, 255));
    this.health = GAME_CONFIG.boss.health;
    this.maxHealth = GAME_CONFIG.boss.health;
  }

  update(deltaTime: number): void {
    this.moveTimer += deltaTime;
    if (this.moveTimer > 3) {
      this.movePattern = (this.movePattern + 1) % 3;
      this.moveTimer = 0;
    }

    if (this.movePattern === 0) {
      this.position.x += Math.sin(this.moveTimer * 2) * 100 * deltaTime;
    } else if (this.movePattern === 1) {
      this.position.x = GAME_CONFIG.width / 2 + Math.cos(this.moveTimer * 2) * 150;
      this.position.y = 100 + Math.sin(this.moveTimer * 2) * 50;
    } else {
      this.position.y = 100 + Math.sin(this.moveTimer * 3) * 30;
    }

    this.position.x = Math.max(this.size, Math.min(GAME_CONFIG.width - this.size, this.position.x));

    const healthPercent = this.health / this.maxHealth;
    if (healthPercent < 0.3) {
      this.phase = 3;
    } else if (healthPercent < 0.6) {
      this.phase = 2;
    }

    this.fireTimer += deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color.toRGBA();
    ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);

    ctx.fillStyle = 'rgba(200, 0, 200, 0.8)';
    ctx.fillRect(this.position.x - 15, this.position.y + this.size / 2 - 10, 10, 20);
    ctx.fillRect(this.position.x + 5, this.position.y + this.size / 2 - 10, 10, 20);

    const eyeColor = this.phase === 3 ? 'red' : this.phase === 2 ? 'yellow' : 'white';
    ctx.fillStyle = eyeColor;
    ctx.fillRect(this.position.x - 20, this.position.y - 10, 10, 10);
    ctx.fillRect(this.position.x + 10, this.position.y - 10, 10, 10);

    const barWidth = this.size * 1.5;
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(this.position.x - barWidth / 2, this.position.y - this.size / 2 - 15, barWidth, 8);
    ctx.fillStyle = healthPercent > 0.6 ? '#00ff00' : healthPercent > 0.3 ? '#ffff00' : '#ff0000';
    ctx.fillRect(
      this.position.x - barWidth / 2,
      this.position.y - this.size / 2 - 15,
      barWidth * healthPercent,
      8
    );

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', this.position.x, this.position.y - this.size / 2 - 25);
  }

  canFire(): boolean {
    const fireRate = GAME_CONFIG.boss.fireRate / this.phase;
    if (this.fireTimer >= fireRate) {
      this.fireTimer = 0;
      return true;
    }
    return false;
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.alive = false;
    }
  }
}

// ==================== Boss子弹 ====================
class BossBullet extends GameObject {
  damage: number = 20;

  constructor(x: number, y: number, targetX: number, targetY: number) {
    super(x, y, 8, new Color(255, 0, 255));
    const dx = targetX - x;
    const dy = targetY - y;
    const angle = Math.atan2(dy, dx);
    const speed = 200;
    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;
  }

  update(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    if (this.isOffScreen()) {
      this.alive = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color.toRGBA();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'magenta';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ==================== 星空背景 ====================
class Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;

  constructor() {
    this.x = Math.random() * GAME_CONFIG.width;
    this.y = Math.random() * GAME_CONFIG.height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 50 + 25;
    this.brightness = Math.random() * 0.5 + 0.5;
  }

  update(deltaTime: number): void {
    this.y += this.speed * deltaTime;
    if (this.y > GAME_CONFIG.height) {
      this.y = 0;
      this.x = Math.random() * GAME_CONFIG.width;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// ==================== 游戏主类 ====================
class SpaceShooterGame {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;

  private player: Player;
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private stars: Star[] = [];
  private particles: Particle[] = [];
  private powerups: PowerUp[] = [];
  private boss: Boss | null = null;
  private bossBullets: BossBullet[] = [];

  private score: number = 0;
  private wave: number = 1;
  private enemiesKilled: number = 0;
  private enemySpawnTimer: number = 0;
  private combo: number = 0;
  private comboTimer: number = 0;
  private highScore: number = 0;

  private weaponLevel: number = 1;
  private hasShield: boolean = false;
  private shieldTimer: number = 0;
  private rapidFireTimer: number = 0;

  private keys: Set<string> = new Set();
  private paused: boolean = false;
  private gameOver: boolean = false;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = GAME_CONFIG.width;
    this.canvas.height = GAME_CONFIG.height;

    this.renderer = new CanvasRenderer({ canvas: this.canvas });

    this.engine = createJskid({
      debug: false,
      canvasWidth: GAME_CONFIG.width,
      canvasHeight: GAME_CONFIG.height,
      fps: 60,
      autoStart: false,
    });

    this.player = new Player();

    // 创建星空
    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star());
    }

    this.loadHighScore();
    this.bindEvents();
    this.bindControls();
    this.updateUI();
  }

  private loadHighScore(): void {
    const saved = localStorage.getItem('space-shooter-highscore');
    if (saved) {
      this.highScore = parseInt(saved);
    }
  }

  private saveHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('space-shooter-highscore', this.highScore.toString());
    }
  }

  private bindEvents(): void {
    this.engine.on('engine:update', (deltaTime: number) => {
      this.update(deltaTime);
    });

    this.engine.on('engine:render', () => {
      this.render();
    });
  }

  private bindControls(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);

      if (e.code === 'Space') {
        e.preventDefault();
        this.fireBullets();
      }

      if (e.code === 'KeyP') {
        this.togglePause();
      }

      if (e.code === 'KeyR' && this.gameOver) {
        this.restart();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.restart();
    });
  }

  private handleInput(deltaTime: number): void {
    if (this.keys.has('ArrowLeft')) {
      this.player.moveLeft(deltaTime);
    }
    if (this.keys.has('ArrowRight')) {
      this.player.moveRight(deltaTime);
    }
  }

  private fireBullets(): void {
    const bullet = this.player.fire();
    if (!bullet) return;

    if (this.weaponLevel === 1) {
      this.bullets.push(bullet);
    } else if (this.weaponLevel === 2) {
      this.bullets.push(
        new Bullet(this.player.position.x - 10, this.player.position.y - this.player.size / 2)
      );
      this.bullets.push(
        new Bullet(this.player.position.x + 10, this.player.position.y - this.player.size / 2)
      );
    } else if (this.weaponLevel >= 3) {
      this.bullets.push(bullet);
      const leftBullet = new Bullet(this.player.position.x - 15, this.player.position.y - this.player.size / 2);
      leftBullet.velocity.x = -50;
      const rightBullet = new Bullet(this.player.position.x + 15, this.player.position.y - this.player.size / 2);
      rightBullet.velocity.x = 50;
      this.bullets.push(leftBullet, rightBullet);
    }
  }

  private spawnEnemy(): void {
    const x = Math.random() * (GAME_CONFIG.width - 100) + 50;
    this.enemies.push(new Enemy(x, -50));
  }

  private spawnPowerUp(x: number, y: number): void {
    if (Math.random() > GAME_CONFIG.powerup.spawnChance) return;
    const types = [PowerUpType.HEALTH, PowerUpType.WEAPON, PowerUpType.SHIELD, PowerUpType.RAPID_FIRE];
    const type = types[Math.floor(Math.random() * types.length)];
    this.powerups.push(new PowerUp(x, y, type));
  }

  private spawnBoss(): void {
    this.boss = new Boss();
  }

  private createExplosion(x: number, y: number, color: Color, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  private checkCollisions(): void {
    // 子弹与敌人碰撞
    for (const bullet of this.bullets) {
      if (!bullet.alive) continue;

      for (const enemy of this.enemies) {
        if (!enemy.alive) continue;

        if (bullet.collidesWith(enemy)) {
          bullet.alive = false;
          enemy.takeDamage(bullet.damage);
          this.createExplosion(enemy.position.x, enemy.position.y, new Color(255, 200, 0), 5);

          if (!enemy.alive) {
            this.addScore(10);
            this.enemiesKilled++;
            this.createExplosion(enemy.position.x, enemy.position.y, enemy.color, 15);
            this.spawnPowerUp(enemy.position.x, enemy.position.y);
            this.updateUI();
          }
        }
      }

      // 子弹与Boss碰撞
      if (this.boss && this.boss.alive && bullet.collidesWith(this.boss)) {
        bullet.alive = false;
        this.boss.takeDamage(bullet.damage);
        this.createExplosion(this.boss.position.x, this.boss.position.y, new Color(255, 100, 255), 5);

        if (!this.boss.alive) {
          this.addScore(500);
          this.createExplosion(this.boss.position.x, this.boss.position.y, this.boss.color, 50);
          this.boss = null;
          this.updateUI();
        }
      }
    }

    // 敌人与玩家碰撞
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;

      if (this.player.collidesWith(enemy)) {
        enemy.alive = false;
        this.createExplosion(enemy.position.x, enemy.position.y, enemy.color, 15);

        if (!this.hasShield) {
          this.player.takeDamage(20);
          this.resetCombo();
        }

        this.updateUI();

        if (!this.player.alive) {
          this.endGame();
        }
      }
    }

    // Boss子弹与玩家碰撞
    for (const bullet of this.bossBullets) {
      if (!bullet.alive) continue;

      if (this.player.collidesWith(bullet)) {
        bullet.alive = false;

        if (!this.hasShield) {
          this.player.takeDamage(bullet.damage);
          this.resetCombo();
        }

        this.createExplosion(bullet.position.x, bullet.position.y, bullet.color, 10);
        this.updateUI();

        if (!this.player.alive) {
          this.endGame();
        }
      }
    }

    // 玩家与道具碰撞
    for (const powerup of this.powerups) {
      if (!powerup.alive) continue;

      if (this.player.collidesWith(powerup)) {
        powerup.alive = false;
        this.applyPowerUp(powerup.type);
        this.createExplosion(powerup.position.x, powerup.position.y, powerup.color, 10);
      }
    }
  }

  private addScore(points: number): void {
    this.combo++;
    this.comboTimer = 0;
    const comboMultiplier = 1 + Math.min(this.combo * 0.1, 2);
    this.score += Math.floor(points * comboMultiplier);
  }

  private resetCombo(): void {
    this.combo = 0;
    this.comboTimer = 0;
  }

  private applyPowerUp(type: PowerUpType): void {
    switch (type) {
      case PowerUpType.HEALTH:
        this.player.health = Math.min(this.player.health + 30, GAME_CONFIG.player.maxHealth);
        break;
      case PowerUpType.WEAPON:
        this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
        break;
      case PowerUpType.SHIELD:
        this.hasShield = true;
        this.shieldTimer = 0;
        break;
      case PowerUpType.RAPID_FIRE:
        this.rapidFireTimer = 0;
        GAME_CONFIG.player.fireRate = 0.08;
        break;
    }
    this.updateUI();
  }

  private update(deltaTime: number): void {
    if (this.paused || this.gameOver) return;

    this.handleInput(deltaTime);
    this.stars.forEach((star) => star.update(deltaTime));
    this.player.update(deltaTime);
    this.particles = this.particles.filter((particle) => particle.update(deltaTime));
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update(deltaTime);
      return bullet.alive;
    });
    this.enemies = this.enemies.filter((enemy) => {
      enemy.update(deltaTime);
      return enemy.alive;
    });
    this.powerups = this.powerups.filter((powerup) => {
      powerup.update(deltaTime);
      return powerup.alive;
    });

    // 更新Boss
    if (this.boss) {
      this.boss.update(deltaTime);

      if (this.boss.canFire()) {
        const bulletCount = this.boss.phase;
        for (let i = 0; i < bulletCount; i++) {
          const offsetX = (i - (bulletCount - 1) / 2) * 30;
          this.bossBullets.push(
            new BossBullet(
              this.boss.position.x + offsetX,
              this.boss.position.y + this.boss.size / 2,
              this.player.position.x,
              this.player.position.y
            )
          );
        }
      }

      if (!this.boss.alive) {
        this.boss = null;
      }
    }

    this.bossBullets = this.bossBullets.filter((bullet) => {
      bullet.update(deltaTime);
      return bullet.alive;
    });

    // 生成敌人或Boss
    if (!this.boss) {
      this.enemySpawnTimer += deltaTime;
      const spawnInterval = 1 / (GAME_CONFIG.enemy.spawnRate * this.wave * 0.5);
      if (this.enemySpawnTimer >= spawnInterval) {
        this.spawnEnemy();
        this.enemySpawnTimer = 0;
      }

      if (this.wave % 5 === 0 && this.enemiesKilled % 10 === 0 && this.enemies.length === 0) {
        this.spawnBoss();
      }
    }

    this.checkCollisions();

    if (this.enemiesKilled > 0 && this.enemiesKilled % 10 === 0 && this.enemies.length === 0 && !this.boss) {
      this.wave++;
      this.updateUI();
    }

    this.comboTimer += deltaTime;
    if (this.comboTimer > 3) {
      this.resetCombo();
    }

    if (this.hasShield) {
      this.shieldTimer += deltaTime;
      if (this.shieldTimer > 10) {
        this.hasShield = false;
      }
    }

    if (this.rapidFireTimer < 8) {
      this.rapidFireTimer += deltaTime;
    } else if (GAME_CONFIG.player.fireRate < 0.15) {
      GAME_CONFIG.player.fireRate = 0.15;
    }
  }

  private render(): void {
    const ctx = this.renderer.getContext();
    this.renderer.clear('#000000');

    // 渲染星空
    this.stars.forEach((star) => star.render(ctx));

    // 渲染粒子
    this.particles.forEach((particle) => particle.render(ctx));

    // 渲染游戏对象
    this.powerups.forEach((powerup) => powerup.render(ctx));
    this.player.render(ctx);

    // 渲染护盾
    if (this.hasShield) {
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.player.position.x, this.player.position.y, this.player.size, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.bullets.forEach((bullet) => bullet.render(ctx));
    this.enemies.forEach((enemy) => enemy.render(ctx));

    if (this.boss) {
      this.boss.render(ctx);
    }

    this.bossBullets.forEach((bullet) => bullet.render(ctx));

    // 渲染UI叠加层
    this.renderOverlay(ctx);

    // 引擎标识
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine', GAME_CONFIG.width - 10, 20);
  }

  private renderOverlay(ctx: CanvasRenderingContext2D): void {
    // 连击显示
    if (this.combo > 1) {
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#ffff00';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffff00';
      ctx.fillText(`${this.combo}x COMBO!`, GAME_CONFIG.width / 2, 100);
      ctx.shadowBlur = 0;
    }

    // 武器等级显示
    if (this.weaponLevel > 1) {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#ff9900';
      ctx.textAlign = 'left';
      ctx.fillText(`武器等级: ${this.weaponLevel}`, 10, GAME_CONFIG.height - 10);
    }

    // Boss警告
    if (this.boss && this.enemies.length === 0) {
      const alpha = Math.abs(Math.sin(Date.now() * 0.003));
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ BOSS BATTLE ⚠️', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
    }
  }

  private updateUI(): void {
    document.getElementById('score')!.textContent = this.score.toString();
    document.getElementById('wave')!.textContent = this.wave.toString();
    document.getElementById('health')!.textContent = this.player.health.toString();

    const healthElement = document.getElementById('health')!.parentElement!;
    if (this.player.health < 30) {
      healthElement.style.borderColor = '#ff0000';
      healthElement.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    } else if (this.player.health < 60) {
      healthElement.style.borderColor = '#ffff00';
      healthElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
    } else {
      healthElement.style.borderColor = '#00ffff';
      healthElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
  }

  private togglePause(): void {
    this.paused = !this.paused;
    document.getElementById('paused')!.classList.toggle('active', this.paused);
  }

  private endGame(): void {
    this.gameOver = true;
    this.saveHighScore();

    document.getElementById('final-score')!.textContent = this.score.toString();
    document.getElementById('enemies-killed')!.textContent = this.enemiesKilled.toString();

    const gameOverDiv = document.getElementById('game-over')!;
    let highScoreText = gameOverDiv.querySelector('.high-score');
    if (!highScoreText) {
      highScoreText = document.createElement('p');
      highScoreText.className = 'high-score';
      (highScoreText as HTMLElement).style.color = '#00ffff';
      gameOverDiv.insertBefore(highScoreText, document.getElementById('restart-btn'));
    }
    highScoreText.textContent = `最高分: ${this.highScore}`;

    gameOverDiv.classList.add('active');
    this.createExplosion(this.player.position.x, this.player.position.y, new Color(0, 200, 255), 50);
  }

  private restart(): void {
    this.player = new Player();
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerups = [];
    this.boss = null;
    this.bossBullets = [];

    this.score = 0;
    this.wave = 1;
    this.enemiesKilled = 0;
    this.enemySpawnTimer = 0;
    this.combo = 0;
    this.comboTimer = 0;

    this.weaponLevel = 1;
    this.hasShield = false;
    this.shieldTimer = 0;
    this.rapidFireTimer = 0;
    GAME_CONFIG.player.fireRate = 0.15;

    this.paused = false;
    this.gameOver = false;

    document.getElementById('game-over')!.classList.remove('active');
    document.getElementById('paused')!.classList.remove('active');

    this.updateUI();
  }

  start(): void {
    console.log('🚀 太空射击游戏 - jsKid引擎版本');
    console.log('✅ 完整游戏系统已启用');
    console.log('🎮 使用方向键移动，空格键射击');
    console.log('💡 P键暂停，R键重启');
    this.engine.start();
  }

  destroy(): void {
    this.engine.destroy();
  }
}

// 启动游戏
const game = new SpaceShooterGame('game-canvas');
game.start();
