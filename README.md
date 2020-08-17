# Conway's Genetic Game of Life

See it in action at https://ga-life.lex-dev.ml

This is a simulation of Conway's Game of Life using a genetic algorithm to find
random starting patterns that will run for as long as possible inside of a 50x50 game board.
For the first generation, all boards are seeded randomly about 1% filled. Each generation
operates as follows:

1. Each board is simulated following Conway's rules until reaching a halted state.
    * Each game keeps track of the previous 50 board states. Due to the deterministic nature of Conway's rules, when we reach a state that appears in this list the game is considered halted.
    * Many simulations result in small patterns that run forever, but we want to find something that repeats infinitely in a big interesting way.
2. The bottom N performers (as entered below) are culled.
3. N new members are randomly seeded and added to the population
4. Boards are randomly paired and produce 2 offspring, each having half of their parent's board patterns.
5. Child boards are given a 1% chance to mutate for each cell.
6. Child boards become the population for the next generation. Repeat from 1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
