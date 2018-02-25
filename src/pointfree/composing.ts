import { IO } from 'fp-ts/lib/IO'
import { and, compose, curry, flip } from 'fp-ts/lib/function'
import { Either, either, fromNullable, left, right } from 'fp-ts/lib/Either'
import { liftA2 } from 'fp-ts/lib/Apply'
import { readEnv } from './env'
import { task } from 'fp-ts/lib/Task'
import { array } from 'fp-ts/lib/Array'

const toUpper = (s: string) => s.toUpperCase()
const str = (s1: string) => (s2: string) => s1 + s2
export const join = (s: string) => (arr: any[]) => arr.join(s)

export const beReallyWelcoming = compose(
  toUpper,
  flip(str)(' hello')
)

const isBig = (s: string) => /big/.test(s)
const isBold = (s: string) => /bold/.test(s)
export const isBigAndBold = and(isBig, isBold)

export const soBold = compose(
  isBigAndBold,
  str('bold')
)

/**
 * Composing with either
 */
const eitherMap = flip(curry(either.map))
export const eitherHello = compose(
  eitherMap(str('hello ')),
  fromNullable('yo!!')
)

/**
 * Composing with Task
 */
const renderPage = curry((name: string, age: string) => `Hello ${name}, you are ${age}`)
const liftedRender = liftA2(task)(renderPage)
const taskName = task.of<string>(new Promise((resolve) => {
  setTimeout(() => resolve('Dave'), 1000)
}))
const taskAge = task.of('89')
export const renderTitle = liftedRender(taskName)(taskAge)

/**
 * Traversing with Either
 */
const isBigAndBoldEither: (a: string) => Either<string, string> =
  (a: string) => isBigAndBold(a) ? right(a) : left('No!')
const traverseArrayEither =
  <E, T>(predicate: (T) => Either<E, T>) =>
    (arr: T[]): Either<E, T[]> => array.traverse(either)(arr, predicate) as Either<E, T[]>
export const allBigAndBold = traverseArrayEither(isBigAndBoldEither)

/**
 * sequence lefts
 */
// const sequenceValidation = sequence(validation, array)
//
// function validate<L, A>(input: Array<Either<Array<L>, A>>): Either<Array<L>, Array<A>> {
//   const toValidation = fromEither(getArrayMonoid<L>())
//   return sequenceValidation(input.map(toValidation)).toEither()
// }
//
// console.log(validate([right(1), right(2)])) // right([1, 2])
// console.log(validate([right(1), left(['a'])])) // left(["a"])
// console.log(validate([left(['a']), left(['b'])])) // left(["a", "b"])

/**
 * IO
 *
 * Use when
 * - You are not in control of an underlying value
 *
 * Example wrapping process.env
 */
const ioEnv = new IO(() => readEnv())
export const iLoveEditor =
  ioEnv
    .map((env) => env.EDITOR)
    .map((s) => `I love ${s}`)
