import { addChatMessage } from './chat.js';

// Game State
let selectedSquare = null; // {x, y}

const PIECES = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', // Black
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'  // White
};

// Board State (Mutable)
const BOARD = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

export function openChess() {
    const chessWin = document.getElementById('chess-window');
    if (chessWin) {
        chessWin.style.display = 'block'; // Changed from flex to block for better layout
        window.gameState.uiMode = 'chess';
        addChatMessage("You sit down at the chessboard.", "cyan");
        renderBoard();
    }
}

function handleSquareClick(x, y) {
    const clickedPiece = BOARD[y][x];

    // 1. If nothing selected, try to select a piece
    if (!selectedSquare) {
        if (clickedPiece !== ' ') {
            selectedSquare = { x, y };
            addChatMessage(`Selected: ${clickedPiece}`, "yellow");
            renderBoard(); // Re-render to show highlight
        }
        return;
    }

    // 2. If something IS selected...
    
    // If clicking the SAME square, deselect
    if (selectedSquare.x === x && selectedSquare.y === y) {
        selectedSquare = null;
        renderBoard();
        return;
    }

    // Otherwise, MOVE the piece (Capture if needed)
    const movingPiece = BOARD[selectedSquare.y][selectedSquare.x];
    
    // Execute Move
    BOARD[y][x] = movingPiece;
    BOARD[selectedSquare.y][selectedSquare.x] = ' '; // Clear old spot
    
    addChatMessage(`Moved to ${String.fromCharCode(97+x)}${8-y}`, "lime");
    
    // Deselect and Render
    selectedSquare = null;
    renderBoard();
}

function renderBoard() {
    const grid = document.getElementById('chess-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for(let y=0; y<8; y++) {
        for(let x=0; x<8; x++) {
            const sq = document.createElement('div');
            sq.className = 'chess-square';
            
            // 1. Determine Background Color
            let bgColor = ((x+y)%2 === 0) ? '#f0d9b5' : '#b58863';
            
            // 2. Highlight Selected Square
            if (selectedSquare && selectedSquare.x === x && selectedSquare.y === y) {
                bgColor = '#6a9c49'; // Green Highlight
            }
            
            sq.style.backgroundColor = bgColor;

            // 3. Draw Piece
            const piece = BOARD[y][x];
            if (piece !== ' ') {
                sq.innerText = PIECES[piece];
                sq.style.color = (piece === piece.toUpperCase()) ? 'white' : 'black';
                sq.style.textShadow = '1px 1px 0 #000'; 
                sq.style.cursor = 'pointer';
            }

            // 4. Click Handler
            sq.onclick = () => handleSquareClick(x, y);

            grid.appendChild(sq);
        }
    }
}
