function createOscillator(context, frequency, duration) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.5, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
  
  return { oscillator, gainNode };
}

export function createSoundEffects() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const jumpSound = () => {
    const { oscillator, gainNode } = createOscillator(audioContext, 400, 0.2);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };
  
  const dieSound = () => {
    const { oscillator, gainNode } = createOscillator(audioContext, 200, 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };
  
  const pointSound = () => {
    const { oscillator, gainNode } = createOscillator(audioContext, 600, 0.1);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };
  
  return {
    jump: jumpSound,
    die: dieSound,
    point: pointSound
  };
} 