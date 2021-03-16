export default function speak(message: string) {
    const msg = new SpeechSynthesisUtterance();

    msg.text = message;
    msg.lang = "en";
    window.speechSynthesis.speak(msg);
}
