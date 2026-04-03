import React, { useState } from "react";
import { FiTrash2, FiPlus, FiRotateCcw } from "react-icons/fi";
import { DEFAULT_DARES } from "../utils/dares";

export default function Settings() {
	const [dares, setDares] = useState(() => {
		const saved = localStorage.getItem("spinDares");
		return saved ? JSON.parse(saved) : DEFAULT_DARES;
	});
	const [newDare, setNewDare] = useState("");
	const [editIndex, setEditIndex] = useState(null);
	const [editValue, setEditValue] = useState("");

	const saveDares = (updated) => {
		localStorage.setItem("spinDares", JSON.stringify(updated));
		setDares(updated);
	};

	const addDare = () => {
		const trimmed = newDare.trim();
		if (!trimmed) return;
		saveDares([...dares, trimmed]);
		setNewDare("");
	};

	const removeDare = (index) => {
		setEditIndex(null);
		saveDares(dares.filter((_, i) => i !== index));
	};

	const startEdit = (index) => {
		setEditIndex(index);
		setEditValue(dares[index]);
	};

	const saveEdit = (index) => {
		const trimmed = editValue.trim();
		if (!trimmed) return;
		const updated = [...dares];
		updated[index] = trimmed;
		saveDares(updated);
		setEditIndex(null);
	};

	const resetDefaults = () => {
		saveDares(DEFAULT_DARES);
		setEditIndex(null);
	};

	return (
		<div className="p-5 max-w-lg mx-auto">
			<h2 className="text-white text-2xl font-bold mb-6">Settings</h2>

			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-yellow-400 font-semibold text-lg">
						Spin Roulette Dares
					</h3>
					<button
						onClick={resetDefaults}
						className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors"
					>
						<FiRotateCcw className="text-sm" />
						Reset defaults
					</button>
				</div>

				{/* Add new dare */}
				<div className="flex gap-2 mb-5">
					<input
						type="text"
						value={newDare}
						onChange={(e) => setNewDare(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && addDare()}
						placeholder="Add a new dare…"
						maxLength={40}
						className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-500 placeholder-slate-500 text-sm"
					/>
					<button
						onClick={addDare}
						disabled={!newDare.trim()}
						className="bg-yellow-500 text-slate-900 font-bold px-4 py-2.5 rounded-lg hover:bg-yellow-400 disabled:opacity-40 transition-colors"
					>
						<FiPlus className="text-xl" />
					</button>
				</div>

				{/* Dare list */}
				{dares.length === 0 ? (
					<p className="text-slate-500 text-center py-10">
						No dares yet. Add one above!
					</p>
				) : (
					<div className="space-y-2">
						{dares.map((dare, index) => (
							<div
								key={index}
								className="bg-slate-700 rounded-lg overflow-hidden"
							>
								{editIndex === index ? (
									<div className="flex gap-2 p-2">
										<input
											type="text"
											value={editValue}
											onChange={(e) => setEditValue(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") saveEdit(index);
												if (e.key === "Escape") setEditIndex(null);
											}}
											maxLength={40}
											autoFocus
											className="flex-1 bg-slate-600 text-white rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
										/>
										<button
											onClick={() => saveEdit(index)}
											disabled={!editValue.trim()}
											className="bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded disabled:opacity-40"
										>
											Save
										</button>
										<button
											onClick={() => setEditIndex(null)}
											className="text-slate-400 text-xs px-2"
										>
											Cancel
										</button>
									</div>
								) : (
									<div className="flex items-center justify-between px-4 py-3">
										<span
											className="text-white text-sm flex-1 cursor-pointer"
											onClick={() => startEdit(index)}
										>
											{dare}
										</span>
										<div className="flex items-center gap-3 ml-3">
											<button
												onClick={() => startEdit(index)}
												className="text-slate-400 hover:text-yellow-400 text-xs transition-colors"
											>
												Edit
											</button>
											<button
												onClick={() => removeDare(index)}
												className="text-red-400 hover:text-red-300 transition-colors"
											>
												<FiTrash2 />
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}

				<p className="text-slate-500 text-xs mt-5 text-center">
					{dares.length} dare{dares.length !== 1 ? "s" : ""} in rotation ·
					Tap a dare to edit it
				</p>
			</div>
		</div>
	);
}
