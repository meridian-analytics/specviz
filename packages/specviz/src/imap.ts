import * as Func from "./func"

export function filter<K, V>(
  m: Map<K, V>,
  filterFn: (value: V) => boolean,
): Map<K, V> {
  let changed = false
  const next: Map<K, V> = new Map()
  for (const [key, value] of m) {
    if (filterFn(value)) next.set(key, value)
    else changed = true
  }
  return changed ? next : m
}

export function set<K, V>(m: Map<K, V>, key: K, value: V): Map<K, V> {
  if (value === m.get(key)) return m
  return new Map(m).set(key, value)
}

export function update<K, V>(
  prev: Map<K, V>,
  keys: Set<K>,
  updateFn: (value: V) => V,
): Map<K, V> {
  let changed = false
  const next: Map<K, V> = new Map()
  let v: V
  for (const [key, value] of prev) {
    v =
      keys.size == 0 || keys.has(key)
        ? Func.applySetState(updateFn, value)
        : value
    if (v !== value) changed = true
    next.set(key, v)
  }
  return changed ? next : prev
}
