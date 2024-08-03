(function() {
  const wheel = document.querySelector('.wheel');
  const startButton = document.querySelector('.button');
  const messageContainer = document.querySelector('.message-container');
  const latestRollsContainer = document.getElementById('latest-rolls-container');
  let deg = 0;

  startButton.addEventListener('click', () => {
    startButton.style.pointerEvents = 'none';
    deg = Math.floor(1000 + Math.random() * 1000);
    wheel.style.transition = 'all 5s ease-out';
    wheel.style.transform = `rotate(${deg}deg)`;
    wheel.classList.add('blur');
  });

  wheel.addEventListener('transitionend', () => {
    wheel.classList.remove('blur');
    startButton.style.pointerEvents = 'auto';
    wheel.style.transition = 'none';
    const actualDeg = deg % 360;
    wheel.style.transform = `rotate(${actualDeg}deg)`;

    const area = determineArea(actualDeg);
    displayMessage(area);
    updateLatestRolls(area);
    displayLatestRolls();
  });

  function determineArea(deg) {
    const areas = [
      { name: 'Try Again', startDeg: 0, endDeg: 22.49 },
      { name: '10$ Depo Shuffle', startDeg: 22.5, endDeg: 45 },
      { name: 'Try Again', startDeg: 45.01, endDeg: 67.49 },
      { name: 'Kevin Spin', startDeg: 67.5, endDeg: 90 },
      { name: 'Try Again', startDeg: 90.01, endDeg: 112.49 },
      { name: 'Clash 50 Battle 30%', startDeg: 112.5, endDeg: 135 },
      { name: 'Try Again', startDeg: 135.01, endDeg: 157.49 },
      { name: 'Match The Cards - Shuffle', startDeg: 157.5, endDeg: 180 },
      { name: 'Try Again', startDeg: 180.01, endDeg: 202.49 },
      { name: '20$ Buy, Keep Half', startDeg: 202.5, endDeg: 225 },
      { name: 'Try Again', startDeg: 225.01, endDeg: 247.49 },
      { name: 'Rain.gg 10$ Depo', startDeg: 247.5, endDeg: 270 },
      { name: 'Try Again', startDeg: 270.01, endDeg: 292.49 },
      { name: 'Clash 30 Battle 30%', startDeg: 292.5, endDeg: 315 },
      { name: 'Try Again', startDeg: 315.01, endDeg: 337.49 },
      { name: 'Match The Cards - Shuffle', startDeg: 337.5, endDeg: 360 },
    ];

    for (const area of areas) {
      if (deg >= area.startDeg && deg < area.endDeg) {
        return area.name;
      }
    }

    return 'Dead center, RE-SPIN!';
  }

  function displayMessage(area) {
    if (area === 'Kevin Spin') {
      const proceedButton = document.createElement('button');
      messageContainer.innerText = `You have won a Kevin Spin!`;
      messageContainer.style.display = 'block';
      proceedButton.innerText = 'Proceed';
      proceedButton.onclick = function() {
        window.location.href = '/src/kevin-spin.html';
      };
      messageContainer.appendChild(document.createElement('br'));
      messageContainer.appendChild(proceedButton);
    } else {
      messageContainer.innerText = `${area}`;
      messageContainer.style.display = 'block';
      setTimeout(() => {
        messageContainer.style.display = 'none';
      }, 3000);
    }
  }

  let latestRolls = JSON.parse(localStorage.getItem('latestRolls')) || [];

  function updateLatestRolls(roll) {
    latestRolls.unshift(roll);

    if (latestRolls.length > 5) {
      latestRolls.pop();
    }
    localStorage.setItem('latestRolls', JSON.stringify(latestRolls));
    displayLatestRolls();
  }

  function displayLatestRolls() {
    latestRollsContainer.innerHTML = '';

    const ul = document.createElement('ul');

    latestRolls.forEach(roll => {
      const li = document.createElement('li');
      li.textContent = roll;
      ul.appendChild(li);
    });

    latestRollsContainer.appendChild(ul);
  }

  displayLatestRolls();
})();
