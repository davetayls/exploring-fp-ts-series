import { Either, fromPredicate, left, right } from 'fp-ts/lib/Either'
import { fromEither, TaskEither, right as taskEitherRight } from 'fp-ts/lib/TaskEither'
import { Task } from 'fp-ts/lib/Task'

type TMiddleware<Env, Context> =
  (env: Env, next: (context: Context) => Context) =>
    (context: Context) => Context

type THandler<ContextIn, ContextOut> = (context: ContextIn) => ContextOut

export function buildMiddleware<Env, Context>(...middlewares: Array<TMiddleware<Env, Context>>) {
  return (env: Env) =>
    (req: Context): Context => {
      const runFinal = (context: any) => context
      const chain = middlewares
        .reduceRight((next: any, middleware) => middleware(env, next), runFinal)
      return chain(req)
    }
}

// Simple chain of responsibility
const env = {
  getBalance: () => 500
}

interface IChainOfResponsibility {
  name: string
  ones: number
  tens?: number
  twenties?: number
  hundreds?: number
  hasEnoughMoney?: string
}

const hasEnoughMoney: TMiddleware<typeof env, IChainOfResponsibility> =
  (env, next) => atm => {
    const result = {
      ...atm,
      hasEnoughMoney: atm.ones < env.getBalance() ? 'Yes!': 'No'
    }
    return next(result)
  }

const hundreds: TMiddleware<typeof env, IChainOfResponsibility> =
  (env, next) => atm => {
    const ones = atm.ones % 100
    const result = {
      ...atm,
      hundreds: (atm.ones - ones) / 100,
      ones
    }
    return next(result)
  }

const twenties: TMiddleware<typeof env, IChainOfResponsibility> =
  (env, next) => atm => {
    const ones = atm.ones % 20
    const result = {
      ...atm,
      twenties: (atm.ones - ones) / 20,
      ones
    }
    return next(result)
  }

const tens: TMiddleware<typeof env, IChainOfResponsibility> =
  (env, next) => atm => {
    const ones = atm.ones % 10
    const result = {
      ...atm,
      tens: (atm.ones - ones) / 10,
      ones
    }
    return next(result)
  }

export const handleRequestPipeline =
  buildMiddleware(hasEnoughMoney, hundreds, twenties, tens)
export const chainOfResponsibility = handleRequestPipeline(env)

// Either pipeline

// interface IRequest {
//   data: number
// }
//
// interface IResponse {
//   data?: number,
//   error?: Error
// }
//
// const a: TMiddleware<any, Either<IResponse, IRequest>> = (env, next) => ctx => {
//   console.log('a', ctx)
//   return next(ctx.map(x => ({ ...x, res: 1 })))
// }
// const b: TMiddleware<any, Either<IResponse, IRequest>> = (env, next) => ctx => {
//   console.log('b', ctx)
//   return next(ctx.chain(() =>
//     left({
//       error: new Error('boom')
//     })
//   ))
// }
//
// const c: TMiddleware<any, Either<IResponse, IRequest>> = (env, next) => ctx => {
//   console.log('c', ctx)
//   return next(ctx.chain(() =>
//     left({
//       data: 20
//     })
//   ))
// }
//
// const eitherHandler = (ctx: Either<IResponse, IRequest>): IResponse => {
//   console.log('either handler', ctx)
//   return ctx.fold((res) => res, (req) => ({ error: new Error('No request was made') }))
// }
//
// console.log('Either', buildMiddleware(a, b, c)({}, eitherHandler)(right({ data: 0 })))
//
// // TaskEither
//
// const teA: TMiddleware<any, TaskEither<IResponse, IRequest>> = (env, next) => ctx => {
//   console.log('a', ctx)
//   return next(ctx.map(x => ({ ...x, res: 1 })))
// }
// const teFail: TMiddleware<any, TaskEither<IResponse, IRequest>> = (env, next) => ctx => {
//   console.log('b', ctx)
//   return next(ctx.chain(() =>
//     fromEither(left({
//       error: new Error('boom')
//     }))
//   ))
// }
//
// const teSucceed: TMiddleware<any, TaskEither<IResponse, IRequest>> = (env, next) => ctx => {
//   console.log('c', ctx)
//   return next(ctx.chain(() =>
//     fromEither(left({
//       data: 20
//     }))
//   ))
// }
//
// const taskEitherHandler: THandler<TaskEither<IResponse, IRequest>, TaskEither<IResponse, IResponse>> = (ctx) => {
//   console.log('task either handler', ctx)
//   const task: Task<IResponse> = ctx
//     .fold(
//       (res) => res,
//       (req) => ({ error: new Error('No request was made') })
//     )
//   return taskEitherRight<IResponse, IResponse>(task)
//     .chain((res) => {
//       if (res.error) {
//         return fromEither(left(res))
//       } else {
//         return fromEither(right(res))
//       }
//     })
// }
//
// const taskEitherPipeline =
//   buildMiddleware(teA, teSucceed, teFail)({}, taskEitherHandler)
//
// taskEitherPipeline(fromEither(right({ data: 0 })))
//   .fold(
//     (err) => {
//       console.log('TaskEither error', err)
//     },
//     (res: any) => {
//       console.log('TaskEither', res)
//     }
//   )
//   .run()
//
// // what about with promises
// const prA: TMiddleware<any, Promise<IRequest>> = (env, next) => ctx =>
//   next(
//     ctx.then((req) => {
//       req.data += 10
//       return req
//     })
//   )
//
// const prB: TMiddleware<any, Promise<IRequest>> = (env, next) => ctx =>
//   next(
//     ctx.then((req) => {
//       req.data *= 2
//       return req
//     })
//   )
//
// const promiseHandler: THandler<Promise<IRequest>, Promise<IResponse>> = (ctx) => {
//   return ctx
// }
//
// buildMiddleware(prA, prB)({}, promiseHandler)(Promise.resolve({ data: 10 }))
//   .then(console.log.bind(null, 'Promise'), console.log.bind(null, 'Promise'))
