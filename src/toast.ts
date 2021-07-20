const toastElement = document.createElement("div");
let removeToast: ReturnType<typeof setTimeout>;

export function initToast() {
    const toastWrap = document.createElement("div");

    toastWrap.classList.add("toast-container");
    toastElement.classList.add("toast");

    toastWrap.append(toastElement);
    document.body.append(toastWrap);
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
