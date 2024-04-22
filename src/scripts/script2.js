(function() {
    const wheel = document.querySelector('.wheel');
    const startButton = document.querySelector('.button');
    const messageContainer = document.querySelector('message-container');
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
    });
     function determineArea(deg) {
      const areas = [
        { name: 'Better Luck Next Time!', startDeg: 0, endDeg: 67.49 },
        { name: '👑MAXX WIN!!!👑', startDeg: 67.5, endDeg: 90 },
        { name: 'Better Luck Next Time!', startDeg: 90.01, endDeg: 157.49 },
        { name: 'MINI WIN!', startDeg: 157.5, endDeg: 180 },
        { name: 'Better Luck Next Time!', startDeg: 180.01, endDeg: 247.49 },
        { name: '💎MAJOR WIN!!💎', startDeg: 247.5, endDeg: 270 },
        { name: 'Better Luck Next Time!', startDeg: 270.01, endDeg: 337.49},
        { name: '💰MINOR WIN!💰', startDeg: 337.5, endDeg: 360 },
  
      ];
  
      for (const area of areas) {
        if (deg >= area.startDeg && deg < area.endDeg) {
          return area.name;
        }
      }
  
      return 'Dead center! RE-SPIN!';
    }
  
    function displayMessage(area) {
      const messageContainer = document.getElementById('message-container');
      messageContainer.innerText = `${area}`;
      messageContainer.style.display = 'block';
      setTimeout(() => {
        messageContainer.style.display = 'none';
      }, 3000);
    }
  })();