import { addChatMessage } from './chat.js';

const PIECES = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', // Black
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'  // White
};

const INITIAL_BOARD = [
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
        chessWin.style.display = 'flex';
        window.gameState.uiMode = 'chess';
        addChatMessage("You sit down at the chessboard.", "cyan");
        renderBoard();
    }
}

function renderBoard() {
    const grid = document.getElementById('chess-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for(let y=0; y<8; y++) {
        for(let x=0; x<8; x++) {
            const sq = document.createElement('div');
            sq.className = 'chess-square';
            
            // Color checkerboard
            if ((x+y)%2 === 0) sq.style.backgroundColor = '#f0d9b5';
            else sq.style.backgroundColor = '#b58863';

            // Add piece
            const piece = INITIAL_BOARD[y][x];
            if (piece !== ' ') {
                sq.innerText = PIECES[piece];
                sq.style.color = (piece === piece.toUpperCase()) ? 'white' : 'black';
                sq.style.textShadow = '1px 1px 0 #000'; // Outline
            }

            sq.onclick = () => {
                addChatMessage(`Clicked square: ${String.fromCharCode(97+x)}${8-y}`, "white");
            };

            grid.appendChild(sq);
        }
    }
}
