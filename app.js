
const board = document.querySelector(".board");
const lettersbox = document.querySelector(".lettersbox");
const numbersbox = document.querySelector(".numbersbox");

let letters = [`a`,`b`,`c`,`d`,`e`,`f`,`g`,`h`];

let dict = {
    "a": 1,
    "b": 2,
    "c": 3,
    "d": 4,
    "e": 5,
    "f": 6,
    "g": 7,
    "h": 8
}


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


let white_flag = true;

for (let i = 1; i <= 64; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tiles");
    if (white_flag ? tile.classList.add("white_tile") : tile.classList.add("black_tile"));
    white_flag = !white_flag;
    if (i%8 == 0) {
        white_flag = !white_flag;
    }
    tile.id = calcId(i);
    //tile.classList.add(64-i);
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

function isTileOccupied(id) {
    return document.getElementById(id).hasChildNodes();
}

class Board {
    constructor() {

    }

}

class Piece {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.initial_id = this.id;
        this.element = document.createElement("div");
        this.element.classList.add("piece");
        this.element.setAttribute("color" ,this.color);
        document.getElementById(this.id).appendChild(this.element);        
    }

    movePiece(id) {
        document.getElementById(id).appendChild(this.element);
        return this.id = id;
    }
}

class Pawn extends Piece {
    constructor(id, color){
        super(id, color);
        this.name = this.color + "pawn";
        this.element.style.backgroundImage = `url(images/${this.name}.png)`;
    }

    canMoveForward() {
        let new_id;
        switch (this.color) {
            case "white":
                new_id = this.id[0] + (Number(this.id[1])+1);
                return (isTileOccupied(new_id) ? "can't" : new_id);
        
            case "black":
                new_id = this.id[0] + (Number(this.id[1])-1);
                return (isTileOccupied(new_id) ? "can't" : new_id);
        }
        
    }

    firstMove() {
        let new_id;
        switch (this.color) {
            case "white":
                new_id = this.id[0] + (Number(this.id[1])+2);
                return (isTileOccupied(new_id) ? "can't" : new_id);        
            case "black":
                new_id = this.id[0] + (Number(this.id[1])-2);
                return (isTileOccupied(new_id) ? "can't" : new_id);
        }
        
    }

    attackMove() {
        let candidates = []
        switch (this.color) {
            case "white":                
                candidates.push()        
            case "black":
                break;
        }
    }

    getPossibleMoves() {
        let moves = [];
        //let example = ["a1", "b1"]
        if (this.id[1] == 2 || this.id[1] == 7) {
            moves.push(this.firstMove());
        }
        moves.push(this.canMoveForward());
        //moves.push(...example);
        return moves;
    }
    

}

class Bishop extends Piece {
    constructor(id, color) {
        super(id, color);
        this.name = this.color + "bishop";
        this.element.style.backgroundImage = `url(images/${this.name}.png)`;
    }    
}

class Knight extends Piece {
    constructor(id, color) {
        super(id, color);
        this.name = this.color + "knight";
        this.element.style.backgroundImage = `url(images/${this.name}.png)`;
    }
    
}

class Rook extends Piece {
    constructor(id, color) {
        super(id, color);
        this.name = this.color + "rook";
        this.element.style.backgroundImage = `url(images/${this.name}.png)`;
    }
    
}

class Queen extends Piece {
    constructor(id, color) {
        super(id, color);
        this.name = this.color + "queen";
        this.element.style.backgroundImage = `url(images/${this.name}.png)`;
    }
    
}

class King extends Piece {
    constructor(id, color) {
        super(id, color);
        this.name = this.color + "king";
        this.element.style.backgroundImage = `url(images/${this.name}.png)`;
    }
    
}

// const white_f_bishop = new Bishop("f1", "white");
// const white_c_bishop = new Bishop("c1", "white");
// const white_b_knight = new Knight("b1", "white");
// const white_g_knight = new Knight("g1", "white");
// const white_a_rook = new Rook("a1", "white");
// const white_h_rook = new Rook("h1", "white");
// const white_queen = new Queen("d1", "white");
// const white_king = new King("e1", "white");
// const white_a_pawn = new Pawn("a2", "white");
// const white_b_pawn = new Pawn("b2", "white");
// const white_c_pawn = new Pawn("c2", "white");
// const white_d_pawn = new Pawn("d2", "white");
// const white_e_pawn = new Pawn("e2", "white");
// const white_f_pawn = new Pawn("f2", "white");
// const white_g_pawn = new Pawn("g2", "white");
// const white_h_pawn = new Pawn("h2", "white");

// const black_f_bishop = new Bishop("f8", "black");
// const black_c_bishop = new Bishop("c8", "black");
// const black_b_knight = new Knight("b8", "black");
// const black_g_knight = new Knight("g8", "black");
// const black_a_rook = new Rook("a8", "black");
// const black_h_rook = new Rook("h8", "black");
// const black_queen = new Queen("d8", "black");
// const black_king = new King("e8", "black");
// const black_a_pawn = new Pawn("a7", "black");
// const black_b_pawn = new Pawn("b7", "black");
// const black_c_pawn = new Pawn("c7", "black");
// const black_d_pawn = new Pawn("d7", "black");
// const black_e_pawn = new Pawn("e7", "black");
// const black_f_pawn = new Pawn("f7", "black");
// const black_g_pawn = new Pawn("g7", "black");
// const black_h_pawn = new Pawn("h7", "black");

let PIECES = {};
const fillBoard = () => {
    return ['black', 'white'].forEach(color => {
        letters.forEach(letter => {
            PIECES[`${color}_${letter}_pawn`] = new Pawn(`${letter}${color === 'black' ? '7' : '2'}`, color);
        });
    
        const tileNumber = color === 'black' ? '8' : '1';
        PIECES[`${color}_queen`] = new Queen(`d${tileNumber}`, color);
        PIECES[`${color}_king`] = new King(`e${tileNumber}`, color);
    
        ['c', 'f'].forEach(letter => {
            PIECES[`${color}_${letter}_bishop`] = new Bishop(`${letter}${tileNumber}`, color);
        });
        ['b', 'g'].forEach(letter => {
            PIECES[`${color}_${letter}_knight`] = new Knight(`${letter}${tileNumber}`, color);
        });
        ['a', 'h'].forEach(letter => {
            PIECES[`${color}_${letter}_rook`] = new Rook(`${letter}${tileNumber}`, color);
        });
    });
}
fillBoard();
console.log(PIECES);
