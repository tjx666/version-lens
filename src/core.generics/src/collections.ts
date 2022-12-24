export type KeyDictionary<T> = { [key: string]: T }

export type KeyStringDictionary = KeyDictionary<string>

export type KeyStringArrayDictionary = KeyDictionary<Array<string>>
