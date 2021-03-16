// Shoud I use indexed db?

export function setDB(name: string, data: any[], hard?: boolean) {
    const stored = getDB(name);

    if (hard) {
        localStorage.setItem(name, JSON.stringify(data));
    } else if (stored) {
        const parsed = JSON.parse(stored);
        const merged: any[] = [];

        parsed.forEach((item: any) => {
            if (!data.includes(item)) {
                merged.push(item);
            }
        });

        data.forEach((item: any) => {
            if (!merged.includes(item)) {
                merged.push(item);
            }
        });

        localStorage.setItem(name, JSON.stringify(merged));
    } else {
        localStorage.setItem(name, JSON.stringify(data));
    }
}

export function getDB(name: string) {
    return localStorage.getItem(name);
}
