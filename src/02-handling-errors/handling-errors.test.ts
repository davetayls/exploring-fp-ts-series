import { equal, deepEqual } from 'assert'
import { Either, either, fromNullable, left, right, tryCatch } from 'fp-ts/lib/Either'
import { traverse } from 'fp-ts/lib/Array'

interface IPerson {
  recurringPayment?: number
}

interface IError {
  name: string
  message: string
}

describe('handling errors', function () {

  const getRecurringPayment = (person: IPerson): Either<Error, number> =>
    fromNullable(new Error('No Recurring Payment'))(person.recurringPayment)

  const niceNameCheck = (name: string) => {
    if (/dude/i.test(name)) {
      return 'Nice name'
    } else {
      throw new Error('Bad name')
    }
  }

  /**
   * A very simple implementation of resolveCommonError
   */
  const resolveCommonError = (err: any): IError => {
    if (err instanceof Error) {
      return err
    } else if (typeof err === 'string') {
      return new Error(err)
    } else {
      return new Error('Unknown error')
    }
  }

  it('should pass the error to the left fold function', function () {
    const myVal = {}
    getRecurringPayment(myVal)
      .fold(
        // the first argument (or left) is
        // run when the value is null or undefined
        (err) => {
          equal(err.message, 'No Recurring Payment')
        },
        // The second argument (or right) is
        // run when the value exists
        () => {
          throw new Error('This should not run')
        }
      )
  })

  it('should skip to end if a left is returned from chain', function () {
    getRecurringPayment({ recurringPayment: 5 })
      .chain(() => left(new Error('Must be more than 10')))
      .fold(
        // the first argument (or left) is
        // run when the value is null or undefined
        (err) => {
          equal(err.message, 'Must be more than 10')
        },
        // The second argument (or right) is
        // run when the code succeeds
        () => {
          throw new Error('This should not run')
        }
      )
  })

  it('should get the result at the end if the steps all work', function () {
    getRecurringPayment({ recurringPayment: 5 })
      .map((recurringPayment) => recurringPayment * 12)
      .map((amount) => amount > 1000 ? 'Too expensive' : 'Affordable')
      .fold(
        (err) => {
          throw err
        },
        // The second argument (or right) is run when the code succeeds
        (affordability) => {
          equal(affordability, 'Affordable')
        }
      )
  })

  it('should catch an internally thrown error', function () {
    getRecurringPayment({ recurringPayment: 5 })
      .map((recurringPayment) => recurringPayment * 12)
      .map((amount) => amount > 1000 ? 'Too expensive' : 'Affordable')
      .chain(() => tryCatch(() => {
        throw 'Bad JS Error'
      }, resolveCommonError))
      .fold(
        (err) => {
          equal(err.name, 'Error')
          equal(err.message, 'Bad JS Error')
        },
        // The second argument (or right) is run when the code succeeds
        () => {
          throw new Error('This should not run')
        }
      )
  })

  it('Should fail with an error', function () {
    const names = [
      'Bob Smith',
      'Andy Hedge',
      'Helen Newbury',
    ]

    const niceNameDude = (name: string) =>
      tryCatch(() => niceNameCheck(name), resolveCommonError)

    const result = traverse(either)(names, niceNameDude)
      .getOrElse(['Not all names were good'])

    deepEqual(result, ['Not all names were good'])
  })

  it('Should provide alternative for bad names', function () {
    const names = [
      'Dude Smith',
      'Andy Hedge'
    ]

    const niceNameDude = (name: string) =>
      tryCatch(() => niceNameCheck(name), resolveCommonError)
        .alt(right('Be a dude'))

    const result = traverse(either)(names, niceNameDude)
      .getOrElse([])

    deepEqual(result, ['Nice name', 'Be a dude'])
  })

})
