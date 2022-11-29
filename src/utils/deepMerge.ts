export type AnyObject = { [key: string]: any }

const deepMerge = (base: AnyObject = {}, extension: AnyObject = {}) => {
  const keys = Object.keys(base)
  const merged = { ...base, ...extension }
  for (const key of keys) {
    const current = base[key]
    const isArray = Array.isArray(current)
    const isObject = current instanceof Object && !isArray
    // Extend arrays
    if (isArray) {
      merged[key] = [...current, ...(extension[key] || [])]
    }
    // Extend objects
    if (isObject) {
      merged[key] = extension[key]
        ? { ...deepMerge(current, extension[key]) }
        : current
    }
  }
  return merged
}

export default deepMerge
