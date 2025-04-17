export function hexToVec4(hex: string): [number, number, number, number] {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r / 255, g / 255, b / 255, 1];
}

export function stringToHex(color: string): number {
    if (color.startsWith("#")) {
        return parseInt(color.slice(1), 16);
    } else if (color.startsWith("0x")) {
        return parseInt(color.slice(2), 16);
    } else {
        throw new Error(`Invalid color format: ${color}`);
    }
}

export function hexToString(color: number): string {
    const hex = color.toString(16).padStart(6, "0");
    return `#${hex}`;
}

export function darken(color: number | string, amount: number) {
    const parsedColor = typeof color === "string" ? stringToHex(color) : color;
    const r = (parsedColor >> 16) & 0xff;
    const g = (parsedColor >> 8) & 0xff;
    const b = parsedColor & 0xff;
    const a = (parsedColor >> 24) & 0xff;

    const newR = Math.max(0, Math.min(255, r - amount));
    const newG = Math.max(0, Math.min(255, g - amount));
    const newB = Math.max(0, Math.min(255, b - amount));
    const newA = Math.max(0, Math.min(255, a - amount));

    return (newA << 24) | (newR << 16) | (newG << 8) | newB;
}

export function lighten(color: number | string, amount: number) {
    const parsedColor = typeof color === "string" ? stringToHex(color) : color;
    const r = (parsedColor >> 16) & 0xff;
    const g = (parsedColor >> 8) & 0xff;
    const b = parsedColor & 0xff;
    const a = (parsedColor >> 24) & 0xff;

    const newR = Math.min(255, r + amount);
    const newG = Math.min(255, g + amount);
    const newB = Math.min(255, b + amount);
    const newA = Math.min(255, a + amount);

    return (newA << 24) | (newR << 16) | (newG << 8) | newB;
}
