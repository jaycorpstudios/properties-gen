export const isArray = (value) => Array.isArray(value)

export const isPrimitive = (value) => {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'boolean'
}
