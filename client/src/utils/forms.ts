export const errorsToString = (errors: Array<string | boolean>) => {
  const index = errors.findIndex(error => typeof error === 'string')
  return errors[index]
}