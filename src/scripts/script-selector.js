import clashWheelImg from "../img/clash-wheel.png";
import bigWheelImg from "../img/big-wheel.png";
import rainWheelImg from "../img/rain-wheel.png";
import clashMarker from "../img/CLASH-MARKER.png";
import bigMarker from "../img/BIG-MARKER.png";
import rainMarker from "../img/RAIN-MARKER.png";
import clashButton from "../img/clash-button.png"
import bigButton from "../img/big-button.png"
import rainButton from "../img/rain-button.png"

(function () {
    const wheel = document.querySelector('.wheel');
    const startButton = document.querySelector('.button');
    const messageContainer = document.querySelector('.message-container');
    const latestRollsContainer = document.getElementById('latest-rolls-container');

    const wheel1Image = document.getElementById("wheel1-img");
    const wheel2Image = document.getElementById("wheel2-img");
    const wheel3Image = document.getElementById("wheel3-img");
    const marker = document.querySelector('.marker');
    const button = document.querySelector('.button');

    let deg = 0;

    const wheelConfigurations = {
        wheel1: [
            { name: '25 Gems Tip', startDeg: 0, endDeg: 9 },
            { name: '5 Gems Tip', startDeg: 9, endDeg: 72 },
            { name: '10 Gems Tip', startDeg: 72, endDeg: 135 },
            { name: '50 Battle 20%', startDeg: 135, endDeg: 180 },
            { name: '25 Gems Tip', startDeg: 180, endDeg: 189 },
            { name: '5 Gems Tip', startDeg: 189, endDeg: 252 },
            { name: '10 Gems Tip', startDeg: 252, endDeg: 315 },
            { name: '30 Battle 30%', startDeg: 315, endDeg: 360 },
        ],
        wheel2: [
            { name: '25 Coins Tip', startDeg: 0, endDeg: 9 },
            { name: '5 Coins Tip', startDeg: 9, endDeg: 72 },
            { name: '10 Coins Tip', startDeg: 72, endDeg: 135 },
            { name: '50 Battle 20%', startDeg: 135, endDeg: 180 },
            { name: '25 Coins Tip', startDeg: 180, endDeg: 189 },
            { name: '5 Coins Tip', startDeg: 189, endDeg: 252 },
            { name: '10 Coins Tip', startDeg: 252, endDeg: 315 },
            { name: '30 Battle 30%', startDeg: 315, endDeg: 360 },
        ],
        wheel3: [
            { name: '25 Coins Tip', startDeg: 0, endDeg: 9 },
            { name: '5 Coins Tip', startDeg: 9, endDeg: 72 },
            { name: '10 Coins Tip', startDeg: 72, endDeg: 135 },
            { name: '50 Battle 20%', startDeg: 135, endDeg: 180 },
            { name: '25 Coins Tip', startDeg: 180, endDeg: 189 },
            { name: '5 Coins Tip', startDeg: 189, endDeg: 252 },
            { name: '10 Coins Tip', startDeg: 252, endDeg: 315 },
            { name: '30 Battle 30%', startDeg: 315, endDeg: 360 },
        ],
    };

    let currentWheel = 'wheel1';

    function setWheel(wheelId, wheelImage) {
        currentWheel = wheelId;
        wheel.src = wheelImage;
        updateMarker(wheelId);
        updateButton(wheelId);
    }
    function updateMarker(wheelId) {
        if (wheelId === 'wheel1') {
            marker.src = clashMarker;
        } else if (wheelId === 'wheel2') {
            marker.src = bigMarker;
        } else if (wheelId === 'wheel3') {
            marker.src = rainMarker;
        }
    }
    function updateButton(wheelId) {
        if (wheelId === 'wheel1') {
            button.src = clashButton;
        } else if (wheelId === 'wheel2') {
            button.src = bigButton;
        } else if (wheelId === 'wheel3') {
            button.src = rainButton;
        }
    }
  
    wheel1Image.src = clashWheelImg;
    wheel2Image.src = bigWheelImg;
    wheel3Image.src = rainWheelImg;

    wheel1Image.addEventListener('click', () => {
        setWheel('wheel1', clashWheelImg);
    });

    wheel2Image.addEventListener('click', () => {
        setWheel('wheel2', bigWheelImg);
    });

    wheel3Image.addEventListener('click', () => {
        setWheel('wheel3', rainWheelImg);
    });

    // Start button event listener
    startButton.addEventListener('click', () => {
        startButton.style.pointerEvents = 'none';
        deg = Math.floor(1000 + Math.random() * 1000);
        wheel.style.transition = 'all 5s ease-out';
        wheel.style.transform = `rotate(${deg}deg)`;
        wheel.classList.add('blur');
    });

    // Transition end event
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
        const areas = wheelConfigurations[currentWheel]; // Use current wheel's areas
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
            proceedButton.onclick = function () {
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
