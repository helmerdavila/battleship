import React from "react";
import "./board.css";
import * as faker from "faker";
import { randomItem, randomNumber } from "../helpers";

export default class Board extends React.Component {
  board = {};
  state = {
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    board: {},
    ships: {}
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
          touched: false
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
    this.createShips(4, 1, "#277C6B");
    this.createShips(3, 2, "#7C2738");
    this.createShips(2, 3, "#B8962E");
    this.createShips(1, 4, "#B8512E");

    return this.setState({ board: board });
  };

  getCell = (row, column) => this.board[row][column];

  getEmptyCells = (size) => {
    let cells;
    let partsCount;
    do {
      partsCount = 0;
      cells = [];
      const isVertical = faker.random.boolean();

      if (isVertical) {
        let randomColumn = randomItem(this.state.columns);
        let rowRangeBegin = randomNumber(1, this.state.rows.length);
        const randomRows = this.state.rows.slice(rowRangeBegin, rowRangeBegin + size);

        for (let row of randomRows) {
          const theCell = this.getCell(row, randomColumn);
          cells.push(theCell);
        }
      } else {
        let randomRow = randomItem(this.state.rows);
        let columnRangeBegin = randomNumber(1, this.state.columns.length);
        const randomColumns = this.state.columns.slice(columnRangeBegin, columnRangeBegin + size);

        for (let column of randomColumns) {
          const theCell = this.getCell(randomRow, column);
          cells.push(theCell);
        }
      }

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
      const ship = [];
      const shipName = `${faker.random.word()}-${size}`;
      const emptyCells = this.getEmptyCells(size);

      emptyCells.map(cell => {
        const part = {
          shipName,
          row: cell["row"],
          column: cell["column"],
          touched: false,
          color,
        };

        ship.push(part);

        return this.setShipPartInBoard(part, cell["row"], cell["column"]);
      });

      ships[shipName] = ship;
    }
  };

  initGame = () => {
    this.initBoard();
  };

  componentDidMount() {
    this.initGame();
  }

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
        const backgroundColorCell = cell['ship'] !== null ? cell['ship']['color'] : null;
        columns.push(
          <div key={`${indexRow}${indexColumn}`} className="the-column" style={{ backgroundColor: backgroundColorCell }}>
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
      <section className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="the-table">{table}</div>
        </div>
      </section>
    );
  }
}
