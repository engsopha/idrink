import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaHandPointer } from "react-icons/fa";
import { COLORS } from "../utils/colors";

const COUNTDOWN_MS = 3000;
const MIN_TOUCHES = 2;

function FingerMarker({ x, y, color, state }) {
	const isWinner = state === "winner";
	const isLoser = state === "loser";

	const [burstOn, setBurstOn] = useState(false);
	useEffect(() => {
		if (isWinner) {
			const id = requestAnimationFrame(() => setBurstOn(true));
			return () => cancelAnimationFrame(id);
		}
		setBurstOn(false);
	}, [isWinner]);

	return (
		<div
			className="absolute pointer-events-none transition-opacity duration-500"
			style={{
				left: x,
				top: y,
				width: 120,
				height: 120,
				transform: "translate(-50%, -50%)",
				opacity: isLoser ? 0.2 : 1,
			}}
		>
			{!isLoser && (
				<>
					<div
						className="absolute inset-0 rounded-full border-2 animate-ping"
						style={{ borderColor: color, animationDuration: "1.4s" }}
					/>
					<div
						className="absolute inset-2 rounded-full border-2 animate-ping"
						style={{
							borderColor: color,
							animationDuration: "1.4s",
							animationDelay: "0.7s",
						}}
					/>
				</>
			)}

			<div
				className="absolute inset-4 rounded-full border-4 animate-pulse"
				style={{
					borderColor: color,
					boxShadow: isWinner ? `0 0 32px 8px ${color}` : `0 0 18px 2px ${color}66`,
				}}
			/>

			<div
				className="absolute rounded-full"
				style={{
					left: "50%",
					top: "50%",
					width: 38,
					height: 38,
					transform: "translate(-50%, -50%)",
					backgroundColor: color,
					boxShadow: isWinner ? `0 0 24px 6px #fff` : "none",
				}}
			/>

			{isWinner && (
				<div
					className="absolute inset-0 rounded-full border-4"
					style={{
						borderColor: "#ffffff",
						transform: burstOn ? "scale(3)" : "scale(1)",
						opacity: burstOn ? 0 : 1,
						transition:
							"transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease-out",
					}}
				/>
			)}
		</div>
	);
}

export default function FingerPicker() {
	const [touches, setTouches] = useState({});
	const [phase, setPhase] = useState("idle"); // idle | counting | picked
	const [winnerId, setWinnerId] = useState(null);
	const [remainingMs, setRemainingMs] = useState(COUNTDOWN_MS);

	const containerRef = useRef(null);
	const countdownTimerRef = useRef(null);
	const countdownStartRef = useRef(0);
	const colorCursorRef = useRef(0);

	const clearCountdown = useCallback(() => {
		if (countdownTimerRef.current) {
			clearTimeout(countdownTimerRef.current);
			countdownTimerRef.current = null;
		}
	}, []);

	const resetAll = useCallback(() => {
		clearCountdown();
		setPhase("idle");
		setWinnerId(null);
		setRemainingMs(COUNTDOWN_MS);
		colorCursorRef.current = 0;
	}, [clearCountdown]);

	const getRelativePos = (touch) => {
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return { x: touch.clientX, y: touch.clientY };
		return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
	};

	const handleTouchStart = (e) => {
		e.preventDefault();
		if (phase === "picked") return;
		setTouches((prev) => {
			const next = { ...prev };
			for (const t of e.changedTouches) {
				if (next[t.identifier] != null) continue;
				const { x, y } = getRelativePos(t);
				next[t.identifier] = {
					x,
					y,
					colorIndex: colorCursorRef.current % COLORS.length,
				};
				colorCursorRef.current += 1;
			}
			return next;
		});
	};

	const handleTouchMove = (e) => {
		e.preventDefault();
		setTouches((prev) => {
			let changed = false;
			const next = { ...prev };
			for (const t of e.changedTouches) {
				const existing = next[t.identifier];
				if (!existing) continue;
				const { x, y } = getRelativePos(t);
				next[t.identifier] = { ...existing, x, y };
				changed = true;
			}
			return changed ? next : prev;
		});
	};

	const handleTouchEnd = (e) => {
		e.preventDefault();
		setTouches((prev) => {
			const next = { ...prev };
			for (const t of e.changedTouches) {
				delete next[t.identifier];
			}
			return next;
		});
	};

	const idsKey = Object.keys(touches).sort().join(",");

	// Reset the countdown whenever the set of active touch identifiers changes.
	// Adds, lifts, and swaps all restart the timer from full duration so each
	// new player who joins gets a fair window before the pick.
	useEffect(() => {
		if (phase === "picked") {
			if (idsKey === "") resetAll();
			return;
		}

		clearCountdown();
		const count = idsKey === "" ? 0 : idsKey.split(",").length;

		if (count < MIN_TOUCHES) {
			setPhase("idle");
			setRemainingMs(COUNTDOWN_MS);
			return;
		}

		setPhase("counting");
		countdownStartRef.current = performance.now();
		setRemainingMs(COUNTDOWN_MS);

		countdownTimerRef.current = setTimeout(() => {
			setTouches((current) => {
				const ids = Object.keys(current);
				if (ids.length < MIN_TOUCHES) {
					setPhase("idle");
					return current;
				}
				const pick = ids[Math.floor(Math.random() * ids.length)];
				setWinnerId(pick);
				setPhase("picked");
				return current;
			});
		}, COUNTDOWN_MS);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idsKey]);

	// Tick the visible countdown while counting.
	useEffect(() => {
		if (phase !== "counting") return;
		let raf;
		const tick = () => {
			const left = Math.max(
				0,
				COUNTDOWN_MS - (performance.now() - countdownStartRef.current)
			);
			setRemainingMs(left);
			if (left > 0) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [phase, idsKey]);

	useEffect(() => () => clearCountdown(), [clearCountdown]);

	const touchCount = Object.keys(touches).length;
	const countdownSeconds = Math.ceil(remainingMs / 1000);

	return (
		<div
			ref={containerRef}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchEnd}
			className="relative w-full select-none touch-none bg-slate-900 overflow-hidden"
			style={{ minHeight: "calc(100vh - 72px)" }}
		>
			{touchCount === 0 && phase !== "picked" && (
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
					<FaHandPointer className="text-yellow-400 text-6xl mb-5 animate-bounce" />
					<h2 className="text-white text-2xl font-bold mb-2">Finger Picker</h2>
					<p className="text-slate-400 text-base max-w-xs">
						Everyone press and hold a finger on the screen. The countdown
						restarts each time someone joins.
					</p>
				</div>
			)}

			{touchCount === 1 && phase !== "picked" && (
				<div className="absolute bottom-8 left-0 right-0 text-center text-slate-400 text-sm pointer-events-none">
					Waiting for more fingers…
				</div>
			)}

			{phase === "counting" && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<span
						key={countdownSeconds}
						className="text-white/90 font-extrabold tabular-nums leading-none"
						style={{
							fontSize: "10rem",
							textShadow: "0 0 32px rgba(255,255,255,0.45)",
							animation: "ping 0.5s cubic-bezier(0, 0, 0.2, 1) 1",
						}}
					>
						{countdownSeconds}
					</span>
				</div>
			)}

			{phase === "picked" && (
				<div className="absolute bottom-8 left-0 right-0 text-center text-yellow-400 text-lg font-bold tracking-widest pointer-events-none">
					🍻 LIFT ALL FINGERS TO RESET 🍻
				</div>
			)}

			{Object.entries(touches).map(([id, t]) => {
				let markerState = "holding";
				if (phase === "picked") {
					markerState = id === String(winnerId) ? "winner" : "loser";
				} else if (phase === "counting") {
					markerState = "counting";
				}
				return (
					<FingerMarker
						key={id}
						x={t.x}
						y={t.y}
						color={COLORS[t.colorIndex]}
						state={markerState}
					/>
				);
			})}
		</div>
	);
}
