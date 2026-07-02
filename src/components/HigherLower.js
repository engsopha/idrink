import React, { useEffect, useRef, useState } from "react";
import { GiCardRandom } from "react-icons/gi";
import { FiRefreshCw } from "react-icons/fi";

import { createDeck } from "../utils/deck";

const GRID_SIZE = 6;

const top = (pile) => (pile.length ? pile[pile.length - 1] : null);

/* ---------- Card visuals ---------- */

function CardFront({ card, size = "sm" }) {
	const color = card.red ? "text-red-600" : "text-slate-900";
	const corner = size === "lg" ? "text-2xl" : "text-sm";
	const center = size === "lg" ? "text-7xl" : "text-4xl";
	return (
		<div className="relative w-full h-full bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden">
			<div className={`absolute top-1 left-1.5 flex flex-col items-center leading-none ${color}`}>
				<span className={`font-bold ${corner}`}>{card.rank}</span>
				<span className={corner}>{card.symbol}</span>
			</div>
			<div className={`absolute inset-0 flex items-center justify-center ${color}`}>
				<span className={center}>{card.symbol}</span>
			</div>
			<div
				className={`absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180 ${color}`}
			>
				<span className={`font-bold ${corner}`}>{card.rank}</span>
				<span className={corner}>{card.symbol}</span>
			</div>
		</div>
	);
}

function CardBack() {
	return (
		<div
			className="w-full h-full rounded-lg border-2 border-white/80 shadow-md p-1"
			style={{
				background:
					"repeating-linear-gradient(45deg,#1e3a8a,#1e3a8a 6px,#1d4ed8 6px,#1d4ed8 12px)",
			}}
		>
			<div className="w-full h-full rounded border border-white/40 flex items-center justify-center">
				<GiCardRandom className="text-white/80 text-2xl" />
			</div>
		</div>
	);
}

// A count badge shared by piles.
function CountBadge({ count }) {
	return (
		<span className="absolute -bottom-2 -right-1 bg-slate-900 text-slate-300 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-slate-600 z-10">
			{count}
		</span>
	);
}

// A face-down, tappable pile of cards — depth reflects how many are left.
function CardStack({ count, disabled, onClick }) {
	const layers = Math.min(count, 3);
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="relative aspect-[3/4] w-full transition-transform active:scale-95 disabled:active:scale-100 focus:outline-none select-none"
			style={{ WebkitTapHighlightColor: "transparent" }}
		>
			{layers >= 3 && (
				<div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg bg-slate-900/50" />
			)}
			{layers >= 3 && (
				<div className="absolute inset-0 translate-x-1 translate-y-1">
					<CardBack />
				</div>
			)}
			{layers >= 2 && (
				<div className="absolute inset-0 translate-x-0.5 translate-y-0.5">
					<CardBack />
				</div>
			)}
			<div className="absolute inset-0">
				<CardBack />
			</div>
			<CountBadge count={count} />
		</button>
	);
}

// An empty pile slot.
function EmptySlot() {
	return (
		<div className="aspect-[3/4] w-full rounded-lg border-2 border-dashed border-slate-700" />
	);
}

/* ---------- Game ---------- */

export default function HigherLower() {
	const [piles, setPiles] = useState([]); // 6 stacks of cards
	const [referenceIndex, setReferenceIndex] = useState(0); // pile whose top is face-up
	const [selectedPile, setSelectedPile] = useState(null); // pile being revealed
	const [revealed, setRevealed] = useState(false);
	const cheerRef = useRef();

	const startNew = () => {
		const deck = createDeck(); // 52 shuffled
		const next = Array.from({ length: GRID_SIZE }, () => []);
		// Share all 52 across the 6 piles round-robin (uneven is fine: 9,9,9,9,8,8).
		deck.forEach((card, i) => next[i % GRID_SIZE].push(card));
		setPiles(next);
		setReferenceIndex(Math.floor(Math.random() * GRID_SIZE));
		setSelectedPile(null);
		setRevealed(false);
	};

	useEffect(() => {
		if (cheerRef.current) cheerRef.current.volume = 0.5;
		startNew();
	}, []);

	const handleSelect = (index) => {
		if (index === referenceIndex || selectedPile !== null || !piles[index].length) return;
		setSelectedPile(index);
		setRevealed(false);
	};

	const cancelSelection = () => {
		if (revealed) return; // must continue once revealed
		setSelectedPile(null);
	};

	const handleReveal = () => {
		if (revealed) return;
		setRevealed(true);
		// An exact tie (same rank as the reference) is objective — cheer for it!
		if (top(piles[selectedPile]).value === top(piles[referenceIndex]).value && cheerRef.current) {
			cheerRef.current.currentTime = 0;
			cheerRef.current.play().catch(() => {});
		}
	};

	const handleContinue = () => {
		const next = piles.map((p) => [...p]);
		next[referenceIndex].pop(); // discard the old reference card

		// The revealed pile's top becomes the new reference (it stays on its pile).
		const playable = next.some((p, idx) => idx !== selectedPile && p.length > 0);
		if (!playable) {
			// No more piles to flip — deal a fresh 52.
			startNew();
			return;
		}

		setPiles(next);
		setReferenceIndex(selectedPile);
		setSelectedPile(null);
		setRevealed(false);
	};

	if (!piles.length) return null;

	const remaining = piles.reduce((sum, p) => sum + p.length, 0);
	const reference = top(piles[referenceIndex]);

	return (
		<div className="min-h-full flex flex-col items-center p-5 pb-10 max-w-md mx-auto w-full">
			<div className="w-full flex items-center justify-between mb-1">
				<span className="flex items-center gap-1 text-slate-500 text-xs">
					<GiCardRandom /> {remaining} cards
				</span>
				<button
					type="button"
					onClick={startNew}
					className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-400 text-sm font-semibold transition-colors"
				>
					<FiRefreshCw /> Reshuffle
				</button>
			</div>

			<h2 className="text-white text-xl font-bold mb-1">Higher or Lower</h2>
			<p className="text-slate-400 text-sm mb-6 text-center">
				Call your guess out loud, then flip to see if you beat the{" "}
				<span className="text-yellow-400 font-semibold">glowing</span> card.
			</p>

			{/* Grid — all 52 cards live here across 6 piles; one pile's top is the reference */}
			<div className="grid grid-cols-2 gap-x-4 gap-y-6 w-full max-w-xs">
				{piles.map((pile, i) => {
					if (i === referenceIndex) {
						return (
							<div key={i} className="relative aspect-[3/4] w-full">
								<div className="absolute inset-0 rounded-lg ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-800">
									<CardFront card={reference} />
								</div>
								<span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10">
									BEAT THIS
								</span>
								<CountBadge count={pile.length} />
							</div>
						);
					}
					if (!pile.length) return <EmptySlot key={i} />;
					return (
						<CardStack
							key={i}
							count={pile.length}
							disabled={selectedPile !== null}
							onClick={() => handleSelect(i)}
						/>
					);
				})}
			</div>

			{/* Enlarged card popup */}
			{selectedPile !== null && (
				<div
					className="fixed inset-0 z-50 bg-black/75 flex flex-col items-center justify-center p-6"
					onClick={cancelSelection}
				>
					<div
						className="flex flex-col items-center gap-6"
						onClick={(e) => e.stopPropagation()}
					>
						<p className="text-slate-300 text-sm text-center">
							Beat the{" "}
							<span className={`font-bold ${reference.red ? "text-red-500" : "text-white"}`}>
								{reference.rank}
								{reference.symbol}
							</span>
						</p>

						{/* Big flip card — tap to reveal */}
						<button
							type="button"
							onClick={handleReveal}
							className="w-52 aspect-[3/4] active:scale-[0.98] transition-transform focus:outline-none select-none"
							style={{ perspective: 1000, WebkitTapHighlightColor: "transparent" }}
						>
							<div
								className="relative w-full h-full"
								style={{
									transformStyle: "preserve-3d",
									transition: "transform 0.5s",
									transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
								}}
							>
								<div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
									<CardBack />
								</div>
								<div
									className="absolute inset-0"
									style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
								>
									<CardFront card={top(piles[selectedPile])} size="lg" />
								</div>
							</div>
						</button>

						{!revealed ? (
							<p className="text-slate-400 text-sm text-center animate-pulse w-64">
								Say <span className="text-white font-semibold">Higher</span> or{" "}
								<span className="text-white font-semibold">Lower</span> out loud, then
								tap the card to flip it.
							</p>
						) : (
							<div className="text-center w-64">
								{top(piles[selectedPile]).value === reference.value ? (
									<p className="text-amber-400 text-lg font-bold mb-5">
										It's a tie! 🎉 Everyone drinks!
									</p>
								) : (
									<p className="text-slate-300 text-sm mb-5">
										Wrong guess?{" "}
										<span className="text-yellow-400 font-semibold">Drink!</span> The
										group decides. 🍺
									</p>
								)}
								<button
									type="button"
									onClick={handleContinue}
									className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-full active:scale-95 transition-transform"
								>
									Next player
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			<audio src="/sound.mp3" ref={cheerRef} preload="auto" />
		</div>
	);
}
