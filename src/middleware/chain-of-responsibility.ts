import { buildMiddleware, TMiddleware } from './middleware'

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
      hasEnoughMoney: atm.ones < env.getBalance() ? 'Yes!' : 'No'
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
