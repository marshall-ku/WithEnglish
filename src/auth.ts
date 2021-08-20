export function updateToken(token: string) {
    localStorage.setItem("token", token);
}

export function resetToken() {
    localStorage.removeItem("token");
}
