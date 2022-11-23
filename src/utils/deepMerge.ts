export type AnyObject = { [key: string]: any }

const deepMerge = (target: AnyObject = {}, source: AnyObject = {}) => {
  const keys = Object.keys(source)
  for (const key of keys) {
    let current = source[key]
    if (current instanceof Object) {
      current = target[key]
        ? { ...current, ...deepMerge(target[key], current) }
        : current
    }
  }
  return { ...target, ...source }
}

export default deepMerge
