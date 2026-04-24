import { useState } from "react"

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const [selected, setSelected] = useState(null);
  let xPieces = squares.filter(s => s === "X").length;
  let oPieces = squares.filter(s => s === "O").length;

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext && xPieces < 3) {
      if (squares[i]) return;
      nextSquares[i] = "X";
    } else if (!xIsNext && oPieces < 3) {
      if (squares[i]) return;
      nextSquares[i] = "O";
    } else if (xIsNext && xPieces === 3) {
      if (selected !== null) {
        if (isMovable(squares, selected, i, "X")) {
          nextSquares[i] = squares[selected];
          nextSquares[selected] = squares[i];
          setSelected(null);
          setSquares(nextSquares);
          setXIsNext(!xIsNext);
          return;
        } else {
          setSelected(null);
          return;
        }
      } else {
        if (squares[i] === "X") {
          setSelected(i);
          return;
        }
      }
    } else if (!xIsNext && oPieces === 3) {
      if (selected !== null) {
        if (isMovable(squares, selected, i, "O")) {
          nextSquares[i] = squares[selected];
          nextSquares[selected] = squares[i];
          setSelected(null);
          setSquares(nextSquares);
          setXIsNext(!xIsNext);
          return;
        } else {
          setSelected(null);
          return;
        }
      } else {
        if (squares[i] === "O") {
          setSelected(i);
          return;
        }
      }
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    if (selected !== null) {
      status += " select next destination";
    }
  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function isMovable(squares, start, end, letter) {
  if (squares[end]) return false;

  const validIndices = [
    [1, 3, 4],
    [0, 2, 3, 4, 5],
    [1, 4, 5],
    [0, 1, 2, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7]
  ];

  if (validIndices[start].includes(end) && squares[4] === letter && start !== 4) {
    const newSquares = squares.slice();
    newSquares[start] = squares[end];
    newSquares[end] = squares[start];

    if (calculateWinner(newSquares)) {
      return true;
    } else {
      return false;
    }
  }

  return validIndices[start].includes(end);
}