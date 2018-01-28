import { task, array, either } from 'fp-ts'
import { and, flip, compose, curry } from 'fp-ts/lib/function'
import { fromNullable, map, Either } from 'fp-ts/lib/Either'
import { liftA2 } from 'fp-ts/lib/Apply'

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

const eitherMap = curry(map)
export const eitherHello = compose(
  eitherMap(str('hello ')),
  fromNullable('rude!!')
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
  (a: string) => isBigAndBold(a) ? either.right(a) : either.left('No!')
const traverseArrayEither: <E, T>(predicate: (T) => Either<E, T>) => (arr: T[]) => Either<E, T[]> =
  (predicate) => (arr) => array.traverse(either)(predicate, arr)
export const allBigAndBold = traverseArrayEither(isBigAndBoldEither)
