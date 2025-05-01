const BALL_SIZE = 12;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 700;
const PEG_X = 46;
const PEG_Y = 46;
const BUCKET_COLOR = 'rgba(0, 200, 0, 0.2)';
const HIGHLIGHT_COLOR = '#4cd316';
const COLORS = [
  '#d1db09',
  '#f01653',
  '#46d11f',

];

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Events = Matter.Events,
  Body = Matter.Body;

const engine = Engine.create({
  timing: { timeScale: 0.5 }
});
const render = Render.create({
  element: document.querySelector('.target'),
  engine: engine,
  options: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    wireframes: false,
    background: 'transparent'
  }
});

const prizePool = [
  { value: "0", weight: 300 },
  { value: "2,5$", weight: 200 },
  { value: "5$", weight: 150 },
  { value: "7,5$", weight: 100 },
  { value: "10$", weight: 100 },
  { value: "15$", weight: 75 },
  { value: "20$", weight: 40 },
  { value: "25$", weight: 25 },
  { value: "50$", weight: 15 },
  { value: "75$", weight: 10 },
  { value: "100$", weight: 5 },
  { value: "Sub", weight: 150 },
];

function getRandomPrize() {
  const totalWeight = prizePool.reduce((sum, prize) => sum + prize.weight, 0);
  let random = Math.random() * totalWeight;
  for (const prize of prizePool) {
    if (random < prize.weight) return prize.value;
    random -= prize.weight;
  }
}

function spawnParticles(x, y, count = 12) {
  const container = document.getElementById("particle-container");
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const angle = Math.random() * 2 * Math.PI;
    const radius = 60 + Math.random() * 40;
    particle.style.setProperty("--x", `${Math.cos(angle) * radius}px`);
    particle.style.setProperty("--y", `${Math.sin(angle) * radius}px`);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    container.appendChild(particle);

    setTimeout(() => particle.remove(), 700);
  }
}

const ground = Bodies.rectangle(
  CANVAS_WIDTH / 2,
  CANVAS_HEIGHT,
  CANVAS_WIDTH * 3,
  50,
  {
    id: 999,
    isStatic: true,
    collisionFilter: { group: 'ground' },
    render: {
      visible: false 
    }
  }
);
const ground2 = Bodies.rectangle(0, CANVAS_HEIGHT, CANVAS_WIDTH * 3, 50, {
  id: 9999,
  isStatic: true,
  collisionFilter: { group: 'ground' },
  render: {
    visible: false
  }
});

const pegs = [];
const pegRadius = 6;
const numRows = 15; 
for (let row = 0; row < numRows; row++) {
  const pegsInRow = row + 1;
  const y = (row + 1) * PEG_Y;

  for (let i = 0; i < pegsInRow; i++) {
    const totalWidth = (pegsInRow - 1) * PEG_X;
    const x = (CANVAS_WIDTH / 2 - totalWidth / 2) + i * PEG_X;

    const peg = Bodies.circle(x, y, pegRadius, {
      isStatic: true,
      render: {
        fillStyle: '#4cd316',
        strokeStyle: '#4cd316',
        lineWidth: 2
      }
    });
    pegs.push(peg);
  }
}

const wallLength = 900;
const angle = Math.atan((PEG_Y * numRows) / (PEG_X * (numRows / 2))); 

const leftFunnelWall = Bodies.rectangle(
  CANVAS_WIDTH / 2 - (PEG_X * numRows / 2) + 145,
  CANVAS_HEIGHT / 2 ,
  wallLength,
  20,
  {
    isStatic: true,
    angle: -angle,
    render: {
      fillStyle: 'rgba(0, 200, 0, 0.2)',
      visible: true
    }
  }
);

const rightFunnelWall = Bodies.rectangle(
  CANVAS_WIDTH / 2 + (PEG_X * numRows / 2) - 145,
  CANVAS_HEIGHT / 2 ,
  wallLength,
  20,
  {
    isStatic: true,
    angle: angle,
    render: {
      fillStyle: 'rgba(0, 200, 0, 0.2)',
      visible: true
    }
  }
);

const bucketWrappers = document.querySelectorAll(".bucket-wrapper");

async function randomizePrizesSequentially() {
  for (let i = 0; i < bucketWrappers.length; i++) {
    const wrapper = bucketWrappers[i];
    const prize = getRandomPrize();
    const label = wrapper.querySelector("div:last-child");

    label.style.opacity = 0;
    label.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    label.style.transform = "scale(1.3)";

    await new Promise(resolve => setTimeout(resolve, 100)); 


    label.textContent = prize;
    label.style.opacity = 1;
    label.style.transform = "scale(1)";
    
    const rect = label.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    await new Promise(resolve => setTimeout(resolve, 150)); 
  }
}
document.getElementById("randomize-btn").addEventListener("click", randomizePrizesSequentially);


const buckets = [];
const bucketIdRange = [];
const bucketWidth = CANVAS_WIDTH / 8;
const bucketHeight = BALL_SIZE * 3;
for (let i = 0; i < 16; i++) {
  const bucket = Bodies.rectangle(
    bucketWidth * i + bucketWidth * 0.5,
    CANVAS_HEIGHT - bucketHeight,
    bucketWidth,
    bucketHeight,
    {
      id: i,
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: BUCKET_COLOR
      },
      collisionFilter: {
        group: 'bucket'
      }
    }
  );
  const divider = Bodies.rectangle(
    bucketWidth * i ,
    CANVAS_HEIGHT - bucketHeight,
    8,
    CANVAS_HEIGHT / 16,
    {
      isStatic: true,
      render: {
        fillStyle: '#4cd316'
      },
      collisionFilter: { group: 'bucket' }
    }
  );
  bucketIdRange.push(i);
  buckets.push(bucket);
  buckets.push(divider);
}

World.add(engine.world, [
  ground2,
  ...pegs,
  ...buckets,
  ground,
  leftFunnelWall,
  rightFunnelWall
]);
Engine.run(engine);
Render.run(render);
let ballCount = 0;

function dropBall() {
  ballCount++;
  if (ballCount > 785) {
    ballCount--;
    return;
  }

  const dropX = CANVAS_WIDTH / 2;
  const dropY = PEG_Y * 1.5;

  const ball = Bodies.circle(dropX, dropY, BALL_SIZE, {
    restitution: 0.9,
    friction: 0.01,
    frictionAir: 0.02,
    collisionFilter: { group: 'ball' },
    render: {
      fillStyle:'#FFFFFF'
    }
  });

  Body.setVelocity(ball, {
    x: (Math.random() - 0.5) * 1,
    y: (Math.random() - 0.5) * 1
  });

  ball.size = BALL_SIZE;
  ball.restitution = 0.9;
  ball.dropX = dropX;

  World.add(engine.world, ball);
}

const canvas = document.querySelector('canvas');
canvas.addEventListener('click', dropBall);

Events.on(engine, 'collisionActive', ({ pairs }) => {
  pairs.forEach(pair => {
    if (
      (bucketIdRange.includes(pair.bodyA.id) ||
        bucketIdRange.includes(pair.bodyB.id)) &&
      Math.abs(pair.bodyB.velocity.y) < 0.1 &&
      pair.bodyB.position.y > CANVAS_HEIGHT - 200
    ) {
      World.remove(engine.world, pair.bodyB);
      ballCount--;
      const bucketId = bucketIdRange.includes(pair.bodyA.id) ? pair.bodyA.id : pair.bodyB.id;

      buckets[bucketId * 2].render.fillStyle = HIGHLIGHT_COLOR;

      setTimeout(() => {
        buckets[bucketId * 2].render.fillStyle = BUCKET_COLOR;
      }, 2000);
    }
  });
});
