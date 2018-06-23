import { equal, deepEqual } from 'assert'
import { chainOfResponsibility } from './middleware'

describe('middleware', function () {

  describe('chain of responsibility', function () {

    it('Bob asks for £1335', function () {
      deepEqual(
        chainOfResponsibility({ name: 'Bob', ones: 1335 }),
        {
          name: 'Bob',
          hasEnoughMoney: 'No',
          ones: 5,
          tens: 1,
          twenties: 1,
          hundreds: 13
        }
      )
    })

    it('Mary asks for £13.50', function () {
      deepEqual(
        chainOfResponsibility({ name: 'Mary', ones: 13.50 }),
        {
          name: 'Mary',
          hasEnoughMoney: 'Yes!',
          ones: 3.5,
          tens: 1,
          twenties: 0,
          hundreds: 0
        }
      )
    })

  })
})
