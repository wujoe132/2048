/** Predefined variable for the entire game. */
let game;

//** 調用元素id的特性調用元素來取得值 */
const scoreDOM = document.getElementById("score");
const boardDOM = document.getElementById("board");
const startDOM = document.getElementById("start");


/** Self-defined library for entire game. */
class Game {
    /** 在class裡面跟constructor平行的只能是function. */
    /** 當你建的一個class第一個會跑到的function. */
    constructor() {
        console.log("Constructor!");
        /** `this.` -> 整個class通用 */
        this.tiles = new Array(16);
        
        /** To call a function in the class, we have to use this. */
        // this.buildTile();


        /** Calls init function to build the board. */
        this.init();
        
    }

    /** Function to initialize the game. */
    init() {
        console.log("Init!");
    
        /** 1. Appends a new div dom on board. */
        for (let i = 0; i < this.tiles.length; i++){
            /** This will create a DOM div => `<div></div>`. */
            const tileDom = document.createElement("div");

            /** Seta class values in chlid, in this case, for example: <div class="tile tile0"></div>. */
            tileDom.setAttribute("class", "tile tile" + i); /**  `${i}` */
            tileDom.setAttribute("index", i);
            tileDom.setAttribute("value", 0);

            /** 在父輩元數裡加子輩 */
            boardDOM.appendChild(tileDom);
            
            
            /** 2. Replaces the elements on this.tiles. */
            this.tiles[i] = tileDom;
        }


        /** Add 1 randome tile. */
        this.addRandomTile();
        this.addRandomTile();
    }


    /** Add a random tile on the board. */
    addRandomTile() {
        console.log("Add random tile!");
        
        /** 1. Find all the tile's index with value equals 0. */
        const valueZeroTiles = this.tiles.filter(tile => tile.getAttribute("value") === "0");


        /** 2. Get a random value zero tile. */
        const selectedZeroTile = valueZeroTiles[this.randomTileIndex(valueZeroTiles)];

        //** 用於設置或返回selectedZeroTile裡的html and makes it equal to function randomTwoOrFour */
        selectedZeroTile.innerHTML = this.randomTwoOrFour();
    }

    /** Returns a valid random index from value zero tiles. */
    randomTileIndex(valueZeroTiles){
        return Math.floor(Math.random() * valueZeroTiles.length);
    }


    /** Return a random number 2 or 4. */
    randomTwoOrFour(){
        //** Create a if statement randomNumber to test either 4 or 2. */
        const randomNumber = Math.random();
        if (randomNumber > 0.5) {
            return 4;
        } else {
            return 2;
        }
    }

    /** Defineds the build tile function within the Game class. */
    buildTile() {console.log("buildTile!");
        console.log(this.tiles);
    }
}

















/** DOM handling. */


/** Clicks to start a new game. */
startDOM.addEventListener("click", () => {
    // TODO(joe): add logic to start the game.
    console.log("click the start button");
});

/** When browser dedects loading, it will load this. */
window.onload = () => {
    console.log("Onload!");
    game = new Game();
}