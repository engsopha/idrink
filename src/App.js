import React, { useEffect, useRef, useState } from "react";
import { IoMdBeer } from "react-icons/io";
import { FiRefreshCw, FiSettings, FiInfo } from "react-icons/fi";
import { FaHandPointer } from "react-icons/fa";

import Board from "./components/Board";
import Drink from "./components/Drink";
import SpinRoulette from "./components/SpinRoulette";
import FingerPicker from "./components/FingerPicker";
import Settings from "./components/Settings";
import HowToPlay from "./components/HowToPlay";

const TABS = [
	{ id: "board", label: "Board", Icon: IoMdBeer },
	{ id: "roulette", label: "Spin", Icon: FiRefreshCw },
	{ id: "picker", label: "Pick", Icon: FaHandPointer },
	{ id: "info", label: "How to Play", Icon: FiInfo },
	{ id: "settings", label: "Settings", Icon: FiSettings },
];

export default function App() {
	const [activeTab, setActiveTab] = useState("board");
	const [isDrink, setDrink] = useState(false);
	const audioRef = useRef();

	const reset = () => {
		setDrink(false);
	};

	const handleDrink = () => {
		setDrink(true);
		audioRef.current.play();
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		if (tab !== "board") setDrink(false);
	};

	useEffect(() => {
		audioRef.current.volume = 0.3;
	}, []);

	return (
		<div className="bg-slate-800 min-h-screen w-full flex flex-col">
			{/* Tab bar — hidden while drink animation is showing */}
			{!isDrink && (
				<nav className="flex border-b border-slate-700 shrink-0">
					{TABS.map(({ id, label, Icon }) => {
						const active = activeTab === id;
						return (
							<button
								key={id}
								onClick={() => handleTabChange(id)}
								className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
									active
										? "text-yellow-400 border-b-2 border-yellow-400"
										: "text-slate-400 hover:text-slate-200"
								}`}
							>
								<Icon className="text-xl" />
								{label}
							</button>
						);
					})}
				</nav>
			)}

			<div className="flex-1 overflow-y-auto">
				{activeTab === "board" &&
					(isDrink ? (
						<Drink reset={reset} />
					) : (
						<Board handleDrink={handleDrink} />
					))}
			{activeTab === "roulette" && <SpinRoulette />}
			{activeTab === "picker" && <FingerPicker />}
			{activeTab === "info" && <HowToPlay />}
			{activeTab === "settings" && <Settings />}
			</div>

			<audio src="/sound.mp3" ref={audioRef} />
		</div>
	);
}
