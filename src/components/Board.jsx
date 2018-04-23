import React, {Fragment} from "react";
import "./board.css";
import * as faker from "faker";
import { randomItem, randomNumber } from "../helpers";
import Modal from "./Modal";

export default class Board extends React.Component {
  board = {};
  state = {
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    board: {},
    ships: [],
    // turns
    currentTurns: 0,
    difficulty: {
      easy: 9999999,
      medium: 100,
      hard: 50,
    },
    selectedDifficulty: null,
    showTurnModal: true,
  };

  initBoard = () => {
    const rows = this.state.rows;
    const columns = this.state.columns;
    let board = this.board;

    for (let row of rows) {
      board[row] = new Array(columns.length);

      for (let column of columns) {
        board[row][column] = {
          row,
          column,
          ship: null,
          landed: null,
          cssClass: 'the-column',
        };
      }
    }

    /**
     * Create default ships
     * Ships: 1, Size: 4
     * Ships: 2, Size: 3
     * Ships: 3, Size: 2
     * Ships: 4, Size: 1
     */
    const sizeOneShips = this.createShips(4, 1, "#2427CC");
    const sizeTwoShips = this.createShips(3, 2, "#7C2738");
    const sizeThreeShips = this.createShips(2, 3, "#B8962E");
    const sizeFourShips = this.createShips(1, 4, "#B8512E");

    return this.setState({ board: board, ships: [...sizeOneShips, ...sizeTwoShips, ...sizeThreeShips, ...sizeFourShips] });
  };

  getCell = (row, column) => this.board[row][column];

  generateVerticalShip = (size) => {
    let cells = [];
    let randomColumn = randomItem(this.state.columns);
    let rowRangeBegin = randomNumber(1, this.state.rows.length);
    const randomRows = this.state.rows.slice(rowRangeBegin, rowRangeBegin + size);

    for (let row of randomRows) {
      const theCell = this.getCell(row, randomColumn);
      cells.push(theCell);
    }

    return cells;
  };

  generateHorizontalShip = (size) => {
    let cells = [];
    let randomRow = randomItem(this.state.rows);
    let columnRangeBegin = randomNumber(1, this.state.columns.length);
    const randomColumns = this.state.columns.slice(columnRangeBegin, columnRangeBegin + size);

    for (let column of randomColumns) {
      const theCell = this.getCell(randomRow, column);
      cells.push(theCell);
    }

    return cells;
  };

  getEmptyCells = (size) => {
    let cells;
    let partsCount;
    do {
      partsCount = 0;
      const isVertical = faker.random.boolean();

      cells = isVertical ? this.generateVerticalShip(size) : this.generateHorizontalShip(size);

      for (let cell of cells) {
        partsCount = partsCount + (cell["ship"] === null ? 1 : 0);
      }
    } while (partsCount !== size);

    return cells;
  };

  setShipPartInBoard = (ship, row, column) => {
    this.board[row][column]["ship"] = { ...ship };
  };

  createShips = (quantity = 1, size = 1, color) => {
    const ships = [];

    for (let temp = 1; temp <= quantity; temp++) {
      const parts = [];
      const shipName = `${faker.random.word()}-${size}`;
      const emptyCells = this.getEmptyCells(size);

      emptyCells.map(cell => {
        const part = {
          name: shipName,
          row: cell["row"],
          column: cell["column"],
          color,
          touched: false,
        };

        parts.push(part);

        return this.setShipPartInBoard(part, cell["row"], cell["column"]);
      });

      ships.push({
        name: shipName,
        parts,
        sunk: false,
      });
    }

    return ships;
  };

  initGame = () => {
    this.initBoard();
  };

  componentDidMount() {
    this.initGame();
  }

  handleChooseDifficulty = (level) => {
    const turns = this.state.difficulty[level];
    this.setState({selectedDifficulty: level, currentTurns: turns, showTurnModal: false});
  };

  handleChooseCell = (row, column) => {
    const board = this.state.board;
    const stateShips = this.state.ships;
    const cell = board[row][column];

    cell['landed'] = cell['ship'] !== null;
    if (cell['ship']) {
      const ship = cell['ship'];
      cell['cssClass'] = 'the-column ship-touched';
      // Changed the part to touched state
      stateShips.filter(stateShip => stateShip['name'] === ship['name']).map(ship => {
        ship['parts']
          .filter(part => {
            return part['row'] === cell['row'] && part['column'] === cell['column'];
          })
          .map(part => {
            part['touched'] = true;
            return part;
          });
        return ship;
      });
      // Check if the ship is shunk
      stateShips.map(ship => {
        const touchedParts = ship['parts'].filter(part => part['touched']);
        if (touchedParts.length === ship['parts'].length) {
          ship['sunk'] = true;
          ship['parts'].map(part => {
            const cellOfPart = board[part['row']][part['column']];
            cellOfPart['cssClass'] = 'the-column ship-shunked';
          });
        }
        return ship;
      });
    } else {
      cell['cssClass'] = 'the-column ship-untouched';
    }

    board[row][column] = {...cell};
    this.setState({ board, ships: stateShips });
  };

  render() {
    const board = this.state.board;
    let table = [];
    for (let indexRow in board) {
      const columns = [];
      if (!board.hasOwnProperty(indexRow)) {
        continue;
      }

      for (let indexColumn in board[indexRow]) {
        if (!board[indexRow].hasOwnProperty(indexColumn)) {
          continue;
        }

        const cell = board[indexRow][indexColumn];

        columns.push(
          <div key={`${indexRow}${indexColumn}`}
               onClick={() => this.handleChooseCell(indexRow, indexColumn)}
               className={cell['cssClass']}>
            {`${indexRow}${indexColumn}`}
          </div>
        );
      }
      table.push(
        <div key={indexRow} className="the-row">
          {columns}
        </div>
      );
    }

    return (
      <Fragment>
        <Modal showModal={this.state.showTurnModal} difficulty={this.state.selectedDifficulty} changeDifficulty={this.handleChooseDifficulty}/>
        <div className="columns is-gapless">
          <div className="column is-one-third">
            <section className="hero is-dark is-fullheight">
              <h1>lol</h1>
            </section>
          </div>
          <div className="column">
            <section className="hero is-info is-fullheight">
              <div className="hero-body">
                <div className="the-table">{table}</div>
              </div>
              <div className="hero-foot">
                <div className="tabs is-fullwidth">
                  <ul>
                    <li><a>Turns: {this.state.currentTurns}</a></li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Fragment>
    );
  }
}
