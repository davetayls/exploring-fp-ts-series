import { equal, deepEqual } from 'assert'
import { fromNullable, Option, option, some } from 'fp-ts/lib/Option'
import { traverse } from 'fp-ts/lib/Array'

describe('nullable values', function () {

  /**
   * Should run the first function passed to
   * fold when the value is null or undefined.
   *
   * This is the simplest way of using option
   */
  it(
    'Should call the first argument of fold',
    function () {
      const myVal = null
      fromNullable(myVal)
        .fold(
          // the first argument (or left) is
          // run when the value is null or undefined
          () => {
            equal(myVal, null)
          },
          // The second argument (or right) is
          // run when the value exists
          () => {
            throw new Error('This should not run')
          }
        )
    }
  )

  it(
    'Should pull a list of names',
    function () {
      const names = [
        'Bob Smith',
        'Andy Hedge',
        null,
        'Helen Newbury',
        undefined
      ]

      const getFirstName = (name: string | null | undefined) =>
        fromNullable(name)
          .map((name) => name.split(' ')[0])

      const defaultFirstName = (name: string | null | undefined) =>
        getFirstName(name).alt(some('No name'))

      const result = traverse(option)(names, defaultFirstName)
        .getOrElse([])

      deepEqual(result, [
        'Bob',
        'Andy',
        'No name',
        'Helen',
        'No name'
      ])
    }
  )

})
