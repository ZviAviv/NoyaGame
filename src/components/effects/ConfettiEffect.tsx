import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiEffect() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#e84393', '#6c5ce7', '#00b894', '#fdcb6e', '#ff6b6b'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4'],
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#ffd700', '#a29bfe', '#fd79a8'],
      });
    }, 300);
  }, []);

  return null;
}
