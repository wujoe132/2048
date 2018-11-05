/** Predefined variable for the entire game. */
let game;

//** 調用元素id的特性調用元素來取得值 */
const scoreDOM = document.getElementById("score");
const boardDOM = document.getElementById("board");
const startDOM = document.getElementById("start");
const winDom = document.getElementById("win");
const loseDom = document.getElementById("lose");

/** Sets the game point score. */
const WIN_SCORE = 2048;

/** Defines the related keycode by number. */
const [UP, RIGHT, DOWN, LEFT] = [38, 39, 40, 37];

/** Self-defined library for entire game. */
class Game {
    /** 在class裡面跟constructor平行的只能是function. */
    /** 當你建的一個class第一個會跑到的function. */
    constructor() {
        // console.log("Constructor!");
        /** `this.` -> 整個class通用 */
        this.tiles = new Array(16);

        /** Calls init function to build the board. */
        this.init();
        this.playerScore = 0;
        this.gameWin = false;
        this.gameLose = false;
    }

    /** Restarts the game. */
    reStart() {
        /** TODO(joe): */
        boardDOM.innerHTML = "";
        /** TODO(joe): */
        this.tiles = new Array(16);
        /** Clean up the player in the Game class as well as the dom. */
        this.playerScore = 0;
        scoreDOM.innerHTML = 0;

        this.init();
    }

    /** Function to update the score dom on the interface. */
    updateScoreDom(addScore) {
        this.playerScore += Number(addScore);
        scoreDOM.innerHTML = this.playerScore;
        if (this.checkWin(addScore)) {
            winDom.style.display = "flex";
            this.gameWin = true;
        }
    }

    /** if a function is written above constructor */

    /** Function to initialize the game. */
    init() {
        // console.log("Init!");

        /** Disable the win/lose layer. */
        winDom.style.display = "none";
        loseDom.style.display = "none";

        /** Resets all the game's params. */
        this.playerScore = 0;
        this.gameWin = false;
        this.gameLose = false;

        /** 1. Appends a new div dom on board. */
        for (let i = 0; i < this.tiles.length; i++) {
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
        }


        /** Add 1 randome tile. */
        this.addRandomTile();
        this.addRandomTile();
    }


    /** Add a random tile on the board. */
    addRandomTile() {
        // console.log("Add random tile!");

        /** 1. Find all the tile's index with value equals 0. */
        const valueZeroTiles = this.tiles.filter(tile => tile.getAttribute("value") === "0");

        /** Only set random tile if there are any tiles has value equals to "0". */
        if(valueZeroTiles.length > 0) {
            /** 2. Get a random value zero tile. */
            const selectedZeroTile = valueZeroTiles[this.randomTileIndex(valueZeroTiles)];
    
            /** 用於設置或返回selectedZeroTile裡的html and makes it equal to function randomTwoOrFour */
            const randomValue = this.randomTwoOrFour()
            selectedZeroTile.innerHTML = randomValue;
            selectedZeroTile.setAttribute("value", randomValue);
    
            /** Updates the class name of the selected tile. For example, change `tile tile0` to `tile tile2` or `tile tile4`. */
            selectedZeroTile.setAttribute("class", "tile tile" + randomValue);
        }
    }

    /** Returns a valid random index from value zero tiles. */
    randomTileIndex(valueZeroTiles) {
        return Math.floor(Math.random() * valueZeroTiles.length);
    }


    /** Return a random number 2 or 4. */
    randomTwoOrFour() {
        //** Create a if statement randomNumber to test either 4 or 2. */
        const randomNumber = Math.random();
        if (randomNumber > 0.5) {
            return 4;
        } else {
            return 2;
        }
    }

    /** Function to handle the movement of the board tile. */
    moveTile(keyCode) {
        // console.log("Move tile!");
        if (this.gameWin || this.gameLose) return;
        switch (keyCode) {
            case RIGHT:
                this.moveRight();
                break;
            case LEFT:
                this.moveLeft();
                break;
            case UP:
                this.moveUp()
                break;
            case DOWN:
                this.moveDown()
                break;
            default:
                break;
        }
        this.addRandomTile();
        if(this.checkLose()) {
            this.gameLose = true;
            loseDom.style.display = "flex";
        }
    }

    /** Action event handle for the right movement. */
    moveRight() {
        /** Iterates each row on the board. */
        for (let row = 0; row < 4; row++) {
            /** 檢查每一個row的exsisting number. */
            const existingNumbersOnRow = [];
            /** 1.取每一條row上有意義的number */
            /** 按着顺序来存放已有的number */
            /** Iterates each column on each row. */
            /** Collects the existing numbers from each row. */
            /** Y-axis -> row, X-axis -> column */
            for (let col = 0; col < 4; col++) {
                /** convert row column into the tile index */
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                /** 取每一個row上有意義的值*/
                if (currentTile.getAttribute("value") !== "0") {
                    existingNumbersOnRow.push(Number(currentTile.getAttribute("value")));
                }
            }

            // console.log("existingNumbersOnRow: ", existingNumbersOnRow);
            /** Handle if existing numbers have merge. */
            const newRow = this.rightMerge(existingNumbersOnRow)
            // console.log(`Move right new row: ${newRow}`);

            /** 2.將得到的有意義的number倒著填寫在每一個column上 */
            /** 因為方向是右所以要倒著填寫 */
            /** 以倒着的顺序来更新board. */
            for (let col = 3; col >= 0; col--) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                /** 如果存在exsisting number,我們從尾部抽取*/
                if (newRow.length) {
                    /** 把exsisting number 最後一個數抽出來 */
                    const tileValue = newRow.pop();
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

    /** 
     * Handle the merge case on the right movement.
     * For example: [2, 2] => [4]
     * [2, 2, 4] => [4, 4]
     * [4, 2, 2] => [4, 4]
     * [2, 2, 2, 2] => [4, 4]
     * [2, 2, 2] => [2, 4]
     */
    rightMerge(existingNumbersOnRow) {
        const newRow = [];
        while (existingNumbersOnRow.length > 0) {
            if (existingNumbersOnRow.length === 1) {
                const a = existingNumbersOnRow.pop();
                newRow.unshift(a);
            } else {
                const a = existingNumbersOnRow[existingNumbersOnRow.length - 1];
                const b = existingNumbersOnRow[existingNumbersOnRow.length - 2];
                if (a === b) {
                    newRow.unshift(a + b);
                    this.updateScoreDom(a + b);
                    existingNumbersOnRow.pop();
                    existingNumbersOnRow.pop();
                } else {
                    newRow.unshift(a);
                    existingNumbersOnRow.pop();
                }
            }
        }
        return newRow;
    }

    /** Action event handle for the left movement. */
    moveLeft() {
        for (let row = 0; row < 4; row++) {
            const existingNumbersOnRow = [];
            /** 1. */
            for (let col = 0; col < 4; col++) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                if (currentTile.getAttribute("value") !== "0") {
                    existingNumbersOnRow.push(Number(currentTile.getAttribute("value")));
                }
            }

            // console.log("existingNumbersOnRow: ", existingNumbersOnRow);
            const newRow = this.leftMerge(existingNumbersOnRow)
            // console.log(`Move left new row: ${newRow}`);

            /** 2. */
            for (let col = 0; col < 4; col++) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                if (newRow.length) {
                    const tileValue = newRow.shift();
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

    /** 
     * Handle the merge case on the left movement. 
     * For example: [2, 2] => [4]
     * [2, 2, 2] => [4, 2]
     * [2, 2, 4] => [4, 4]
     * [4, 2, 2] => [4, 4]
     * [2, 2, 2, 2] => [4, 4]
     */
    leftMerge(existingNumbersOnRow) {
        const newRow = [];
        while (existingNumbersOnRow.length > 0) {
            if (existingNumbersOnRow.length === 1) {
                const a = existingNumbersOnRow.shift();
                newRow.push(a);
            } else {
                const a = existingNumbersOnRow[0];
                const b = existingNumbersOnRow[1];
                if (a === b) {
                    newRow.push(a + b);
                    this.updateScoreDom(a + b);
                    existingNumbersOnRow.shift();
                    existingNumbersOnRow.shift();
                } else {
                    newRow.push(a);
                    existingNumbersOnRow.shift();
                }
            }
        }
        return newRow;
    }

    /** Action event handle for the up movement. */
    moveUp() {
        for (let col = 0; col < 4; col++) {
            const existingNumbersOnColumn = [];
            /** 1, */
            for (let row = 0; row < 4; row++) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                if (currentTile.getAttribute("value") !== "0") {
                    existingNumbersOnColumn.push(Number(currentTile.getAttribute("value")));
                }
            }

            // console.log("existingNumbersOnColumn: ", existingNumbersOnColumn);
            const newColumn = this.upMerge(existingNumbersOnColumn);
            // console.log(`Move up new column: ${newColumn}`);

            /** 2. */
            for (let row = 0; row < 4; row++) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                if (newColumn.length) {
                    const tileValue = newColumn.shift();
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
    /** 
     * Handle the merge case on the right movement. 
     * For example: [2, 2] => [4]
     * [2, 2, 2] => [4, 2]
     * [2, 2, 4] => [4, 4]
     * [4, 2, 2] => [4, 4]
     * [2, 2, 2, 2] => [4, 4]
     */

    upMerge(existingNumbersOnColumn) {
        const newColumn = [];
        while (existingNumbersOnColumn.length > 0) {
            if (existingNumbersOnColumn.length === 1) {
                const a = existingNumbersOnColumn.shift();
                newColumn.push(a);
            } else {
                const a = existingNumbersOnColumn[0];
                const b = existingNumbersOnColumn[1];
                if (a === b) {
                    newColumn.push(a + b);
                    this.updateScoreDom(a + b);
                    existingNumbersOnColumn.shift();
                    existingNumbersOnColumn.shift();
                } else {
                    newColumn.push(a);
                    existingNumbersOnColumn.shift();
                }
            }
        }
        return newColumn;
    }


    /** Action event handle for the down movement. */
    moveDown() {
        for (let col = 0; col < 4; col++) {
            const existingNumbersOnColumn = [];
            /** 1, */
            for (let row = 0; row < 4; row++) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                if (currentTile.getAttribute("value") !== "0") {
                    existingNumbersOnColumn.push(Number(currentTile.getAttribute("value")));
                }
            }

            // console.log("existingNumbersOnColumn: ", existingNumbersOnColumn);
            const newColumn = this.downMerge(existingNumbersOnColumn)
            // console.log(`Move right new row: ${newColumn}`);

            /** 2. */
            for (let row = 3; row >= 0; row--) {
                const currentTileIndex = row * 4 + col;
                const currentTile = this.tiles[currentTileIndex];
                if (newColumn.length) {
                    const tileValue = newColumn.pop();
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

    /** 
     * Handle the merge case on the down movement. 
     * For example: [2, 2] => [4]
     * [2, 2, 2] => [4, 2]
     * [2, 2, 4] => [4, 4]
     * [4, 2, 2] => [4, 4]
     * [2, 2, 2, 2] => [4, 4]
     */

    downMerge(existingNumbersOnColumn) {
        const newColumn = [];
        while (existingNumbersOnColumn.length > 0) {
            if (existingNumbersOnColumn.length === 1) {
                const a = existingNumbersOnColumn.pop();
                newColumn.unshift(a);
            } else {
                const a = existingNumbersOnColumn[existingNumbersOnColumn.length - 1];
                const b = existingNumbersOnColumn[existingNumbersOnColumn.length - 2];
                if (a === b) {
                    newColumn.unshift(a + b);
                    this.updateScoreDom(a + b);
                    existingNumbersOnColumn.pop();
                    existingNumbersOnColumn.pop();
                } else {
                    newColumn.unshift(a);
                    existingNumbersOnColumn.pop();
                }
            }
        }
        return newColumn;
    }


    /** Checks if the user win the game. */
    checkWin(mergeNumber) {
        return WIN_SCORE === mergeNumber;
    }

    /** Checks if the user lose the game. */
    checkLose() {
        // console.log(`non zero check: ${this.validateAllHaveNumbers()}`);
        // console.log(`non duplicate row check: ${this.validateNoDuplicateOnRow()}`);
        // console.log(`non duplicate column check: ${this.validateNoDuplicateOnColumn()}`);
        return this.validateAllHaveNumbers() && this.validateNoDuplicateOnRow() && this.validateNoDuplicateOnColumn();
    }

    /** 
     * Validates if all the tiles have non-zero value. 
     * return false if there are zeros.
     */
    validateAllHaveNumbers() {
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            const value = tile.getAttribute("value");
            if (value === "0") return false;
        }
        return true;
    }


    /** 
     * Validates if there are no duplicate on each row.
     * Returns false if any number can be merged on row.
     */
    validateNoDuplicateOnRow() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const currentTileIndex = row * 4 + col;
                const tileAValue = this.tiles[currentTileIndex].getAttribute('value');
                const tileBValue = this.tiles[currentTileIndex + 1].getAttribute('value');
                if (tileAValue === tileBValue) return false;
            }
        }
        return true;
    }

    /** 
     * Validates if there are no duplicate on each column.
     * Returns false if any number can be merged on column.
     */
    validateNoDuplicateOnColumn () {
        for(let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row ++) {
                const currentTileIndex = row * 4 + col;
                const tileAValue = this.tiles[currentTileIndex].getAttribute("value");
                const tileBValue = this.tiles[currentTileIndex + 4].getAttribute("value");
                if (tileAValue === tileBValue) return false;
            }
        }
        return true;
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
    // console.log("click the start button");
    game.reStart();
});

/** When browser dedects loading, it will load this. */
window.onload = () => {
    // console.log("Onload!");
    game = new Game();
}

/** When user hits any keys on the keyboard, it should listen to it. */
window.onkeydown = (e) => {
    /** Prevent the default setting for browser. For example, scroll the page by hitting top/down. */
    e.preventDefault();

    switch (e.keyCode) {
        case UP:
            // console.log("You hit UP!");
            game.moveTile(UP);
            break;
        case RIGHT:
            // console.log("You hit RIGHT!");
            game.moveTile(RIGHT);
            break;
        case DOWN:
            // console.log("You hit DOWN!");
            game.moveTile(DOWN);
            break;
        case LEFT:
            // console.log("You hit LEFT!");
            game.moveTile(LEFT);
            break;
        default:
            break;
    }
}