// what about with promises

import { buildMiddleware, TMiddleware } from './middleware'

interface IData {
  id: string
  name: string
  age: number
}

interface IRequest {
  data: { id: string }
}

interface IResponse {
  data?: IData
  error?: Error
}

interface IContext {
  req: IRequest
  res: IResponse
}

const data: { [id: string]: IData } = {
  helen: { id: 'helen', name: 'Helen', age: 20 },
  bob: { id: 'bob', name: 'Bob', age: 16 }
}

const fetchFromServer: TMiddleware<{}, Promise<IContext>> =
  (env, next) => promise =>
    next(
      promise.then((ctx) => {
        // Just mock an api call
        return new Promise<IContext>((resolve) => {
          setTimeout(() => {
            ctx.res = {
              data: data[ctx.req.data.id]
            }
            resolve(ctx)
          }, 500)
        })
      })
    )

const mustBeAdult: TMiddleware<any, Promise<IContext>> =
  (env, next) => promise =>
    next(
      promise.then((ctx) => {
        if (ctx.res && ctx.res.data && ctx.res.data.age < 18) {
          return {
            ...ctx,
            res: {
              error: new Error('Must be an adult')
            }
          }
        } else {
          return ctx
        }
      })
    )

const buildPersonDataFetcher = buildMiddleware(
  fetchFromServer,
  mustBeAdult
)

export const fetchPerson = (req: IRequest) =>
  buildPersonDataFetcher({})(Promise.resolve({ req, res: {} }))
    .then((ctx) => {
      if (ctx.res.error) {
        throw ctx.res.error
      } else {
        return ctx.res
      }
    })




