export function isEnvelope<T extends { status: number }, const S extends number>(
  envelope: T | undefined,
  status: S,
): envelope is Extract<T, { status: S }> {
  return envelope?.status === status;
}
