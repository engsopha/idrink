import React from "react";
import { IoMdBeer } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi";
import { GiCardRandom } from "react-icons/gi";

const Step = ({ number, title, children }) => (
	<div className="flex gap-4">
		<div className="shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-slate-900 font-bold text-sm flex items-center justify-center mt-0.5">
			{number}
		</div>
		<div>
			<p className="text-white font-semibold mb-1">{title}</p>
			<p className="text-slate-400 text-sm leading-relaxed">{children}</p>
		</div>
	</div>
);

const Rule = ({ children }) => (
	<li className="flex items-start gap-2 text-sm text-slate-400 leading-relaxed">
		<span className="text-yellow-500 mt-0.5 shrink-0">•</span>
		{children}
	</li>
);

export default function HowToPlay() {
	return (
		<div className="p-5 max-w-lg mx-auto pb-10">
			<h2 className="text-white text-2xl font-bold mb-1">How to Play</h2>
			<p className="text-slate-500 text-sm mb-7">
				Get everyone together and have fun!
			</p>

			{/* Objective */}
			<div className="bg-slate-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
				<IoMdBeer className="text-yellow-400 text-4xl shrink-0" />
				<p className="text-slate-300 text-sm leading-relaxed">
					A multiplayer drinking game where hiding one drink tile on the board
					decides who drinks — and spins the roulette!
				</p>
			</div>

			{/* Steps */}
			<h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">
				Gameplay
			</h3>
			<div className="space-y-6 mb-8">
				<Step number="1" title="Gather everyone around one phone">
					All players sit together and share the same device. One board is shown
					for the whole group.
				</Step>

				<Step number="2" title="Each player taps one tile on the board">
					On your turn, tap any beer icon you haven't tapped before. The board
					hides one drink tile somewhere — most tiles are safe, but one will
					reveal the drink.
				</Step>

				<Step number="3" title="If you find the drink — you drink!">
					The unlucky player who uncovers the hidden drink tile must drink. The
					big beer animation plays to call them out.
				</Step>

				<Step number="4" title="Loser also spins the roulette">
					After drinking, head to the{" "}
					<span className="inline-flex items-center gap-1 text-yellow-400 font-semibold">
						<FiRefreshCw className="text-xs" /> Spin
					</span>{" "}
					tab and spin the wheel for an extra dare on top of the drink!
				</Step>

				<Step number="5" title="Next round — loser clicks +1 tile">
					The loser of the previous round starts next and must tap{" "}
					<span className="text-white font-semibold">one extra tile</span> as a
					penalty.
					<br />
					<span className="text-slate-500 text-xs mt-1 block">
						Lost once → click 2 tiles · Lost twice in a row → click 3 tiles ·
						and so on…
					</span>
				</Step>

				<Step number="6" title="Reset the board and repeat!">
					Hit the reset button after each round to shuffle a new board and start
					the next round fresh.
				</Step>
			</div>

			{/* Cards game */}
			<div className="bg-slate-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
				<GiCardRandom className="text-yellow-400 text-4xl shrink-0" />
				<p className="text-slate-300 text-sm leading-relaxed">
					<span className="text-white font-semibold">Cards — Higher or Lower:</span>{" "}
					guess whether the next card beats the one on show. Guess wrong and you
					drink!
				</p>
			</div>
			<h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">
				Cards — Higher or Lower
			</h3>
			<div className="space-y-6 mb-8">
				<Step number="1" title="Find the glowing card">
					All 52 cards are shared out into six piles on the grid. One pile's top
					card is turned face-up with a{" "}
					<span className="text-yellow-400 font-semibold">glowing outline</span>{" "}
					— that's the card to beat. The other five are face-down stacks (the
					number shows how many cards are left in each).
				</Step>

				<Step number="2" title="Tap a face-down card & call it out loud">
					On your turn, tap any face-down card — it pops up larger but stays
					hidden. Say <span className="text-white font-semibold">Higher</span> or{" "}
					<span className="text-white font-semibold">Lower</span> than the glowing
					card out loud so the whole group hears (Aces are high).
				</Step>

				<Step number="3" title="Tap again to reveal">
					Tap the big card to flip it over and show the number to everyone.
				</Step>

				<Step number="4" title="The group decides who drinks">
					Everyone checks the call together. Guessed{" "}
					<span className="text-white font-semibold">wrong — you drink</span>. Same
					rank? House rules — most groups make that a double! The phone doesn't
					judge, you do.
				</Step>

				<Step number="5" title="The chain keeps going">
					The card you flipped becomes the new glowing card, and the old one is
					discarded. Piles shrink as you play — when they run out the whole deck
					reshuffles automatically, so play never stops.
				</Step>
			</div>

			{/* Quick rules */}
			<h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3">
				Quick Rules
			</h3>
			<ul className="space-y-3 bg-slate-700 rounded-2xl p-4">
				<Rule>
					Each player taps <span className="text-white font-semibold">one tile per turn</span>, going
					around the group.
				</Rule>
				<Rule>
					The loser drinks <span className="text-white font-semibold">and</span>{" "}
					must spin the roulette for a dare.
				</Rule>
				<Rule>
					Losing a round adds{" "}
					<span className="text-white font-semibold">+1 tile</span> to your next
					turn (stacks each time you lose).
				</Rule>
				<Rule>
					Your streak resets back to 1 tap once another player loses.
				</Rule>
				<Rule>
					Feel free to house-rule anything — it's your party!
				</Rule>
			</ul>

			<p className="text-center text-slate-600 text-xs mt-8">
				Drink responsibly. Know your limits. 🙏
			</p>
		</div>
	);
}
