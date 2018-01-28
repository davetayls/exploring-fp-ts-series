import { equal } from 'assert'
import { allBigAndBold, beReallyWelcoming, eitherHello, isBigAndBold, join, renderTitle, soBold } from './composing'
import { identity } from 'fp-ts/lib/function'

describe('composing', function () {

  describe('simple strings', function () {

    it('should be really welcoming', function () {
      equal(beReallyWelcoming('well'), 'WELL HELLO')
    })

  })

  describe('and', function () {
    it('should find big and bold', function () {
      equal(isBigAndBold('big and bold'), true)
    })
    it('should force bold', function () {
      equal(soBold('big'), true)
    })
  })

  describe('either', function () {
    it('should use the provided string', function () {
      equal(
        eitherHello('world').fold(identity, identity),
        'hello world')
    })
    it('should use the default string', function () {
      equal(
        eitherHello(null).fold(identity, identity),
        'rude!!')
    })
  })

  describe('task', function () {
    it('should ', function () {
      return renderTitle
        .map((s) => {
          equal(s, 'Hello Dave, you are 89')
        })
        .run()
    })
  })

  describe('traversing with either', function () {
    it('should be big and bold', function () {
      const result = allBigAndBold(['big and bold', 'bold and big'])
      equal(result.isRight(), true)
      equal(
        result.map(join(',')).getOrElseValue(null),
        'big and bold,bold and big'
      )
    })
    it('should be a left', function () {
      const result = allBigAndBold([
        'not b or b',
        'bold and big'
      ])
      equal(result.isLeft(), true)
      result.fold(
        (s) => {
          equal(s, 'No!')
        },
        () => {
          throw new Error('should not run')
        }
      )
    })
  })
})
