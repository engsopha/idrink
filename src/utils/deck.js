// Standard 52-card deck helpers for the Higher / Lower game.
// Ace is high: 2…10, J=11, Q=12, K=13, A=14. Suits are cosmetic only —
// comparisons use `value`.

export const RANKS = [
	{ rank: "2", value: 2 },
	{ rank: "3", value: 3 },
	{ rank: "4", value: 4 },
	{ rank: "5", value: 5 },
	{ rank: "6", value: 6 },
	{ rank: "7", value: 7 },
	{ rank: "8", value: 8 },
	{ rank: "9", value: 9 },
	{ rank: "10", value: 10 },
	{ rank: "J", value: 11 },
	{ rank: "Q", value: 12 },
	{ rank: "K", value: 13 },
	{ rank: "A", value: 14 },
];

export const SUITS = [
	{ key: "spades", symbol: "♠", red: false },
	{ key: "hearts", symbol: "♥", red: true },
	{ key: "diamonds", symbol: "♦", red: true },
	{ key: "clubs", symbol: "♣", red: false },
];

// Returns a freshly shuffled array of 52 card objects.
export const createDeck = () => {
	const deck = [];
	for (const suit of SUITS) {
		for (const { rank, value } of RANKS) {
			deck.push({
				id: `${rank}-${suit.key}`,
				rank,
				value,
				suit: suit.key,
				symbol: suit.symbol,
				red: suit.red,
			});
		}
	}

	// Fisher–Yates shuffle.
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}

	return deck;
};
