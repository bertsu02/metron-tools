const tagsEl = document.getElementById("tags");
const textarea = document.getElementById("textarea");
const winnerDisplay = document.getElementById("winner-display");
const rollButton = document.getElementById("roll-button");
let tagsArray = [];

textarea.focus();

textarea.addEventListener("keyup", (e) => {
  createTags(e.target.value);
});

rollButton.addEventListener("click", () => {
  randomSelect();
});

function createTags(input) {
  tagsArray = input
    .split("\n")
    .filter((tag) => tag.trim() !== "")
    .map((tag) => tag.trim());

  tagsEl.innerHTML = '';

  tagsArray.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.classList.add('tag');
    tagEl.innerText = tag;
    tagsEl.appendChild(tagEl);
  });
}

function randomSelect() {
  const highlightTime = 15;
  const intervalTime = 75;
  const timesfetch = highlightTime + 1
  // We need 'times' random numbers for the intermediate selections 
  // plus 1 more for the final selection. 
  
  // Fetch all random numbers at once
  fetchRandomIntegers(timesfetch)
    .then(randomNumbers => {
      // Once we have the numbers, start the interval
      const interval = setInterval(() => {
        const randomTag = pickRandomTag(randomNumbers);
        if (randomTag) {
          highlightTag(randomTag);
          setTimeout(() => unHighlightTag(randomTag), intervalTime);
        }
      }, intervalTime);

      setTimeout(() => {
        clearInterval(interval);

        // After the interval completes, pick the final winner
        setTimeout(() => {
          const randomTag = pickRandomTag(randomNumbers);
          if (randomTag) {
            highlightTag(randomTag);
            displayWinner(randomTag);
            removeWinner(randomTag);
          } else {
            console.warn('No valid tag was selected.');
          }
        }, 100);
      }, highlightTime * intervalTime);
    })
    .catch(error => {
      console.error('Error fetching initial random integers:', error);
    });
}

async function fetchRandomIntegers(num) {
  const tags = document.querySelectorAll('.tag');
  if (tags.length === 0) return [];
  const max = tags.length - 1;
  const lines = (await (await fetch(`https://www.random.org/integers/?num=${num}&min=0&max=${max}&col=1&base=10&format=plain&rnd=new`)).text()).split('\n').filter(Boolean);
  const numbers = lines.map(line => {
    const index = parseInt(line, 10);
    if (isNaN(index) || index < 0 || index > max) {
      throw new Error(`Invalid index received from random.org: ${index}`);
    }
    return index;
  });

  return numbers;
}

function pickRandomTag(randomNumbers) {
  const tags = document.querySelectorAll('.tag');
  if (tags.length === 0 || randomNumbers.length === 0) return null;

  // Get the next random number from the pre-fetched array
  const index = randomNumbers.shift();
  return tags[index];
}

function highlightTag(tag) {
  tag.classList.add('highlight');
}

function unHighlightTag(tag) {
  tag.classList.remove('highlight');
}

function displayWinner(winnerTag) {
  const winnerText = winnerTag.innerText;
  winnerDisplay.innerText = `Winner: ${winnerText}`;
}

function removeWinner(winnerTag) {
  const winnerText = winnerTag.innerText;
  tagsArray = tagsArray.filter(tag => tag !== winnerText);
  textarea.value = tagsArray.join("\n");

  createTags(textarea.value);
}
