export class GameOfLife {
    public genes: number[][] = [];
    public score = 0;

    createRandom(rows, columns) {
        this.genes = [];
        for (let j = 0; j < rows; j++) { // iterate through rows
            this.genes[j] = [];
            for (let k = 0; k < columns; k++) { // iterate through columns
                const rawRandom = Math.random(); // get a raw random number
                // const improvedNum = (rawRandom * 2); // convert it to an int
                // const randomBinary = Math.floor(improvedNum);
                if (rawRandom > 0.99) {
                    this.genes[j][k] = 1;
                } else {
                    this.genes[j][k] = 0;
                }
            }
        }
    }

    mutate() {
        for (let j = 0; j < this.genes.length; j++) {
            for (let k = 0; k < this.genes[0].length; k++) {
                const rawRandom = Math.random();
                if (rawRandom > 0.99) {
                    this.genes[j][k] = this.genes[j][k] ? 0 : 1;
                }
            }
        }
    }

    mate(game: GameOfLife) {
        const out = [
            new GameOfLife(), new GameOfLife()
        ];
        for (let j = 0; j < this.genes.length; j++) {
            out[0].genes[j] = [];
            out[1].genes[j] = [];
            for (let k = 0; k < this.genes[0].length; k++) {
                const rawRandom = Math.random();
                if (rawRandom > 0.5) {
                    out[0].genes[j][k] = this.genes[j][k];
                    out[1].genes[j][k] = game.genes[j][k];
                } else {
                    out[0].genes[j][k] = game.genes[j][k];
                    out[1].genes[j][k] = this.genes[j][k];
                }
            }
        }
        out[0].mutate();
        out[1].mutate();
        return out;
    }
}
