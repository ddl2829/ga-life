import { Component, ViewChildren, OnInit, QueryList } from '@angular/core';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';
import { GameOfLife } from './game-of-life/game-of-life';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ga-life';
  genes: GameOfLife[];
  startingPopulation = 24;
  columns = 50;
  rows = 50;
  round = 1;
  completeGames = 0;
  numberToCull = 2;
  currentStep = 'seeding gene pool';
  generationsPerGene = [];
  bestPerformers: GameOfLife[] = [];
  running = false;

  @ViewChildren(GameOfLifeComponent)
  public children: QueryList<GameOfLifeComponent>;

  constructor() {
  }

  ngOnInit() {
    this.currentStep = 'waiting to start';
  }

  startSimulation() {
    this.genes = [];
    for (let i = 0; i < this.startingPopulation; i++) {
      const gene = new GameOfLife();
      gene.createRandom(this.rows, this.columns);
      this.genes.push(gene);
      // this.fillRandom(this.genes[i]);
    }
    this.currentStep = 'running simulation';
    this.running = true;
  }

  private shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  public done(gene: GameOfLife, generations: number) {
    // this.generationsPerGene[index] = generations;
    gene.score = generations;
    this.completeGames++;
    if (this.completeGames === this.genes.length) {
      this.currentStep = 'killing weakest ' + this.numberToCull + ' individuals';
      // const lowestValue = this.genes.map(g => g.score).sort((a, b) => a - b)[0];
      // const highestValue = this.genes.map(g => g.score).sort((a, b) => b - a)[0];
      setTimeout(() => {
        const bestPerformer = this.genes.sort((a, b) => b.score - a.score)[0];
        this.bestPerformers.unshift(bestPerformer);

        const numToKill = this.numberToCull;

        this.genes = this.genes.sort((a, b) => a.score - b.score).filter((child, index) => {
          return index > (numToKill - 1);
        });

        const nextGenes: GameOfLife[] = [];
        setTimeout(() => {
          this.currentStep = 'introducing new members';
          for (let q = 0; q < numToKill; q++) {
            const newGene = new GameOfLife();
            newGene.createRandom(this.rows, this.columns);
            this.genes.push(newGene);
          }

          this.shuffle(this.genes);

          setTimeout(() => {
            this.currentStep = 'crossing over genes & mutating';
            while (this.genes.length > 1) {
              const gene1 = this.genes.shift();
              const gene2 = this.genes.shift();
              const children = gene1.mate(gene2);
              nextGenes.push(children[0]);
              nextGenes.push(children[1]);
            }

            while (nextGenes.length < this.startingPopulation) {
              const newGene = new GameOfLife();
              newGene.createRandom(this.rows, this.columns);
              nextGenes.push(newGene);
            }

            this.genes = [];
            this.completeGames = 0;

            setTimeout(() => {
              this.currentStep = 'running simulation';
              this.round++;
              this.genes = nextGenes;
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }
}
