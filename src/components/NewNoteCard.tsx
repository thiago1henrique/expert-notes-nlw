import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCard {
	onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null

export default function NewNoteCard(props: NewNoteCard) {
	const [shouldShowOnboard, setSouldShowOnboard] = useState(true);
	const [content, setContent] = useState("");
	const [isRecording, setIsRecording] = useState(false);

	function handleStartEditor() {
		setSouldShowOnboard(false);
	}

	function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);
		if (event.target.value === "") setSouldShowOnboard(true);
	}

	function handleSaveNote(event: FormEvent) {
		event.preventDefault();

		if(content === "") {
			return
		}

		props.onNoteCreated(content);
		setContent("");
		setSouldShowOnboard(true);
		toast.success("Nota criada com sucesso!");
	}

	function handleStartRecording() {
		const isSpeechRecognitionAPIAvaliable = "SpeechRecognition" in window
		|| "webkitSpeechRecognition" in window

		if(!isSpeechRecognitionAPIAvaliable) {
			alert("Infelizmente seu navegador não suporta a API de gravação!");
			return
		}

		setIsRecording(true);
		setSouldShowOnboard(false)

		const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
		speechRecognition = new SpeechRecognitionAPI();
		speechRecognition.lang = "pt-BR";
		speechRecognition.continuous = true;
		speechRecognition.maxAlternatives = 1;
		speechRecognition.interimResults = true;
		speechRecognition.onresult = (event) => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript);
			}, "")

			setContent(transcription);
		}

		speechRecognition.onerror = (event) => {
			console.error(event)
		}

		speechRecognition.start()

	}

	function handleStopRecording() {
		setIsRecording(false);
		
		if(speechRecognition !== null) {
			speechRecognition.stop();
		}
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
				<span className="text-sm font-medium text-slate-200">Adicionar nota</span>
				<p className="text-sm leading-6 text-slate-400">
					Grave uma nota em áudio que será convertida para texto automaticamente.
				</p>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 fixed bg-black/40">
					<Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
						<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
							<X className="size-5 hover:text-slate-100" />
						</Dialog.Close>
						<form className="flex-1 flex flex-col">
							<div className="flex flex-1 flex-col gap-3 p-5">
								<span className="text-sm font-medium text-slate-200">Adicionar nota</span>

								{shouldShowOnboard ? (
									<p className="text-sm leading-6 text-slate-300">
										Começe{" "}
										<button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">
											gravando uma nota
										</button>{" "}
										em áudio ou se preferir{" "}
										<button type="button" className="font-medium text-lime-400 hover:underline" onClick={handleStartEditor}>
											utilize apenas texto.
										</button>
									</p>
								) : (
									<textarea
										autoFocus
										className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
										onChange={handleContentChanged}
										value={content}
									/>
								)}
							</div>

							{isRecording ? (
								<button
									type="button"
									onClick={handleStopRecording}
									className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-slate-300 text-sm hover:text-slate-100"
								>
									<div className="size-3 rounded-full bg-red-500 animate-ping"/>
									Gravando! (clique p/ iinterromper)
								</button>
							) : (
								<button
									type="button"
									className="w-full bg-lime-400 py-4 text-center text-lime-950 text-sm hover:bg-lime-500"
									onClick={handleSaveNote}
								>
									Salvar nota?
								</button>
							)}
						</form>
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
