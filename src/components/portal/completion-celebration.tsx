"use client";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 13) % 100}%`,
  delay: `${(index % 6) * 0.14}s`,
  duration: `${4 + (index % 4) * 0.35}s`,
}));

export function CompletionCelebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="confetti-piece"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
