export default function speak(message: string) {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices().filter((x) => x.lang === "en-US");
    const msg = new SpeechSynthesisUtterance(message);

    msg.voice = voices[0];
    msg.lang = "en-US";
    speechSynthesis.speak(msg);
}
