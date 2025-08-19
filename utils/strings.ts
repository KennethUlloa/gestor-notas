export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function random(length: number = 16) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function rgbStringToHex(input: string): string {
  // Dividimos la cadena en números
  const parts = input.split(" ").map(Number);

  if (parts.length !== 3 || parts.some(n => isNaN(n) || n < 0 || n > 255)) {
    throw new Error("Formato inválido. Debe ser: 'R G B' con valores entre 0 y 255");
  }

  // Convertimos cada número a hexadecimal con 2 dígitos
  const hex = parts
    .map(n => n.toString(16).padStart(2, "0"))
    .join("");

  return `#${hex.toUpperCase()}`;
}