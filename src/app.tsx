import logo from "./assets/logo-nlw-expert.svg";
import NewNoteCard from "./components/NewNoteCard";
import { NoteCard } from "./components/note-card";

export default function App() {
	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6">
			<img src={logo} alt="Logo NLW" />
			<form className="w-full">
				<input
					type="text"
					placeholder="Busque em suas notas.."
					className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500"
				/>
			</form>
			<div className="h-px bg-slate-700" />

			<div className="grid gap-6 grid-cols-3 auto-rows-[250px]">
				<NewNoteCard />
				<NoteCard note={{
					date: new Date(),
					content: "Olá mundo!"
				}}/>
			</div>
		</div>
	);
}
