const audio = document.getElementById('anniversary-audio');
const statusMsg = document.getElementById('status-msg');
const typewriter = document.getElementById('typewriter-text');

const memories = [
    "Remember the Dodge Stratus?",
    "Windows down, blasting 5SOS...",
    "Those long drives where we talked about everything.",
    "Ten years later, and I'd still drive anywhere with you.",
    "I love you, Kimberly."
];

function playMemories() {
    audio.play();
    statusMsg.innerText = "PLAYING: 5SOS - STRATUS SESSIONS";
    document.getElementById('play-btn').style.display = 'none';
    
    let i = 0;
    function nextText() {
        if (i < memories.length) {
            typewriter.innerText = memories[i];
            i++;
            setTimeout(nextText, 4000); // Changes text every 4 seconds
        }
    }
    nextText();
}
