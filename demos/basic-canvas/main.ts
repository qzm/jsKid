/**
 * Canvas基础绘图演示
 * 展示Canvas 2D API的各种基础绘图功能
 */

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const stats = document.getElementById('stats')!;

// 演示状态
let currentDemo = 0;
let animationId: number | null = null;
let time = 0;
let isRunning = false;

// 演示列表
const demos = [
  { name: '基础图形', func: demoBasicShapes },
  { name: '路径绘制', func: demoPaths },
  { name: '变换操作', func: demoTransforms },
  { name: '渐变与阴影', func: demoGradientsAndShadows },
  { name: '文本渲染', func: demoText },
  { name: '图像处理', func: demoImages },
  { name: '动画效果', func: demoAnimation }
];

// ==================== 演示1: 基础图形 ====================
function demoBasicShapes(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 矩形
  ctx.fillStyle = '#3498db';
  ctx.fillRect(50, 50, 100, 80);

  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 3;
  ctx.strokeRect(200, 50, 100, 80);

  // 圆形
  ctx.fillStyle = '#2ecc71';
  ctx.beginPath();
  ctx.arc(400, 90, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(520, 90, 40, 0, Math.PI * 2);
  ctx.stroke();

  // 圆弧
  ctx.strokeStyle = '#9b59b6';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(650, 90, 40, 0, Math.PI * 1.5);
  ctx.stroke();

  // 椭圆
  ctx.fillStyle = '#1abc9c';
  ctx.beginPath();
  ctx.ellipse(100, 250, 60, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // 圆角矩形
  drawRoundRect(ctx, 250, 210, 120, 80, 10);
  ctx.fillStyle = '#34495e';
  ctx.fill();

  // 标注
  ctx.fillStyle = '#2c3e50';
  ctx.font = '14px Arial';
  ctx.fillText('填充矩形', 60, 150);
  ctx.fillText('描边矩形', 210, 150);
  ctx.fillText('填充圆', 370, 150);
  ctx.fillText('描边圆', 490, 150);
  ctx.fillText('圆弧', 630, 150);
  ctx.fillText('椭圆', 70, 320);
  ctx.fillText('圆角矩形', 260, 320);
}

// ==================== 演示2: 路径绘制 ====================
function demoPaths(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 直线
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(200, 50);
  ctx.lineTo(200, 150);
  ctx.lineTo(50, 150);
  ctx.closePath();
  ctx.stroke();

  // 曲线路径
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(250, 50);
  ctx.quadraticCurveTo(300, 0, 350, 50);
  ctx.quadraticCurveTo(400, 100, 350, 150);
  ctx.quadraticCurveTo(300, 200, 250, 150);
  ctx.stroke();

  // 贝塞尔曲线
  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(450, 50);
  ctx.bezierCurveTo(500, 20, 550, 180, 600, 150);
  ctx.stroke();

  // 绘制控制点
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(500 - 3, 20 - 3, 6, 6);
  ctx.fillRect(550 - 3, 180 - 3, 6, 6);

  // 星形
  drawStar(ctx, 150, 350, 5, 50, 25);
  ctx.fillStyle = '#f39c12';
  ctx.fill();

  // 多边形
  drawPolygon(ctx, 350, 350, 40, 6);
  ctx.strokeStyle = '#9b59b6';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 螺旋线
  drawSpiral(ctx, 550, 350, 5, 40, 0.2);
  ctx.strokeStyle = '#1abc9c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 标注
  ctx.fillStyle = '#2c3e50';
  ctx.font = '14px Arial';
  ctx.fillText('直线路径', 100, 180);
  ctx.fillText('二次曲线', 280, 180);
  ctx.fillText('贝塞尔曲线', 480, 180);
  ctx.fillText('星形', 120, 420);
  ctx.fillText('多边形', 320, 420);
  ctx.fillText('螺旋线', 520, 420);
}

// ==================== 演示3: 变换操作 ====================
function demoTransforms(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 平移
  ctx.save();
  ctx.translate(100, 100);
  ctx.fillStyle = '#3498db';
  ctx.fillRect(-25, -25, 50, 50);
  ctx.fillStyle = '#2c3e50';
  ctx.font = '12px Arial';
  ctx.fillText('平移', -15, 50);
  ctx.restore();

  // 旋转
  ctx.save();
  ctx.translate(250, 100);
  ctx.rotate(Math.PI / 6);
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(-25, -25, 50, 50);
  ctx.rotate(-Math.PI / 6);
  ctx.fillStyle = '#2c3e50';
  ctx.font = '12px Arial';
  ctx.fillText('旋转30°', -20, 50);
  ctx.restore();

  // 缩放
  ctx.save();
  ctx.translate(400, 100);
  ctx.scale(1.5, 1.5);
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(-25, -25, 50, 50);
  ctx.restore();
  ctx.fillStyle = '#2c3e50';
  ctx.font = '12px Arial';
  ctx.fillText('缩放1.5x', 360, 150);

  // 倾斜
  ctx.save();
  ctx.translate(550, 100);
  ctx.transform(1, 0.5, 0, 1, 0, 0);
  ctx.fillStyle = '#f39c12';
  ctx.fillRect(-25, -25, 50, 50);
  ctx.restore();
  ctx.fillStyle = '#2c3e50';
  ctx.font = '12px Arial';
  ctx.fillText('倾斜', 530, 150);

  // 组合变换 - 旋转的多边形
  const numShapes = 8;
  const radius = 80;
  for (let i = 0; i < numShapes; i++) {
    const angle = (Math.PI * 2 * i) / numShapes + time * 0.5;

    ctx.save();
    ctx.translate(
      centerX + Math.cos(angle) * radius,
      centerY + 50 + Math.sin(angle) * radius
    );
    ctx.rotate(angle + time);

    const hue = (i * 360) / numShapes;
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
    ctx.fillRect(-15, -15, 30, 30);

    ctx.restore();
  }

  ctx.fillStyle = '#2c3e50';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('组合变换 - 旋转动画', centerX, centerY + 150);
}

// ==================== 演示4: 渐变与阴影 ====================
function demoGradientsAndShadows(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 线性渐变
  const linearGrad = ctx.createLinearGradient(50, 50, 200, 150);
  linearGrad.addColorStop(0, '#3498db');
  linearGrad.addColorStop(1, '#e74c3c');
  ctx.fillStyle = linearGrad;
  ctx.fillRect(50, 50, 150, 100);

  // 径向渐变
  const radialGrad = ctx.createRadialGradient(325, 100, 10, 325, 100, 60);
  radialGrad.addColorStop(0, '#f39c12');
  radialGrad.addColorStop(1, '#e74c3c');
  ctx.fillStyle = radialGrad;
  ctx.beginPath();
  ctx.arc(325, 100, 60, 0, Math.PI * 2);
  ctx.fill();

  // 锥形渐变（如果支持）
  if (ctx.createConicGradient) {
    const conicGrad = ctx.createConicGradient(0, 500, 100);
    conicGrad.addColorStop(0, '#e74c3c');
    conicGrad.addColorStop(0.25, '#f39c12');
    conicGrad.addColorStop(0.5, '#2ecc71');
    conicGrad.addColorStop(0.75, '#3498db');
    conicGrad.addColorStop(1, '#e74c3c');
    ctx.fillStyle = conicGrad;
    ctx.beginPath();
    ctx.arc(500, 100, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  // 外阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#9b59b6';
  ctx.fillRect(100, 250, 120, 80);

  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 内阴影效果（通过反向裁剪实现）
  ctx.save();
  ctx.fillStyle = '#1abc9c';
  ctx.fillRect(300, 250, 120, 80);

  ctx.globalCompositeOperation = 'source-atop';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = -3;
  ctx.shadowOffsetY = -3;
  ctx.fillRect(300, 250, 120, 80);
  ctx.restore();

  // 发光效果
  ctx.shadowColor = '#f39c12';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#f39c12';
  ctx.beginPath();
  ctx.arc(550, 290, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 标注
  ctx.fillStyle = '#2c3e50';
  ctx.font = '14px Arial';
  ctx.fillText('线性渐变', 90, 170);
  ctx.fillText('径向渐变', 280, 170);
  if (ctx.createConicGradient) {
    ctx.fillText('锥形渐变', 460, 170);
  }
  ctx.fillText('外阴影', 120, 350);
  ctx.fillText('内阴影', 320, 350);
  ctx.fillText('发光效果', 520, 350);
}

// ==================== 演示5: 文本渲染 ====================
function demoText(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 基础文本
  ctx.fillStyle = '#2c3e50';
  ctx.font = '24px Arial';
  ctx.fillText('填充文本', 50, 50);

  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2;
  ctx.font = '24px Arial';
  ctx.strokeText('描边文本', 50, 100);

  // 不同字体
  const fonts = ['Arial', 'Georgia', 'Courier New', 'Impact', 'Comic Sans MS'];
  fonts.forEach((font, index) => {
    ctx.fillStyle = '#34495e';
    ctx.font = `20px ${font}`;
    ctx.fillText(`字体: ${font}`, 50, 150 + index * 35);
  });

  // 文本对齐
  const centerX = 550;
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, 50);
  ctx.lineTo(centerX, 300);
  ctx.stroke();

  const alignments: CanvasTextAlign[] = ['left', 'center', 'right', 'start', 'end'];
  alignments.forEach((align, index) => {
    ctx.fillStyle = '#2c3e50';
    ctx.font = '16px Arial';
    ctx.textAlign = align;
    ctx.fillText(`对齐: ${align}`, centerX, 80 + index * 40);
  });

  // 文本基线
  ctx.textAlign = 'left';
  const baselineY = 450;
  ctx.strokeStyle = '#2ecc71';
  ctx.beginPath();
  ctx.moveTo(50, baselineY);
  ctx.lineTo(750, baselineY);
  ctx.stroke();

  const baselines: CanvasTextBaseline[] = ['top', 'middle', 'bottom', 'alphabetic', 'hanging'];
  baselines.forEach((baseline, index) => {
    ctx.fillStyle = '#2c3e50';
    ctx.font = '16px Arial';
    ctx.textBaseline = baseline;
    ctx.fillText(baseline, 80 + index * 130, baselineY);
  });

  // 文本度量
  ctx.textBaseline = 'top';
  const text = '测量文本宽度';
  ctx.font = '20px Arial';
  const metrics = ctx.measureText(text);
  ctx.fillStyle = '#34495e';
  ctx.fillText(text, 50, 500);
  ctx.strokeStyle = '#e74c3c';
  ctx.strokeRect(50, 500, metrics.width, 20);
  ctx.fillStyle = '#e74c3c';
  ctx.font = '12px Arial';
  ctx.fillText(`宽度: ${metrics.width.toFixed(2)}px`, 50, 530);
}

// ==================== 演示6: 图像处理 ====================
function demoImages(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 创建临时canvas作为图像源
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 100;
  tempCanvas.height = 100;
  const tempCtx = tempCanvas.getContext('2d')!;

  // 绘制一个渐变图像
  const grad = tempCtx.createLinearGradient(0, 0, 100, 100);
  grad.addColorStop(0, '#3498db');
  grad.addColorStop(1, '#e74c3c');
  tempCtx.fillStyle = grad;
  tempCtx.fillRect(0, 0, 100, 100);
  tempCtx.fillStyle = '#fff';
  tempCtx.font = 'bold 40px Arial';
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'middle';
  tempCtx.fillText('IMG', 50, 50);

  // 绘制原始图像
  ctx.drawImage(tempCanvas, 50, 50);
  ctx.strokeStyle = '#2c3e50';
  ctx.strokeRect(50, 50, 100, 100);
  ctx.fillStyle = '#2c3e50';
  ctx.font = '14px Arial';
  ctx.fillText('原始图像', 70, 170);

  // 缩放图像
  ctx.drawImage(tempCanvas, 200, 50, 150, 150);
  ctx.strokeRect(200, 50, 150, 150);
  ctx.fillText('缩放图像', 240, 220);

  // 裁剪图像
  ctx.drawImage(tempCanvas, 25, 25, 50, 50, 400, 50, 100, 100);
  ctx.strokeRect(400, 50, 100, 100);
  ctx.fillText('裁剪图像', 420, 170);

  // 图像操作 - 获取像素数据
  const imageData = ctx.getImageData(50, 50, 100, 100);
  const data = imageData.data;

  // 反色效果
  const invertedData = ctx.createImageData(100, 100);
  for (let i = 0; i < data.length; i += 4) {
    invertedData.data[i] = 255 - data[i];       // R
    invertedData.data[i + 1] = 255 - data[i + 1]; // G
    invertedData.data[i + 2] = 255 - data[i + 2]; // B
    invertedData.data[i + 3] = data[i + 3];      // A
  }
  ctx.putImageData(invertedData, 50, 250);
  ctx.strokeRect(50, 250, 100, 100);
  ctx.fillText('反色效果', 70, 370);

  // 灰度效果
  const grayData = ctx.createImageData(100, 100);
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    grayData.data[i] = gray;
    grayData.data[i + 1] = gray;
    grayData.data[i + 2] = gray;
    grayData.data[i + 3] = data[i + 3];
  }
  ctx.putImageData(grayData, 200, 250);
  ctx.strokeRect(200, 250, 100, 100);
  ctx.fillText('灰度效果', 220, 370);

  // 模糊效果（简单box blur）
  const blurData = ctx.createImageData(100, 100);
  const radius = 2;
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      let r = 0, g = 0, b = 0, count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < 100 && ny >= 0 && ny < 100) {
            const i = (ny * 100 + nx) * 4;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
      }

      const i = (y * 100 + x) * 4;
      blurData.data[i] = r / count;
      blurData.data[i + 1] = g / count;
      blurData.data[i + 2] = b / count;
      blurData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(blurData, 350, 250);
  ctx.strokeRect(350, 250, 100, 100);
  ctx.fillText('模糊效果', 370, 370);

  // 透明度调整
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(tempCanvas, 500, 250);
  ctx.restore();
  ctx.strokeRect(500, 250, 100, 100);
  ctx.fillText('半透明', 525, 370);
}

// ==================== 演示7: 动画效果 ====================
function demoAnimation(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 波浪效果
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = centerY + Math.sin(x * 0.02 + time * 2) * 30 + Math.cos(x * 0.03 + time) * 20;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // 旋转的方块
  const numSquares = 12;
  for (let i = 0; i < numSquares; i++) {
    const angle = (Math.PI * 2 * i) / numSquares + time;
    const radius = 150;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 2);

    const hue = (i * 360) / numSquares;
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
    ctx.fillRect(-15, -15, 30, 30);

    ctx.restore();
  }

  // 脉动圆
  const pulseRadius = 30 + Math.sin(time * 3) * 20;
  ctx.fillStyle = `rgba(231, 76, 60, ${0.5 + Math.sin(time * 3) * 0.3})`;
  ctx.beginPath();
  ctx.arc(100, 100, pulseRadius, 0, Math.PI * 2);
  ctx.fill();

  // 弹跳球
  const bounceY = 500 + Math.abs(Math.sin(time * 2)) * -150;
  ctx.fillStyle = '#2ecc71';
  ctx.beginPath();
  ctx.arc(700, bounceY, 20, 0, Math.PI * 2);
  ctx.fill();

  // 路径动画
  const pathPoints = 50;
  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < pathPoints; i++) {
    const t = i / pathPoints;
    const angle = t * Math.PI * 4 + time;
    const radius = t * 100;
    const x = 150 + Math.cos(angle) * radius;
    const y = 500 + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // 文本动画
  ctx.save();
  ctx.translate(centerX, 100);
  ctx.scale(1 + Math.sin(time * 2) * 0.2, 1 + Math.sin(time * 2) * 0.2);
  ctx.fillStyle = '#9b59b6';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('jsKid 2.0 动画演示', 0, 0);
  ctx.restore();
}

// ==================== 辅助函数 ====================
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
): void {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  sides: number
): void {
  const angle = (Math.PI * 2) / sides;

  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const x = cx + Math.cos(angle * i - Math.PI / 2) * radius;
    const y = cy + Math.sin(angle * i - Math.PI / 2) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

function drawSpiral(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  startRadius: number,
  endRadius: number,
  tightness: number
): void {
  const steps = 100;

  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const angle = tightness * i;
    const radius = startRadius + (endRadius - startRadius) * (i / steps);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
}

// ==================== 控制函数 ====================
function startDemo(): void {
  if (!isRunning) {
    isRunning = true;
    animate();
  }
}

function stopDemo(): void {
  isRunning = false;
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function nextDemo(): void {
  currentDemo = (currentDemo + 1) % demos.length;
  updateDemo();
}

function prevDemo(): void {
  currentDemo = (currentDemo - 1 + demos.length) % demos.length;
  updateDemo();
}

function updateDemo(): void {
  time = 0;
  demos[currentDemo].func();
  updateStats();
}

function animate(): void {
  if (!isRunning) return;

  time += 0.016; // ~60fps
  demos[currentDemo].func();
  updateStats();

  animationId = requestAnimationFrame(animate);
}

function updateStats(): void {
  stats.innerHTML = `
    演示: ${demos[currentDemo].name} (${currentDemo + 1}/${demos.length})<br>
    状态: ${isRunning ? '运行中' : '已暂停'}<br>
    FPS: ~60<br>
    Canvas大小: ${canvas.width}x${canvas.height}
  `;
}

// ==================== 事件绑定 ====================
document.getElementById('startBtn')?.addEventListener('click', startDemo);
document.getElementById('stopBtn')?.addEventListener('click', stopDemo);
document.getElementById('nextBtn')?.addEventListener('click', nextDemo);
document.getElementById('prevBtn')?.addEventListener('click', prevDemo);

// 键盘快捷键
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (isRunning) {
      stopDemo();
    } else {
      startDemo();
    }
  } else if (e.code === 'ArrowRight') {
    nextDemo();
  } else if (e.code === 'ArrowLeft') {
    prevDemo();
  }
});

// ==================== 初始化 ====================
console.log('🎨 Canvas基础绘图演示加载完成');
console.log('💡 使用左右箭头键切换演示，空格键开始/暂停');

// 显示第一个演示
updateDemo();
