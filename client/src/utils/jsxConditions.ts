export const jsxConditions = <T>(conditions: Array<T | false>) => {
  const result = conditions[conditions.findIndex(result => !!result)]

  return result ? result : undefined
}