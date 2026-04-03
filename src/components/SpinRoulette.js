import React, { useState } from "react";
import { DEFAULT_DARES } from "../utils/dares";

const COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
	"#f43f5e",
	"#14b8a6",
];

const WHEEL_SIZE = 300;
const cx = WHEEL_SIZE / 2;
const cy = WHEEL_SIZE / 2;
const r = WHEEL_SIZE / 2 - 4;

function buildSegments(dares) {
	const n = dares.length;
	return dares.map((dare, i) => {
		const segAngle = 360 / n;
		const startRad = ((i * segAngle - 90) * Math.PI) / 180;
		const endRad = (((i + 1) * segAngle - 90) * Math.PI) / 180;
		const x1 = cx + r * Math.cos(startRad);
		const y1 = cy + r * Math.sin(startRad);
		const x2 = cx + r * Math.cos(endRad);
		const y2 = cy + r * Math.sin(endRad);
		const largeArc = segAngle > 180 ? 1 : 0;
		const midRad = (((i + 0.5) * segAngle - 90) * Math.PI) / 180;
		const textR = r * 0.62;
		return {
			path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
			color: COLORS[i % COLORS.length],
			textX: cx + textR * Math.cos(midRad),
			textY: cy + textR * Math.sin(midRad),
			textRotation: (i + 0.5) * segAngle - 90,
			dare,
		};
	});
}

export default function SpinRoulette() {
	const [dares] = useState(() => {
		const saved = localStorage.getItem("spinDares");
		return saved ? JSON.parse(saved) : DEFAULT_DARES;
	});
	const [spinning, setSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [selectedDare, setSelectedDare] = useState(null);

	const spin = () => {
		if (spinning || dares.length < 2) return;
		setSpinning(true);
		setSelectedDare(null);

		const n = dares.length;
		const segAngle = 360 / n;
		const selectedIndex = Math.floor(Math.random() * n);
		// Land somewhere within the middle 50% of the segment
		const segOffset = Math.random() * segAngle * 0.5 + segAngle * 0.25;

		// To show segment i at the top pointer after rotation R:
		// pointer maps to angle (360 - R % 360) % 360 on the original wheel
		// segment i occupies [i * segAngle, (i+1) * segAngle]
		// so targetMod = i * segAngle + segOffset
		const targetMod =
			(360 - ((selectedIndex * segAngle + segOffset) % 360) + 360) % 360;
		const currentMod = rotation % 360;
		const diff = (targetMod - currentMod + 360) % 360;
		const extraSpins = (5 + Math.floor(Math.random() * 5)) * 360;

		setRotation(rotation + extraSpins + diff);

		setTimeout(() => {
			setSpinning(false);
			setSelectedDare(dares[selectedIndex]);
		}, 4000);
	};

	if (dares.length < 2) {
		return (
			<div className="p-8 text-center">
				<h2 className="text-white text-2xl font-bold mb-4">Spin Roulette</h2>
				<p className="text-slate-400">
					Add at least 2 dares in{" "}
					<span className="text-yellow-400 font-semibold">Settings</span> to use
					the roulette!
				</p>
			</div>
		);
	}

	const segments = buildSegments(dares);

	return (
		<div className="flex flex-col items-center px-5 pt-5 pb-8">
			<h2 className="text-white text-2xl font-bold mb-6">Spin Roulette</h2>

			<div className="relative flex flex-col items-center">
				{/* Pointer triangle pointing down into wheel */}
				<div className="mb-1 z-10">
					<svg width="22" height="14" viewBox="0 0 22 14">
						<polygon points="0,0 22,0 11,14" fill="white" />
					</svg>
				</div>

				{/* Spinning wheel */}
				<svg
					width={WHEEL_SIZE}
					height={WHEEL_SIZE}
					style={{
						transform: `rotate(${rotation}deg)`,
						transition: spinning
							? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
							: "none",
						borderRadius: "50%",
						boxShadow: "0 0 0 4px #334155",
					}}
				>
					{segments.map((seg, i) => (
						<g key={i}>
							<path
								d={seg.path}
								fill={seg.color}
								stroke="#1e293b"
								strokeWidth="2"
							/>
							<text
								x={seg.textX}
								y={seg.textY}
								transform={`rotate(${seg.textRotation}, ${seg.textX}, ${seg.textY})`}
								textAnchor="middle"
								dominantBaseline="middle"
								fill="white"
								fontSize={dares.length > 8 ? "9" : "10"}
								fontWeight="bold"
							>
								{seg.dare.length > 11 ? seg.dare.slice(0, 10) + "…" : seg.dare}
							</text>
						</g>
					))}
					{/* Center hub */}
					<circle cx={cx} cy={cy} r={20} fill="#1e293b" />
					<circle cx={cx} cy={cy} r={12} fill="white" />
				</svg>
			</div>

			<button
				onClick={spin}
				disabled={spinning}
				className="mt-6 bg-yellow-500 text-slate-900 font-bold px-10 py-3 rounded-full text-lg disabled:opacity-50 active:scale-95 transition-transform"
			>
				{spinning ? "Spinning…" : "SPIN!"}
			</button>

			{selectedDare && (
				<div className="mt-6 mx-2 w-full max-w-sm p-5 bg-slate-700 rounded-2xl text-center shadow-lg">
					<p className="text-yellow-400 text-xs uppercase tracking-widest mb-2 font-semibold">
						Your Dare
					</p>
					<p className="text-white text-2xl font-bold">{selectedDare}</p>
				</div>
			)}
		</div>
	);
}
