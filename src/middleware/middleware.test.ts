import { equal, deepEqual } from 'assert'
import { chainOfResponsibility } from './chain-of-responsibility'
import { getSweetsSentence } from './sweets'
import { fetchPerson } from './promises'

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

  describe('sweets', function () {

    it('should have eaten a lot of sweets', function () {
      equal(
        getSweetsSentence('Barney'),
        'Barney ate 20 sweets and enjoyed it.'
      )
    })

  })

  describe('promises', function () {

    it('should successfully fetch helen', function () {
      return fetchPerson({ data: { id: 'helen' } })
        .then((res) => {
          equal(res.data!.name, 'Helen')
          equal(res.data!.age, 20)
        })
    })

    it('should fail with bob', function () {
      return fetchPerson({ data: { id: 'bob' } })
        .then(() => {
          throw new Error('should not run')
        })
        .catch((err) => {
          equal(err.message, 'Must be an adult')
        })
    })

  })
})
