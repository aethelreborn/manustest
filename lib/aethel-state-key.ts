const STATE_KEY_PREFIX = "aethel.encrypted-state.v1";
export function encryptedStateKey(scope: string) { return `${STATE_KEY_PREFIX}.${encodeURIComponent(scope || "offline")}`; }
