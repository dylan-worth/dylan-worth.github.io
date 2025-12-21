import { addChatMessage } from './chat.js';

let selectedSquare = null; // {x, y}

const PIECES = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', 
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'  
};

// 8x8 Board
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
        chessWin.style.display = 'block'; 
        window.gameState.uiMode = 'chess';
        addChatMessage("You sit down at the chessboard.", "cyan");
        renderBoard();
    }
}

function handleSquareClick(x, y) {
    const clickedVal = BOARD[y][x];

    // CASE 1: Select a Piece
    if (!selectedSquare) {
        if (clickedVal !== ' ') {
            selectedSquare = { x, y };
            // addChatMessage(`Selected ${clickedVal}`, "yellow");
            renderBoard();
        }
        return;
    }

    // CASE 2: Deselect (Click same square)
    if (selectedSquare.x === x && selectedSquare.y === y) {
        selectedSquare = null;
        renderBoard();
        return;
    }

    // CASE 3: Move
    // Get the piece we are moving
    const piece = BOARD[selectedSquare.y][selectedSquare.x];
    
    // Update Board Data
    BOARD[y][x] = piece; // Place piece in new spot
    BOARD[selectedSquare.y][selectedSquare.x] = ' '; // Clear old spot
    
    // addChatMessage(`Moved to ${x},${y}`, "lime");
    
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
            
            // Background Color
            let bgColor = ((x+y)%2 === 0) ? '#f0d9b5' : '#b58863';
            
            // Highlight Selection
            if (selectedSquare && selectedSquare.x === x && selectedSquare.y === y) {
                bgColor = '#6a9c49'; // Green
            }
            
            sq.style.backgroundColor = bgColor;

            // Render Piece
            const piece = BOARD[y][x];
            if (piece !== ' ') {
                sq.innerText = PIECES[piece];
                sq.style.color = (piece === piece.toUpperCase()) ? 'white' : 'black';
                sq.style.textShadow = '1px 1px 0 #000'; 
                sq.style.cursor = 'pointer';
            }

            sq.onclick = () => handleSquareClick(x, y);
            grid.appendChild(sq);
        }
    }
}
