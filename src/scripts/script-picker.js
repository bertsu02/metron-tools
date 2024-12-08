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
  const times = 15;

  const interval = setInterval(async () => {
    const randomTag = await pickRandomTag();

    if (randomTag) {
      highlightTag(randomTag);

      setTimeout(() => {
        unHighlightTag(randomTag);
      }, 75);
    }
  }, 75);

  setTimeout(async () => {
    clearInterval(interval);

    setTimeout(async () => {
      const randomTag = await pickRandomTag();

      if (randomTag) {
        highlightTag(randomTag);
        displayWinner(randomTag);
        removeWinner(randomTag);
      } else {
        console.warn('No valid tag was selected.');
      }
    }, 100);
  }, times * 75);
}

async function pickRandomTag() {
  const tags = document.querySelectorAll('.tag');
  if (tags.length === 0) return null;

  try {
    const max = tags.length - 1; // Adjust max for zero-based index
    const response = await fetch(`https://www.random.org/integers/?num=1&min=0&max=${max}&col=1&base=10&format=plain&rnd=new`);
    const index = parseInt(await response.text(), 10);

    if (isNaN(index) || index < 0 || index > max) {
      throw new Error('Invalid index received from random.org');
    }

    return tags[index];
  } catch (error) {
    console.error('Error fetching random number:', error);
    return null;
  }
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
