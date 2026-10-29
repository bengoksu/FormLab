let yerelIdSayaci = 0;

export function benzersizIdOlustur() {
  if (
    typeof globalThis.crypto?.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  yerelIdSayaci += 1;
  return `formlab-${Date.now()}-${yerelIdSayaci}-${Math.random()
    .toString(36)
    .slice(2)}`;
}
