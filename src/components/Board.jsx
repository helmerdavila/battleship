import React from "react";
import "./board.css";
import * as faker from "faker";

export default class Board extends React.Component {
  state = {
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    board: {},
    ships: {},
  };

  createBoard = () => {
    let board = this.state.board;
    const rows = this.state.rows;
    const columns = this.state.columns;

    for (let row of rows) {
      board[row] = new Array(columns.length);
      for (let column of columns) {
        board[row][column] = {
          ship: null,
          touched: false,
        };
      }
    }

    console.log(board);
    return this.setState({ board: {...board} });
  };

  createShips = () => {
    // here is the ship creation
  }; 

  initGame = async () => {
    await this.createBoard();
    await this.createShips();
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
        columns.push(<div key={`${indexRow}${indexColumn}`} className="the-column">{`${indexRow}${indexColumn}`}</div>);
      }
      table.push(<div key={indexRow} className="the-row">{columns}</div>);
    }

    return (
      <section className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="the-table">
            {table}
          </div>
        </div>
      </section>
    );
  }
}