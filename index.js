const randomColor = () => {
  const r = Math.trunc(Math.random() * 255);
  const g = Math.trunc(Math.random() * 255);
  const b = Math.trunc(Math.random() * 255);
  return { r, g, b };
};

const toRad = (deg) => deg * (Math.PI / 180.0);

const randomRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getPercent = (input, min, max) =>
  ((input - min) * 100) / (max - min) / 100;

const easeOutSine = (x) => Math.sin((x * Math.PI) / 2);

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = document.querySelector("textarea").value.split("\n");

let curDeg = 0;
let step = 360 / items.length;

let colors = [];
for (let i = 0; i < items.length; i++) {
  colors.push(randomColor());
}

function createWheel() {
  curDeg = 0;
  ctx.clearRect(0, 0, width, height);
  items = document.querySelector("textarea").value.split("\n");
  step = 360 / items.length;
  colors = [];
  for (let i = 0; i < items.length; i++) {
    colors.push(randomColor());
  }
  draw();
}

const draw = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
  ctx.fillStyle = `rgba(33, 33, 33)`;
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  let startDeg = curDeg;
  for (let i = 0; i < items.length; i++, startDeg += step) {
    let endDeg = startDeg + step;
    const color = colors[i];

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
    ctx.fillStyle = `rgba(${color.r - 30},${color.g - 30},${color.b - 30})`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 20, toRad(startDeg), toRad(endDeg));
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b})`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(toRad((startDeg + endDeg) / 2));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle =
      color.r > 158 || color.g > 150 || color.b > 150 ? "#000" : "#FFF";
    ctx.font = "bold 24px serif";

    ctx.fillText(items[i], radius / 2 - 15, 0);

    ctx.restore();
  }
};

let afterSpinAngles = {};

// Log angles before spinning
const logBeforeSpinning = () => {
  console.log("Angles Before Spinning:");
  let startDeg = 0;
  for (let i = 0; i < items.length; i++) {
    let endDeg = startDeg + step;
    console.log(
      `Item: ${items[i]}, Start Angle: ${startDeg.toFixed(
        2
      )}°, End Angle: ${endDeg.toFixed(2)}°`
    );
    startDeg = endDeg;
  }
};

// Log angles after spinning
const logAfterSpinning = () => {
  let normalizedDeg = curDeg % 360;
  let startDeg = 0;

  console.log("Angles After Spinning:");
  for (let i = 0; i < items.length; i++) {
    let endDeg = startDeg + step;

    let adjustedStart = (startDeg + normalizedDeg) % 360;
    let adjustedEnd = (endDeg + normalizedDeg) % 360;

    console.log(
      `Item: ${items[i]}, Start Angle: ${adjustedStart.toFixed(
        2
      )}°, End Angle: ${adjustedEnd.toFixed(2)}°`
    );

    afterSpinAngles[items[i]] = {
      startAngle: adjustedStart.toFixed(2),
      endAngle: adjustedEnd.toFixed(2),
    };

    startDeg = endDeg;
  }

  // Determine and display the winner
  let winner = null;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const angle = afterSpinAngles[item];
    if (angle) {
      const startAngle = parseFloat(angle.startAngle);
      const endAngle = parseFloat(angle.endAngle);

      if (startAngle > endAngle) {
        winner = item;
        document.querySelector(".winner").textContent = `Winner: ${winner}`;
        break;
      }
    }
  }
};

let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

const animate = () => {
  if (pause) {
    logAfterSpinning();
    return;
  }
  speed = easeOutSine(getPercent(curDeg, maxRotation, 0)) * 20;
  if (speed < 0.01) {
    logAfterSpinning();
    speed = 0;
    pause = true;
    return;
  }
  curDeg += speed;
  draw();
  window.requestAnimationFrame(animate);
};

const spin = function () {
  if (speed !== 0) {
    return;
  }
  curDeg = 0;
  maxRotation = randomRange(360 * 3, 360 * 6);
  pause = false;

  // Log angles before spinning
  logBeforeSpinning();

  window.requestAnimationFrame(animate);
};

draw();
