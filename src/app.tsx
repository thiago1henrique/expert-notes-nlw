import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import NewNoteCard from "./components/NewNoteCard";
import { NoteCard } from "./components/note-card";

interface Note {
	id: string
	date: Date
	content: string
}

export default function App() {

	const [search, setSearch] = useState("");

	function handleSearch(event: ChangeEvent<HTMLInputElement>) {
		const query = event.target.value;
		setSearch(query);
	}

	const [notes, setNotes] = useState<Note[]>(() => {
		const notesOnStorage = localStorage.getItem('notes');
		if (notesOnStorage) {
			return JSON.parse(notesOnStorage);
		}

		return [];
	});

	const filteredNotes = search !== "" ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes;

	function onNoteCreated(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		}

		const notesArray = [newNote, ...notes];

		setNotes(notesArray);

		localStorage.setItem('notes', JSON.stringify(notesArray));
	}

	function onNoteDeleted(id: string) {
		const notesArray = notes.filter(note => {
			return note.id != id
		});

		setNotes(notesArray);
		localStorage.setItem("notes", JSON.stringify(notesArray));
	}

	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
			<img src={logo} alt="Logo NLW" />
			<form className="w-full">
				<input
					type="text"
					placeholder="Busque em suas notas.."
					className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500"
					onChange={handleSearch}
				/>
			</form>
			<div className="h-px bg-slate-700" />

			<div className="grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
				<NewNoteCard onNoteCreated={onNoteCreated}/>
				{filteredNotes.map(note => <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>)}
			</div>
		</div>
	);
}
