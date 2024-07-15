const BALL_SIZE = 12;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1300;
const PEG_X = 46;
const PEG_Y = 46;
const BUCKET_COLOR = '#633dd4';
const HIGHLIGHT_COLOR = '#ffcc00';
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

const ground = Bodies.rectangle(
  CANVAS_WIDTH / 2,
  CANVAS_HEIGHT,
  CANVAS_WIDTH * 3,
  50,
  {
    id: 999,
    isStatic: true,
    collisionFilter: { group: 'ground' }
  }
);
const ground2 = Bodies.rectangle(0, CANVAS_HEIGHT, CANVAS_WIDTH * 3, 50, {
  id: 9999,
  isStatic: true,
  collisionFilter: { group: 'ground' }
});

const pegs = [];
const pegRadius = 5;
for (let i = 1; i < CANVAS_HEIGHT / PEG_Y - 2; i++) {  // Skip the last row
  for (let j = 1; j < CANVAS_WIDTH / PEG_X + 1; j++) {
    let x = j * PEG_X - BALL_SIZE * 1.5;
    const y = i * PEG_Y;

    if (i % 2 == 0) {
      x -= PEG_X / 2;
    }

    const peg = Bodies.circle(x, y, pegRadius, {
      isStatic: true,
      render: {
        fillStyle: '#a831d4',
        strokeStyle: '#7b0da3',
        lineWidth: 2
      }
    });
    pegs.push(peg);
  }
}

const leftWall = Bodies.rectangle(
  -1,
  CANVAS_HEIGHT / 2 + BALL_SIZE * 2,
  1,
  CANVAS_HEIGHT * 2,
  {
    isStatic: true
  }
);
const rightWall = Bodies.rectangle(
  CANVAS_WIDTH + 1,
  CANVAS_HEIGHT / 2 + BALL_SIZE * 2,
  1,
  CANVAS_HEIGHT * 2,
  {
    isStatic: true
  }
);

const buckets = [];
const bucketIdRange = [];
const bucketWidth = CANVAS_WIDTH / 16;
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
    bucketWidth * i,
    CANVAS_HEIGHT - bucketHeight,
    2,
    CANVAS_HEIGHT / 9,
    {
      isStatic: true,
      render: {
        fillStyle: '#633dd4'
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
  leftWall,
  rightWall
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

  const ball = Bodies.circle(dropX, BALL_SIZE, BALL_SIZE, {
    restitution: 0.9,
    friction: 0.01,
    frictionAir: 0.02,
    collisionFilter: { group: 'ball' }
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
