
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
    tile.addEventListener("click", function() {
        if (highlight_flag) {
        removeHighlights(last_moves);
        last_moves.length = 0;            
        }        
        highlight_flag = !highlight_flag;
    })
    //tile.classList.add(64-i);
    board.appendChild(tile);
}



const Pieces = {}
function fillBoard() {
    ['white','black'].forEach(color => {
        letters.forEach(letter => {
            Pieces[`${color}_${letter}_pawn`] = new Pawn(`${letter}${color ==='white' ? '2' : '7'}`, `${color}`);
        });
        ['a','h'].forEach(letter => {
            Pieces[`${color}_${letter}_rook`] = new Rook(`${letter}${color ==='white' ? '1' : '8'}`, `${color}`);
        });
        ['b','g'].forEach(letter => {
            Pieces[`${color}_${letter}_knight`] = new Knight(`${letter}${color ==='white' ? '1' : '8'}`, `${color}`);
        });
        ['c','f'].forEach(letter => {
            Pieces[`${color}_${letter}_bishop`] = new Bishop(`${letter}${color ==='white' ? '1' : '8'}`, `${color}`);
        });
        Pieces[`${color}_king`] = new King(`e${color ==='white' ? '1' : '8'}`, `${color}`);
        Pieces[`${color}_queen`] = new Queen(`d${color ==='white' ? '1' : '8'}`, `${color}`);
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


function switchId(id, value1, value2) {
    return letters[dict[id[0]] + Number(value1)-1] + (Number(id[1]) + value2);
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


const last_moves = [];

class Piece {
    constructor(id, color) {
        this.color = color;
        this.position = id;
        this.element = document.createElement("div");
        this.element.classList.add("piece");
        this.element.setAttribute("color", this.color);
        this.element.setAttribute("position", this.position);
        document.getElementById(this.position).appendChild(this.element);       
    }

    movePiece(id) {
        document.getElementById(id).appendChild(this.element);
        this.element.setAttribute("position", id)
        return this.position = id;
    }

    canCapture(id) {     
        return (
            isTileOccupied(id)
            && (document.getElementById(id).childNodes[0].getAttribute("color") != this.color)  
        )
    }
}


class Pawn extends Piece {
    constructor(id, color){
        super(id, color);
        this.element.style.backgroundImage = `url(images/${this.color}pawn.png)`;
        this.element.setAttribute("name", `${this.color}_${this.position[0]}_pawn`);
        this.element.addEventListener("click", function() {
            //Uwaga szalenstwo, caly czas szkic
            last_moves.push(this.getAttribute("position"));
            //removeHighlights([this.getAttribute("position")]);
            removeHighlights(last_moves);
            highlightTiles(Pieces[this.getAttribute("name")].getPossibleMoves());
            this.parentNode.classList.add("focused");            
            /*
            if (this.parentNode.classList.contains("focused")) {
                removeHighlights([this.getAttribute("position")]);
                removeHighlights(last_moves);
            }
            else {
                highlightTiles(Pieces[this.getAttribute("name")].getPossibleMoves());
                this.parentNode.classList.add("focused");
            }
            */
        });
        this.element.addEventListener("click", function() {
            if (this.classList.contains("focused")){
                console.log("OK");
            removeHighlights(last_moves);
            last_moves.length = 0;
            }
        }
        ); 
    }

    /*
    FIX - Przerobić funkcję, żeby nie sprawdzała pola +2, jeżeli +1 jest już zajęte
    */
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

    attackMove() {
        let candidates = []
        let temp_id;
        switch (this.color) {
            case "white":
                switch (this.position[0]) {
                    case "a":
                        temp_id = switchId(this.position, 1, 1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        break;               
                    case "h":
                        temp_id = switchId(this.position, -1, 1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        break;
                    default:
                        temp_id = switchId(this.position, 1, 1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        temp_id = switchId(this.position, -1, 1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        break;
                }         
            case "black":
                switch (this.position[0]) {
                    case "a":
                        temp_id = switchId(this.position, 1, -1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        break;                
                    case "h":
                        temp_id = switchId(this.position, -1, -1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        break;                    
                    default:
                        temp_id = switchId(this.position, 1, -1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
                        temp_id = switchId(this.position, -1, -1);
                        if (this.canCapture(temp_id)) candidates.push(temp_id);
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
        this.element.style.backgroundImage = `url(images/${this.color}bishop.png)`;
        this.element.setAttribute("name", `${this.color}_${this.position[0]}_bishop`);
    }    
}

class Knight extends Piece {
    constructor(id, color) {
        super(id, color);
        this.element.style.backgroundImage = `url(images/${this.color}knight.png)`;
        this.element.setAttribute("name", `${this.color}_${this.position[0]}_knight`);
    }
    
}

class Rook extends Piece {
    constructor(id, color) {
        super(id, color);
        this.element.style.backgroundImage = `url(images/${this.color}rook.png)`;
        this.element.setAttribute("name", `${this.color}_${this.position[0]}_rook`);
    }
    
}

class Queen extends Piece {
    constructor(id, color) {
        super(id, color);
        this.element.style.backgroundImage = `url(images/${this.color}queen.png)`;
        this.element.setAttribute("name", `${this.color}_queen`);
    }
    
}

class King extends Piece {
    constructor(id, color) {
        super(id, color);
        this.element.style.backgroundImage = `url(images/${this.color}king.png)`;
        this.element.setAttribute("name", `${this.color}_king`);

    }
    
}
fillBoard();



/*
zbijana figura "zjeżdża chamsko w 2D" w portal a druga figura wchodzi na 
jej miejsce 
*/


