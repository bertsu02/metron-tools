import back from "../img/cardback.png";

$(document).ready(function () {
    const boxItems = [
      {
        id: 1,
        name: "Hell's Itch",
        img: "https://cdn.rain.gg/images/cases/hells-itch.png.avif"
      },
      {
        id: 2,
        name: "Glorious",
        img: "https://cdn.rain.gg/images/cases/glorious.png.avif"
      },
      {
        id: 3,
        name: "Confusion",
        img: "https://cdn.rain.gg/images/cases/confusion.png.avif"
      },
      {
        id: 4,
        name: "Wild",
        img: "https://cdn.rain.gg/images/cases/wild.png.avif"
      },
      {
        id: 5,
        name: "Only Blues",
        img: "https://cdn.rain.gg/images/cases/only-blues.png.avif"
      },
      {
        id: 6,
        name: "Ballin' on a budget",
        img: "https://cdn.rain.gg/images/cases/ballin-on-a-budget.png.avif"
      },
      {
        id: 7,
        name: "10% Glock",
        img: "https://cdn.rain.gg/images/cases/10-glock.png.avif"
      },
      {
        id: 8,
        name: "10% Usp",
        img: "https://cdn.rain.gg/images/cases/10-usp-s.png.avif"
      },
      {
        id: 9,
        name: "Thumbprint",
        img: "https://cdn.rain.gg/images/cases/thumbprint.png.avif"
      },
      {
        id: 10,
        name: "Sale",
        img: "https://cdn.rain.gg/images/cases/sale.png.avif"
      },
      {
        id: 11,
        name: "Art",
        img: "https://cdn.rain.gg/images/cases/art.png.avif"
      },
      {
        id: 12,
        name: "On a budget",
        img: "https://cdn.rain.gg/images/cases/on-a-budget.png.avif"
      },
      {
        id: 13,
        name: "Recon",
        img: "https://cdn.rain.gg/images/cases/recon.png.avif"
      },
      {
        id: 14,
        name: "White Night",
        img: "https://cdn.rain.gg/images/cases/white-night.png.avif"
      },
      {
        id: 15,
        name: "Bright Lights",
        img: "https://cdn.rain.gg/images/cases/bright-lights.png.avif"
      },
      {
        id: 16,
        name: "Precipitation",
        img: "https://cdn.rain.gg/images/cases/precipitation.png.avif"
      },
      {
        id: 17,
        name: "One handed",
        img: "https://cdn.rain.gg/images/cases/1-handed.png.avif"
      },
      {
        id: 18,
        name: "5% Lore",
        img: "https://cdn.rain.gg/images/cases/5-lore.png.avif"
      },
      {
        id: 19,
        name: "Turbo",
        img: "https://cdn.rain.gg/images/cases/turbo.png.avif"
      },
      {
        id: 20,
        name: "Switcheroo",
        img: "https://cdn.rain.gg/images/cases/switcheroo.png.avif"
      }
    ];
  
    function createCards() {
        boxItems.sort(function () { return 0.5 - Math.random() });

        $(".parent").empty(); // Clear existing cards

        $.each(boxItems, function (i, v) {
            $(".parent").append(
                '<div class="child" id="' + v.name + '" style="background-image: url(\'' + back + '\');"> \
                         <span class="card-number">' + (i + 1) + '</span> \
                         <div class="card-name">' + v.name + '</div> \
                <img src="' + v.img +
                '" style="width:50%; height:100%; margin-left: auto; margin-right: auto; margin-top: -48%; display:block;"></div>'
            );
        });

        $(".parent").find(".card-name").hide();
        $(".parent").find(".child img").hide();

        // Re-bind click event after cards are recreated
        bindCardClickEvents();
    }

    function bindCardClickEvents() {
        $(".parent").find(".child").off("click").on("click", function () {
            if (!$(".parent").hasClass("disabled")) {
                if (openedCount < maxOpens) {
                    $(this).find("img").show();
                    $(this).find(".card-name").show();
                    $(this).css("background-image", "none");
                    
                    openedCount++;

                    if (openedCount === maxOpens) {
                        $(".parent").addClass("disabled");
                    }
                }
            }
        });
    }

    let openedCount = 0;
    const maxOpens = 3;

    // Initial card creation and event binding
    createCards();

    $("#resetButton").click(function () {
        openedCount = 0; // Reset the opened count
        $(".parent").removeClass("disabled"); // Remove the disabled class
        createCards(); // Re-create the cards
    });
});