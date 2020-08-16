import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.scss']
})
export class GameOfLifeComponent implements OnInit, AfterViewInit {
  @Input()
  public startGrid: number[][] = null;

  @Input()
  public isBest = false;

  @Input()
  public generation: number;

  public theGrid: number[][];
  public mirrorGrid: number[][];

  @Input()
  public cycles = 0;

  @ViewChild('startingCanvas')
  startingCanvas: ElementRef<HTMLCanvasElement>;
  public startingCanvasContext: CanvasRenderingContext2D;

  @ViewChild('myCanvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  private previousStates: string[] = [];

  public dead = false;

  @Output()
  public done: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.theGrid = this.createGrid();
    for (let j = 0; j < this.startGrid.length; j++) { // iterate through rows
      for (let k = 0; k < this.startGrid[0].length; k++) { // iterate through columns
        this.theGrid[j][k] = this.startGrid[j][k];
      }
    }
    this.mirrorGrid = this.createGrid();
  }

  ngAfterViewInit() {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.startingCanvasContext = this.startingCanvas.nativeElement.getContext('2d');
    this.drawGrid(this.startingCanvasContext, this.startGrid);
    if (!this.isBest) {
      this.tick();
    }
  }

  public start() {
    this.cycles = 0;
    this.tick();
  }

  public tick(): void { // main loop
    let currentState = '';
    for (let j = 0; j < this.startGrid.length; j++) { // iterate through rows
      for (let k = 0; k < this.startGrid[0].length; k++) { // iterate through columns
        currentState += String(this.theGrid[j][k]);
      }
    }
    if (this.previousStates.indexOf(currentState) === -1) {
      setTimeout(() => {
        this.previousStates.push(currentState);
        if (this.previousStates.length > 50) {
          this.previousStates.shift();
        }
        this.cycles++;
        this.drawGrid(this.context, this.theGrid);
        this.updateGrid();
        requestAnimationFrame(() => this.tick());
      });
    } else {
      this.done.emit(this.cycles);
    }
  }

  public createGrid(): number[][] {
    const arr = [];
    for (let i = 0; i < this.startGrid.length; i++) {
      arr[i] = [];
      for (let j = 0; j < this.startGrid[0].length; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }

  public drawGrid(context, whichGrid): void {
    context.clearRect(0, 0, this.startGrid[0].length, this.startGrid.length); // this should clear the canvas ahead of each redraw
    for (let j = 1; j < this.startGrid.length; j++) { // iterate through rows
      for (let k = 1; k < this.startGrid[0].length; k++) { // iterate through columns
        if (whichGrid[j][k] === 1) {
          context.fillStyle = '#FF0000';
          context.fillRect(j, k, 1, 1);
        }
      }
    }
  }

  public updateGrid(): void { // perform one iteration of grid update
    for (let j = 1; j < this.startGrid.length - 1; j++) { // iterate through rows
      for (let k = 1; k < this.startGrid[0].length - 1; k++) { // iterate through columns
        let totalCells = 0;
        // add up the total values for the surrounding cells
        totalCells += this.theGrid[j - 1][k - 1]; // top left
        totalCells += this.theGrid[j - 1][k]; // top center
        totalCells += this.theGrid[j - 1][k + 1]; // top right

        totalCells += this.theGrid[j][k - 1]; // middle left
        totalCells += this.theGrid[j][k + 1]; // middle right

        totalCells += this.theGrid[j + 1][k - 1]; // bottom left
        totalCells += this.theGrid[j + 1][k]; // bottom center
        totalCells += this.theGrid[j + 1][k + 1]; // bottom right


        // apply the rules to each cell
        if (this.theGrid[j][k] === 0) {
          switch (totalCells) {
            case 3:
              this.mirrorGrid[j][k] = 1; // if cell is dead and has 3 neighbours, switch it on
              break;
            default:
              this.mirrorGrid[j][k] = 0; // otherwise leave it dead
          }
        } else if (this.theGrid[j][k] === 1) { // apply rules to living cell
          switch (totalCells) {
            case 0:
            case 1:
              this.mirrorGrid[j][k] = 0; // die of lonelines
              break;
            case 2:
            case 3:
              this.mirrorGrid[j][k] = 1; // carry on living
              break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
              this.mirrorGrid[j][k] = 0; // die of overcrowding
              break;
            default:
              this.mirrorGrid[j][k] = 0; //
          }
        }
      }
    }

    for (let j = 0; j < this.startGrid.length; j++) { // iterate through rows
      for (let k = 0; k < this.startGrid[0].length; k++) { // iterate through columns
        this.theGrid[j][k] = this.mirrorGrid[j][k];
      }
    }
  }
}
