/**
 * Array utilities to handle undefined, null, or non-iterable values safely
 */

/**
 * Ensures a value is always an array, even if it's undefined, null, or non-iterable
 * @param value - The value to ensure is an array
 * @returns An array (empty if the value was not iterable)
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value
  }
  return []
}

/**
 * Safely gets the length of an array-like value
 * @param value - The value to get length from
 * @returns The length of the array, or 0 if not an array
 */
export function safeLength(value: unknown): number {
  return ensureArray(value).length
}

/**
 * Safely maps over an array-like value
 * @param value - The value to map over
 * @param mapper - The mapping function
 * @returns The mapped array, or empty array if not iterable
 */
export function safeMap<T, R>(
  value: unknown,
  mapper: (item: T, index: number) => R,
): R[] {
  return ensureArray<T>(value).map(mapper)
}

/**
 * Safely filters an array-like value
 * @param value - The value to filter
 * @param predicate - The filter function
 * @returns The filtered array, or empty array if not iterable
 */
export function safeFilter<T>(
  value: unknown,
  predicate: (item: T, index: number) => boolean,
): T[] {
  return ensureArray<T>(value).filter(predicate)
}

/**
 * Safely checks if an array-like value has any items
 * @param value - The value to check
 * @returns True if the array has items, false otherwise
 */
export function hasItems(value: unknown): boolean {
  return safeLength(value) > 0
}

/**
 * Safely checks if an array-like value is empty
 * @param value - The value to check
 * @returns True if the array is empty, false otherwise
 */
export function isEmpty(value: unknown): boolean {
  return safeLength(value) === 0
}

/**
 * Safely gets the first item from an array-like value
 * @param value - The value to get first item from
 * @returns The first item, or undefined if not available
 */
export function safeFirst<T>(value: unknown): T | undefined {
  const array = ensureArray<T>(value)
  return array.length > 0 ? array[0] : undefined
}

/**
 * Safely gets the last item from an array-like value
 * @param value - The value to get last item from
 * @returns The last item, or undefined if not available
 */
export function safeLast<T>(value: unknown): T | undefined {
  const array = ensureArray<T>(value)
  return array.length > 0 ? array[array.length - 1] : undefined
}

/**
 * Safely concatenates multiple array-like values
 * @param values - The values to concatenate
 * @returns A single array with all items
 */
export function safeConcat<T>(...values: unknown[]): T[] {
  return values.reduce((acc: T[], value) => {
    return acc.concat(ensureArray<T>(value))
  }, [] as T[])
}

/**
 * Safely finds an item in an array-like value
 * @param value - The value to search in
 * @param predicate - The search function
 * @returns The found item, or undefined if not found
 */
export function safeFind<T>(
  value: unknown,
  predicate: (item: T, index: number) => boolean,
): T | undefined {
  return ensureArray<T>(value).find(predicate)
}

/**
 * Safely checks if an array-like value includes an item
 * @param value - The value to check
 * @param item - The item to look for
 * @returns True if the item is found, false otherwise
 */
export function safeIncludes<T>(value: unknown, item: T): boolean {
  return ensureArray<T>(value).includes(item)
}
