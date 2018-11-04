/** Predefined variable for the entire game. */
let game;

//** 調用元素id的特性調用元素來取得值 */
const scoreDOM = document.getElementById("score");
const boardDOM = document.getElementById("board");
const startDOM = document.getElementById("start");

/** Defines the related keycode by number. */
const [UP, RIGHT, DOWN, LEFT] = [38, 39, 40, 37];

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

    /** Restarts the game. */
    reStart() {
        /** TODO(joe): */
        boardDOM.innerHTML = "";
        /**  */
        this.tiles = new Array(16);
        /** */
        this.init();
    }

    /** if a function is written above constructor */

    /** Function to initialize the game. */
    init() {
        console.log("Init!");
    
        /** 1. Appends a new div dom on board. */
        for (let i = 0; i < this.tiles.length; i++){
            /** This will create a DOM div => `<div></div>`. */
            const tileDom = document.createElement("div");

            /** Seta class values in chlid, in this case, for example: <div class="tile tile0"></div>. */
            /** The first tile is for tile general style, the second is for specific type of tile style, for exmample: tile2, tile4, tile8 ... tile2048. */
            tileDom.setAttribute("class", "tile tile0"); /**  `${i}` */
            tileDom.setAttribute("index", i);
            tileDom.setAttribute("value", 0);

            /** 在父輩元數裡加子輩 */
            boardDOM.appendChild(tileDom);
            
            
            /** 2. Replaces the elements on this.tiles. */
            this.tiles[i] = tileDom;
            // tileDom.setAttribute("class","value")
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

        /** 用於設置或返回selectedZeroTile裡的html and makes it equal to function randomTwoOrFour */
        const randomValue =  this.randomTwoOrFour()
        selectedZeroTile.innerHTML = randomValue;
        selectedZeroTile.setAttribute("value", randomValue);

        /** Updates the class name of the selected tile. For example, change `tile tile0` to `tile tile2` or `tile tile4`. */
        selectedZeroTile.setAttribute("class","tile tile" + randomValue);
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
    
    /** Function to handle the movement of the board tile. */
    moveTile(keyCode) {
        console.log("Move tile!");
        if(keyCode === RIGHT) {
            /** Iterates each row on the board. */

            
            /** TODO(joe): 跑每一條row.? */
            for(let row = 0; row < 4; row++) {
                /** 檢查每一個row的exsisting number. */
                const existingNumbersOnRow = [];


                /** 1.取每一條row上有意義的number */
                /** 按着顺序来存放已有的number */
                /** Iterates each column on each row. */
                /** Collects the existing numbers from each row. */
                /** Y-axis -> row, X-axis -> column */
                for(let col = 0; col < 4; col++) {
                    /** convert row column into the tile index */
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    /** 取每一個row上有意義的值*/
                    if(currentTile.getAttribute("value") !== "0") {
                        existingNumbersOnRow.push(currentTile.getAttribute("value") );
                    }
                }
                console.log("existingNumbersOnRow: ", existingNumbersOnRow);


                /** 2.將得到的有意義的number倒著填寫在每一個column上 */
                /** 因為方向是右所以要倒著填寫 */ 
                /** 以倒着的顺序来更新board. */
                for(let col = 3; col >= 0; col--) {
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    /** 如果存在exsisting number,我們從尾部抽取*/
                    if (existingNumbersOnRow.length) {
                        /** 把exsisting number 最後一個數抽出來 */
                        const tileValue = existingNumbersOnRow.pop();
                        currentTile.setAttribute("class", "tile tile" + tileValue);
                        currentTile.setAttribute("value", tileValue);
                        currentTile.innerHTML = tileValue;
                    } else {
                        /**如果沒有exsisting number, 要清空index存在的tile */
                        /**set default value */
                        currentTile.setAttribute("class", "tile tile" + 0);
                        currentTile.setAttribute("value", 0);
                        currentTile.innerHTML = "";
                    }
                }
            }
        }


        if (keyCode === LEFT) {

            for(let row = 0; row < 4;row++) {
                const existingNumbersOnRow = [];
                /** 1. */
                for (let col = 0; col < 4; col++) {
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    if(currentTile.getAttribute("value") !== "0") {
                        existingNumbersOnRow.push(currentTile.getAttribute("value"));
                    }
                }       
                console.log("existingNumbersOnRow: ", existingNumbersOnRow);         
                /** 2. */
                for (let col = 0; col < 4; col++) {
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    if (existingNumbersOnRow.length) {
                        const tileValue = existingNumbersOnRow.shift();
                        currentTile.setAttribute("class", "tile tile" + tileValue); 
                        currentTile.setAttribute("value", tileValue);
                        currentTile.innerHTML = tileValue;
                    } else {
                        currentTile.setAttribute("class", "tile tile" + 0);
                        currentTile.setAttribute("value", 0);
                        currentTile.innerHTML = "";
                    }   
                }
            }  
        }

        if (keyCode === UP) {
            for(let col = 0; col < 4; col++) {
                const existingNumbersOnRow = [];
                /** 1, */
                for(let row = 0; row < 4; row++){
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    if(currentTile.getAttribute("value") !== "0") {
                        existingNumbersOnRow.push(currentTile.getAttribute("value"));
                }
            }
            console.log("existingNumbersOnRow: ", existingNumbersOnRow);
                /** 2. */
                for(let row = 0; row < 4; row++) {
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    if (existingNumbersOnRow.length) {
                        const tileValue = existingNumbersOnRow.shift();
                        currentTile.setAttribute("class", "tile tile" + tileValue); 
                        currentTile.setAttribute("value", tileValue);
                        currentTile.innerHTML = tileValue;
                    } else {
                        currentTile.setAttribute("class", "tile tile" + 0);
                        currentTile.setAttribute("value", 0);
                        currentTile.innerHTML = "";
                    }
                }
            }
        }

        if (keyCode === DOWN) {
            for(let col = 0; col < 4; col++) {
                const existingNumbersOnRow = [];
                /** 1, */
                for(let row = 0; row < 4; row++){
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    if(currentTile.getAttribute("value") !== "0") {
                        existingNumbersOnRow.push(currentTile.getAttribute("value"));
                }
            }
                console.log("existingNumbersOnRow: ", existingNumbersOnRow);
                /** 2. */
                for(let row = 3; row >= 0; row--) {
                    const currentTileIndex = row * 4 + col;
                    const currentTile = this.tiles[currentTileIndex];
                    if (existingNumbersOnRow.length) {
                        const tileValue = existingNumbersOnRow.pop();
                        currentTile.setAttribute("class", "tile tile" + tileValue); 
                        currentTile.setAttribute("value", tileValue);
                        currentTile.innerHTML = tileValue;
                    } else {
                        currentTile.setAttribute("class", "tile tile" + 0);
                        currentTile.setAttribute("value", 0);
                        currentTile.innerHTML = "";
                    }
                }
            }
        }


/** (row, col), index = row * 4 + col
 * 0,0      0,1     0.2     0.3
 * 1,0      1,1     1.2     1.3
 * 2,0      2,1     2.2     2.3
 * 3,0      3,1     3.2     3.3
 */

/** DOM handling. */

/** Clicks to start a new game. */
startDOM.addEventListener("click", () => {
    // TODO(joe): add logic to start the game.
    console.log("click the start button");
    game.reStart();
});

/** When browser dedects loading, it will load this. */
window.onload = () => {
    console.log("Onload!");
    game = new Game();
}

/** When user hits any keys on the keyboard, it should listen to it. */
window.onkeydown = (e) => {
    /** Prevent the default setting for browser. For example, scroll the page by hitting top/down. */
    e.preventDefault();
    switch(e.keyCode){
        case UP:
            console.log("You hit UP!");
            game.moveTile(UP);
            break;
        case RIGHT: 
            console.log("You hit RIGHT!");
            game.moveTile(RIGHT);
            break;
        case DOWN: 
            console.log("You hit DOWN!");
            game.moveTile(DOWN);
            break;       
        case LEFT: 
            console.log("You hit LEFT!");
            game.moveTile(LEFT);
            break;
        default:
            break;
    }   
}