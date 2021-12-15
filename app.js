
const board = document.querySelector(".board");
const lettersbox = document.querySelector(".lettersbox");
const numbersbox = document.querySelector(".numbersbox");

let letters = ['a','b','c','d','e','f','g','h'];


for (let i = 0; i<=7; i++) {
    const letter = document.createElement("li");
    letter.classList.add("letterbox");
    letter.textContent = letters[i];
    lettersbox.appendChild(letter);
}

for (let i = 0; i<=7; i++) {
    const number = document.createElement("li");
    number.classList.add("numbersbox");
    number.textContent = 8-i;
    numbersbox.appendChild(number);
}


//true == white
let tile_color_flag = true;

for (let i = 1; i <= 64; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tiles");
    if (tile_color_flag == true) {
        tile.classList.add("white_tile");
    }
    else {
        tile.classList.add("black_tile");
    }
    tile_color_flag = !tile_color_flag;
    if (i%8 == 0) {
        tile_color_flag = !tile_color_flag;
    }
    tile.id = calcId(i);
    tile.innerText = tile.id;
    tile.addEventListener("mouseover", function(){
        tile.classList.remove("tiles");
    });
    tile.addEventListener("mouseleave", function() {
        tile.classList.add("tiles");
    })
    board.appendChild(tile);
}


function calcId(i) {
    if (i%8==0) {
        return letters[7] + (9-Math.floor(i/8));
    
    }
    else {    
        return letters[(i%8)-1] + (8-Math.floor(i/8));
    }   
}