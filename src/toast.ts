const toastElement = document.createElement("div");
let removeToast: ReturnType<typeof setTimeout>;

export function initToast() {
    toastElement.classList.add("toast");
    document.body.append(toastElement);
}

export function toast(message: string) {
    if (toastElement.classList.contains("reveal")) {
        clearTimeout(removeToast);
        removeToast = setTimeout(() => {
            toastElement.classList.remove("reveal");
        }, 2500);
    } else {
        removeToast = setTimeout(() => {
            toastElement.classList.remove("reveal");
        }, 2500);
    }

    toastElement.innerText = message;
    toastElement.classList.add("reveal");
}
