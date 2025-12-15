let audioCtx;

export function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Silent buffer to unlock iOS
    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
}

export function playSound(type) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'break') {
        osc.type = 'square'; 
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(40, t+0.1);
        gain.gain.setValueAtTime(0.1, t); 
        gain.gain.linearRampToValueAtTime(0, t+0.1);
        osc.start(t); osc.stop(t+0.1);
    } else if (type === 'bird') {
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(1500, t);
        osc.frequency.linearRampToValueAtTime(2500, t+0.1);
        gain.gain.setValueAtTime(0.05, t); 
        gain.gain.linearRampToValueAtTime(0, t+0.1);
        osc.start(t); osc.stop(t+0.1);
    }
}
