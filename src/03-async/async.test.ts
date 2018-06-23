import { equal, deepEqual } from 'assert'
import { Either, either, fromNullable, left, right, tryCatch } from 'fp-ts/lib/Either'
import { taskEither } from 'fp-ts/lib/TaskEither'
import { traverse } from 'fp-ts/lib/Array'

interface IPerson {
  recurringPayment?: number
}

describe('async', function () {

  const getRecurringPayment = (person: IPerson): Either<Error, number> =>
    fromNullable(new Error('No Recurring Payment'))(person.recurringPayment)

  const niceNameCheck = (name: string) => {
    if (/dude/i.test(name)) {
      return 'Nice name'
    } else {
      throw new Error('Bad name')
    }
  }


  it('should pass the error to the left fold function', function () {
    return taskEither.of('hello')
      .map(() => {
        throw new Error('aaaaaa')
      })
      .fold(
        // the first argument (or left) is
        // run when the value is null or undefined
        (err) => {
          equal(err, 'No Recurring Payment')
        },
        // The second argument (or right) is
        // run when the value exists
        () => {
          throw new Error('This should not run')
        }
      )
      .run()
  })

})
