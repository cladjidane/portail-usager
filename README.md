# portail-usager

## A propos

Nouvelle application front-end client du site conseillé numérique (https://www.conseiller-numerique.gouv.fr/).
Vise à remplacer à terme l'existant.

## Prerequisites

[Yarn](https://yarnpkg.com/)

## Installation

- Run `yarn install` to install dependencies.

## Usage

### Run the app

Run `yarn start`. Navigate to `http://localhost:4200/`.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Test

Run `yarn test` to test the project.

### Lint

#### Code lint

Run `yarn lint` to lint the solution.

#### Style lint

Run `yarn stylelint` to lint the project.

### Prettier

Run `yarn prettier` to prettyfy the solution.

### Pre-commit hooks

Activated pre-commits hooks are :

- prettier.
- lint-staged: lint the files staged for commit.
