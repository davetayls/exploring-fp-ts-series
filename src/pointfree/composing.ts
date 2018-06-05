import { IO } from 'fp-ts/lib/IO'
import { and, compose, curry, flip } from 'fp-ts/lib/function'
import { Either, either, fromNullable, left, right } from 'fp-ts/lib/Either'
import { liftA2 } from 'fp-ts/lib/Apply'
import { readEnv } from '../lib/env'
import { Task, task } from 'fp-ts/lib/Task'
import { array } from 'fp-ts/lib/Array'
import { sequence, traverse } from 'fp-ts/lib/Traversable'
import { fromEither, taskEither, tryCatch } from 'fp-ts/lib/TaskEither'
import { flatten } from 'fp-ts/lib/Chain'
import { StrMap, strmap } from 'fp-ts/lib/StrMap'
import { validation } from 'fp-ts/lib/Validation'

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
const eitherMap =
  <L, R, B>(f: (a: R) => B) =>
    (e: Either<L, R>): Either<L, B> => e.map(f)

const eitherNullable =
  <L, R>(leftValue: L) =>
    (r: R | null | undefined): Either<L, R> => fromNullable(leftValue)(r)

export const eitherHello = compose(
  eitherMap(str('hello ')),
  eitherNullable<string, string>('yo!!')
)

/**
 * Composing with Task
 */
const renderPage = curry((name: string, age: string) => `Hello ${name}, you are ${age}`)
const liftedRender = liftA2(task)(renderPage)
const taskName = new Task(() =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('Dave'), 1000)
  })
)
const taskAge = task.of('89')
export const renderTitle = liftedRender(taskName)(taskAge)

/**
 * TaskEither
 */
const doSomething = (a: number) => (b: number) => fromEither(left(new Error(`boo ${a} ${b}`))) //taskEither.of(a + b)
const liftedSomething = liftA2(taskEither)(doSomething)
export const calcSomething = flatten(taskEither)(
  liftedSomething(taskEither.of(1))(taskEither.of(2))
)

/**
 * Ap
 */
const age = either.of(20)
const many = either.of(4)
const timesAge = (age: number) => (times: number) => age * times
age.ap(many.map(timesAge))

/**
 * Traversing with Either
 */
const isBigAndBoldEither: (a: string) => Either<string, string> =
  (a: string) => isBigAndBold(a) ? right(a) : left('No!')

const traverseArrayEither =
  <E, T>(predicate: (val: T) => Either<E, T>) =>
    (arr: T[]): Either<E, T[]> =>
      traverse(either, array)(arr, predicate)

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
 * sequence TaskEither
 */
export const sequenceTaskEither = () => {
  const arr = [
    taskEither.of(1),
    taskEither.of(2),
    tryCatch(
      () => new Promise<number>((r, rej) => {
        console.log('te 1', new Date())
        return setTimeout(() => rej(new Error('1')), 1100)
      }),
      (err) => err
    ),
    tryCatch(
      () => new Promise<number>((r, rej) => {
        console.log('te 2', new Date())
        return setTimeout(() => rej(new Error('2')), 1000)
      }),
      (err) => err
    )
  ]
  return sequence(taskEither, array)(arr)
    // .map(([a, b, c]) => {
    //   return a + b + c
    // })
    .run()

  // const m = new StrMap({
  //   a: taskEither.of(1),
  //   b: taskEither.of(2),
  //   c: tryCatch(
  //     () => new Promise<number>((r, rej) =>
  //       setTimeout(() => rej(new Error('1')), 1100)),
  //     (err) => err
  //   ),
  //   d: tryCatch(
  //     () => new Promise<number>((r, rej) =>
  //       setTimeout(() => rej(new Error('2')), 1000)),
  //     (err) => err
  //   )
  // })
  // return sequence(taskEither, strmap)(m)
  //   // .map((a) => {
  //   //   console.log('map', a)
  //   //   return a
  //   // })
  //   .run()
}
