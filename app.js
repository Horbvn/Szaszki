
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

const last_moves = [];


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
let highlight_flag = false;
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



const Pieces = {}
function fillBoard() {
    ['white','black'].forEach(color => {
        letters.forEach(letter => {
            Pieces[`${color}_${letter}_Pawn`] = new Pawn(`${letter}${color ==='white' ? '2' : '7'}`, `${color}`);
        });
        ['a','h'].forEach(letter => {
            Pieces[`${color}_${letter}_Rook`] = new Rook(`${letter}${color ==='white' ? '1' : '8'}`, `${color}`);
        });
        ['b','g'].forEach(letter => {
            Pieces[`${color}_${letter}_Knight`] = new Knight(`${letter}${color ==='white' ? '1' : '8'}`, `${color}`);
        });
        ['c','f'].forEach(letter => {
            Pieces[`${color}_${letter}_Bishop`] = new Bishop(`${letter}${color ==='white' ? '1' : '8'}`, `${color}`);
        });
        Pieces[`${color}_e_King`] = new King(`e${color ==='white' ? '1' : '8'}`, `${color}`);
        Pieces[`${color}_d_Queen`] = new Queen(`d${color ==='white' ? '1' : '8'}`, `${color}`);
    });
    
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


function calcNewId(id, value1, value2) {
    let new_column = dict[id[0]] + Number(value1)-1;
    let new_row = (Number(id[1]) + value2);
    if (new_column < 0 || new_column > 7 || new_row > 8 || new_row < 1){
        return null;
    }
    else return letters[new_column] + new_row;
}


function highlightTiles(moves) {
    moves.forEach(element => {
        document.getElementById(element).classList.add("highlighted");
    });
}

function removeHighlights(moves) {
    moves.forEach(element => {
        document.getElementById(element).classList.remove("highlighted");
        document.getElementById(element).classList.remove("focused");
    });
}


class Piece {
    constructor(id, color) {
        this.color = color;
        this.position = id;
        this.element = document.createElement("div");
        this.element.classList.add("piece");
        this.element.setAttribute("color", this.color);
        this.element.setAttribute("position", this.position);
        document.getElementById(this.position).appendChild(this.element);     
        this.element.style.backgroundImage = `url(images/${this.color}${this.constructor.name}.png)`;
        this.element.setAttribute("name", `${this.color}_${this.position[0]}_${this.constructor.name}`);
        this.element.addEventListener("click", function() {
            if (last_moves.length === 0) {
                last_moves.push(this.getAttribute("position"));
                highlightTiles(Pieces[this.getAttribute("name")].getPossibleMoves());
                this.parentNode.classList.add("focused");
            }
            else {
                removeHighlights(last_moves);
                last_moves.length = 0;
            }

        });
    }

    movePiece(id) {
        document.getElementById(id).appendChild(this.element);
        this.element.setAttribute("position", id)
        return this.position = id;
    }

    canCapture(id, color) {     
        return (
            isTileOccupied(id)
            && (document.getElementById(id).childNodes[0].getAttribute("color") != color)  
        )
    }


    checkDirections(array) {
        // const directions = [[1,1], [1,-1], [-1,-1], [-1,1]];
        let moves = [];
        array.forEach(direction => {
            moves.push(...this.checkDirection(direction, this.color, this.position));
        });
        return moves;
    }
    
    
    checkDirection(array, color,id) {
        let moves = [];
        let loop_flag = true;
        while (loop_flag) {
            let new_id = calcNewId(id, array[0], array[1]);
            if (new_id === null) {
                return moves;
            }
            if (isTileOccupied(new_id)) { 
                if (this.canCapture(new_id, color)){
                    moves.push(new_id);
                }
                loop_flag = false;
            }
            else {
                moves.push(new_id);
                id = new_id;
            }
    
        }
        return moves;
    }
}


class Pawn extends Piece {
    constructor(id, color){
        super(id, color);        
    }


    canMoveForward() {
        let candidates = [];
        let new_id;
        let index;
        let counter = 1;
        if (this.position[1] == 2 || this.position[1] == 7) counter = 2;
        for (let i = 1; i <= counter; i++) {
            index = this.color === 'white' ? i : -i;
            new_id = this.position[0] + (Number(this.position[1])+index);
            if (!isTileOccupied(new_id)) {
                candidates.push(new_id);   
            }
            else {
                return candidates;
            } 
        } 
        return candidates;        
    }

    /*
    FIX - Przerobić IFa -> white: y = 1, black: y = -1
    */
    attackMove() {
        let candidates = []
        let temp_id;
        if (this.color === "white") {
                switch (this.position[0]) {
                    case "a":
                        temp_id = calcNewId(this.position, 1, 1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        break;               
                    case "h":
                        temp_id = calcNewId(this.position, -1, 1);
                        if (this.canCapture(temp_id,this.color)) candidates.push(temp_id);
                        break;
                    default:
                        temp_id = calcNewId(this.position, 1, 1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        temp_id = calcNewId(this.position, -1, 1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        break;
                }
            }         
            else {
                switch (this.position[0]) {
                    case "a":
                        temp_id = calcNewId(this.position, 1, -1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        break;                
                    case "h":
                        temp_id = calcNewId(this.position, -1, -1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        break;                    
                    default:
                        temp_id = calcNewId(this.position, 1, -1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        temp_id = calcNewId(this.position, -1, -1);
                        if (this.canCapture(temp_id, this.color)) candidates.push(temp_id);
                        break;
                }               
                
        }
        return candidates;
    }

    getPossibleMoves() {
        let candidates = [];
        candidates.push(...this.canMoveForward());
        candidates.push(...this.attackMove());
        last_moves.push(...candidates);
        return candidates;
    }
    /*
    To do:
    - promocja (element.remove(), delete Pieces["piece"] Pieces["piece"] = new Piece())
    - en passant (po wprowadzeniu zapisu notacji)
    */
}

class Bishop extends Piece {
    constructor(id, color) {
        super(id, color);
        this.directions = [[1,1], [1,-1], [-1,-1], [-1,1]];
    }    

    getPossibleMoves() {
        let candidates = [];
        candidates.push(...this.checkDirections(this.directions));
        last_moves.push(...candidates);
        return candidates;
    }
}

class Knight extends Piece {
    constructor(id, color) {
        super(id, color);
    }

    getPossibleMoves() {
        let candidates = [];
        let illegal_moves = [];
        for (let x = -2; x < 3; x++) {
            if (x === 0) continue;
            let y = 3-Math.abs(x);
            candidates.push(calcNewId(this.position, x, y));
            y *= -1;
            candidates.push(calcNewId(this.position, x, y));
        }
        candidates = candidates.filter(move => typeof(move) === "string");
        candidates.forEach(move => {
            if (isTileOccupied(move)) {
                if (!this.canCapture(move, this.color)) illegal_moves.push(move);
            }
        });
        candidates = candidates.filter(move => !illegal_moves.includes(move));
        last_moves.push(...candidates);
        return candidates;
    }
    
}

class Rook extends Piece {
    constructor(id, color) {
        super(id, color);
        this.directions = [[1,0], [-1,0], [0,1], [0,-1]];
    }
    getPossibleMoves() {
        let candidates = [];
        candidates.push(...this.checkDirections(this.directions));
        last_moves.push(...candidates);
        return candidates;
    }
    
}

class Queen extends Piece {
    constructor(id, color) {
        super(id, color);
        this.directions = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,-1], [-1,1]];
    }
    getPossibleMoves() {
        let candidates = [];
        candidates.push(...this.checkDirections(this.directions));
        last_moves.push(...candidates);
        return candidates;
    }
    
}

class King extends Piece {
    constructor(id, color) {
        super(id, color);
    }
    getPossibleMoves() {
        let candidates = [];
        for (let i = 1; i>=-1; i--) {            
            for (let j = 1; j>=-1; j--) {
                let new_id = calcNewId(this.position, i, j);
                if (new_id === null || new_id === this.position) continue;
                if (isTileOccupied(new_id)) { 
                    if (this.canCapture(new_id, this.color)){
                        candidates.push(new_id);
                    }
                }
                else {
                    candidates.push(new_id);    
                }
            }
        }
        last_moves.push(...candidates);
        return candidates;
    }
    
}
fillBoard();



/*
zbijana figura "zjeżdża chamsko w 2D" w portal a druga figura wchodzi na 
jej miejsce 
*/








