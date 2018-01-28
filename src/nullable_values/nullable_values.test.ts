import {equal} from 'assert'
import {option} from 'fp-ts'

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
      option.fromNullable(myVal)
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

})
