import React from "react";
import "./board.css";
import * as faker from "faker";
import { randomItem } from "../helpers";

export default class Board extends React.Component {
  state = {
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    board: {},
    ships: {}
  };

  initBoard = () => {
    let board = this.state.board;
    const rows = this.state.rows;
    const columns = this.state.columns;

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

    console.log(board);
    return this.setState({ board: { ...board } });
  };

  getCell = (row, column) => {
    return this.state.board[row][column];
  };

  getEmptyCell = () => {
    let cell = {};
    let randomRow = 0;
    let randomColumn = 0;
    do {
      randomRow = randomItem(this.state.rows);
      randomColumn = randomItem(this.state.columns);
      cell = this.getCell(randomRow, randomColumn);
    } while (cell["ship"] !== null);

    return cell;
  };

  setShipPartInBoard = (ship, row, column) => {
    const board = this.state.board;
    board[row][column]["ship"] = { ...ship };

    return this.setState({ board });
  };

  createShips = async (quantity = 1, size = 1, color) => {
    const ships = [];
    for (let temp = 1; temp <= quantity; temp++) {
      const ship = [];
      const shipName = `${faker.random.word()}-${size}`;
      for (let part = 1; part <= size; part++) {
        const emptyCell = this.getEmptyCell();
        const part = {
          shipName,
          row: emptyCell["row"],
          column: emptyCell["column"],
          touched: false,
          color,
        };

        ship.push(part);

        await this.setShipPartInBoard(
          part,
          emptyCell["row"],
          emptyCell["column"]
        );
      }
      ships[shipName] = ship;
    }

    return ships;
  };

  /**
   * Create default ships
   * Ships: 1, Size: 4
   * Ships: 2, Size: 3
   * Ships: 3, Size: 2
   * Ships: 4, Size: 1
   */
  initShip = async () => {
    //const ships = this.state.ships;
    const sizeOneShips = await this.createShips(4, 1, "#277C6B");

    console.log(sizeOneShips);

    // Create the size 1 ship for know if the site is filled and paint in the table
    // Create the size >= 1 for know if the side cell is filled

    //this.setState({ ships: {...ships} });
  };

  initGame = async () => {
    await this.initBoard();
    await this.initShip();
  };

  componentDidMount() {
    this.initGame();
  }

  render() {
    const board = this.state.board;
    let table = [];
    for (let indexRow in board) {
      const columns = [];
      for (let indexColumn in board[indexRow]) {
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
