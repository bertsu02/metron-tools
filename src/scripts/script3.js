import blue from "../img/normal.png";
import purple from "../img/crazy.png";
const rollButton = document.getElementById("roll-button");
rollButton.addEventListener("click", openCase);


  function reset(){
    $('.card').remove();
    for (var i = 0; i < 210; i++){
      var rand = random(1,100);
      var element;
      
      if (rand <= 50){
        element = '<div class="card" style="background-color: #9966ff;" data-rarity="Normal Mode" id=itemNumber'+i+'>'+`<img src="${blue}"></img>`+'</div>';
      } else if (rand <= 100){
        element = '<div class="card" style="background-color: #884dff;" data-rarity="Crazy Mode" id=itemNumber'+i+'>'+`<img src="${purple}"></img>`+'</div>';
      }
  
      $('#cardList').append(element);
    }
    $('.card').first().css('margin-left',-1000);
}

  
  function openCase(){
    reset();
    var rand = random(1000,20000);
    var childNumber = Math.floor(rand/100)+4;
    var timing = "easeOutQuad"
    var reward = $('#itemNumber'+childNumber).attr('data-rarity');
    
    $('.card').first().animate({
      marginLeft: -rand
    }, 5000, timing, function(){
      
      var src = $('#itemNumber'+childNumber+' img').attr('src');
      $('#itemNumber'+childNumber).css({background: "linear-gradient(#00bf09, #246b27)"});
      
    });

  }
  
  function random(min, max){
    return Math.floor((Math.random()*(max - min))+min);
  }


function compareScores(player1Id, player2Id, winnerId) {
    var player1Score = parseInt(document.getElementById(player1Id + "-score").value, 10);
    var player2Score = parseInt(document.getElementById(player2Id + "-score").value, 10);

    if (player1Score > player2Score) {
        document.getElementById(winnerId).value = document.getElementById(player1Id).value;
    } else if (player2Score > player1Score) {
        document.getElementById(winnerId).value = document.getElementById(player2Id).value;
    }
}

for (var i = 1; i <= 8; i += 2) {
    document.getElementById("player" + i + "-score").oninput = function(i) {
        return function() {
            compareScores("player" + i, "player" + (i + 1), "winner" + ((i + 1) / 2));
        };
    }(i);

    document.getElementById("player" + (i + 1) + "-score").oninput = function(i) {
        return function() {
            compareScores("player" + i, "player" + (i + 1), "winner" + ((i + 1) / 2));
        };
    }(i);
}

function compareScoresRound2(winner1Id, winner2Id, finalWinnerId) {
    var winner1Score = parseInt(document.getElementById(winner1Id + "-round2-score").value, 10);
    var winner2Score = parseInt(document.getElementById(winner2Id + "-round2-score").value, 10);

    if (winner1Score > winner2Score) {
        document.getElementById(finalWinnerId).value = document.getElementById(winner1Id).value;
    } else if (winner2Score > winner1Score) {
        document.getElementById(finalWinnerId).value = document.getElementById(winner2Id).value;
    }
}
for (var i = 1; i <= 4; i += 2) {
    document.getElementById("winner" + i + "-round2-score").oninput = function(i) {
        return function() {
            compareScoresRound2("winner" + i, "winner" + (i + 1), "final-winner" + ((i + 1) / 2));
        };
    }(i);

    document.getElementById("winner" + (i + 1) + "-round2-score").oninput = function(i) {
        return function() {
            compareScoresRound2("winner" + i, "winner" + (i + 1), "final-winner" + ((i + 1) / 2));
        };
    }(i);
}
function compareFinalScores(winner1Id, winner2Id, finalWinnerId) {
    var winner1Score = parseInt(document.getElementById(winner1Id + "-final-score").value, 10);
    var winner2Score = parseInt(document.getElementById(winner2Id + "-final-score").value, 10);

    if (winner1Score > winner2Score) {
        document.getElementById(finalWinnerId).value = document.getElementById(winner1Id).value;
    } else if (winner2Score > winner1Score) {
        document.getElementById(finalWinnerId).value = document.getElementById(winner2Id).value;
    }
}

document.getElementById("final-winner1-final-score").oninput = function() {
    compareFinalScores("final-winner1", "final-winner2", "final-winner");
};

document.getElementById("final-winner2-final-score").oninput = function() {
    compareFinalScores("final-winner1", "final-winner2", "final-winner");
};


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updatePairings() {
  const players = [];
  const scores = [];

  $('.player-input input[type="text"]').each(function() {
      players.push($(this).val());
  });

  $('.player-input input[type="number"]').each(function() {
      scores.push($(this).val());
  });

  const shuffledPlayers = shuffleArray(players);
  const shuffledScores = shuffleArray(scores);

  $('.player-input input[type="text"]').each(function(index) {
      $(this).val(shuffledPlayers[index]);
  });

  $('.player-input input[type="number"]').each(function(index) {
      $(this).val(shuffledScores[index]);
  });
}

$('#shuffleButton').click(function() {
  updatePairings();
});
