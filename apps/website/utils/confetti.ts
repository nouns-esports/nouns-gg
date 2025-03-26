import { confetti as tsParticlesConfetti } from "@tsparticles/confetti";

export function confetti() {
	const duration = 15 * 300;
	const animationEnd = Date.now() + duration;
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	function randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(() => {
		const timeLeft = animationEnd - Date.now();
		if (timeLeft <= 0) {
			return clearInterval(interval);
		}
		const particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		tsParticlesConfetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			}),
		);
		tsParticlesConfetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			}),
		);

		const confettiContainer = document.getElementById("confetti");

		if (confettiContainer && confettiContainer.style.pointerEvents !== "none") {
			confettiContainer.style.pointerEvents = "none";
		}
	}, 250);
}
