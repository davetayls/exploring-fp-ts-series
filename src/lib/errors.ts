
interface IError {
  name: string
  message: string
}

/**
 * A very simple implementation of resolveCommonError
 */
export const resolveCommonError = (err: any): IError => {
  if (err instanceof Error) {
    return err
  } else if (typeof err === 'string') {
    return new Error(err)
  } else {
    return new Error('Unknown error')
  }
}
