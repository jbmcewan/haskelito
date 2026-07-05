import {
  All,
  Any,
  Effect,
  Either,
  First,
  Last,
  ListMonoid,
  Maybe,
  Product,
  Reader,
  Stream,
  Sum,
  Validation,
  chain,
  compose,
  curry,
  flatMap,
  foldMap,
  map,
  match,
  matchExhaustive,
  matchOrElse,
  pipe,
  take
} from '../dist/index.js'

const divider = (title) => console.log(`\n=== ${title} ===`)

const toMaybeView = (value) =>
  value.fold(
    () => ({ tag: 'Nothing' }),
    (inner) => ({ tag: 'Just', value: inner })
  )

const toEitherView = (value) =>
  value.fold(
    (inner) => ({ tag: 'Left', value: inner }),
    (inner) => ({ tag: 'Right', value: inner })
  )

const toValidationView = (value) =>
  value.fold(
    (inner) => ({ tag: 'Failure', value: inner }),
    (inner) => ({ tag: 'Success', value: inner })
  )

const run = async () => {
  divider('Combinators')
  const add3 = curry((left, middle, right) => left + middle + right)
  console.log('curry:', add3(1)(2)(3))
  console.log(
    'pipe:',
    pipe(
      2,
      (value) => value + 1,
      (value) => value * 3
    )
  )

  const multiplyAfterIncrement = compose(
    (value) => value * 3,
    (value) => value + 1
  )
  console.log('compose:', multiplyAfterIncrement(2))
  console.log('map:', toMaybeView(map((value) => value * 2, Maybe.Just(4))))
  console.log('chain:', toMaybeView(chain((value) => Maybe.Just(value + 5), Maybe.Just(2))))
  console.log('flatMap:', toMaybeView(flatMap((value) => Maybe.Just(value * 3), Maybe.Just(2))))

  divider('Maybe')
  const justUser = Maybe.fromNullable({ name: 'Ada', role: 'admin' })
  console.log('Maybe.map:', toMaybeView(justUser.map((user) => user.name)))
  console.log('Maybe.getOrElse:', Maybe.Nothing().getOrElse('guest'))
  console.log('Maybe.toEither:', toEitherView(Maybe.toEither(() => 'missing user', justUser)))
  console.log('Maybe.filter:', toMaybeView(Maybe.filter((user) => user.role === 'admin', justUser)))
  console.log(
    'Maybe.orElse:',
    toMaybeView(Maybe.orElse(() => Maybe.Just({ name: 'Fallback' }), Maybe.Nothing()))
  )

  divider('Either')
  const parsed = Either.tryCatch(
    () => JSON.parse('{"count":2}'),
    (error) => (error instanceof Error ? error.message : String(error))
  )
  console.log('Either.tryCatch:', toEitherView(parsed))
  console.log(
    'Either.fromNullable:',
    toEitherView(Either.fromNullable(null, () => 'missing value'))
  )
  console.log(
    'Either.mapLeft:',
    toEitherView(Either.mapLeft((error) => `ERR:${error}`, Either.Left('boom')))
  )
  console.log(
    'Either.bimap:',
    toEitherView(
      Either.bimap(
        (error) => `ERR:${error}`,
        (value) => value.count * 10,
        parsed
      )
    )
  )

  divider('Validation')
  const validation = Validation.Success((value) => value * 2).ap(Validation.Success(4))
  console.log('Validation.ap:', toValidationView(validation))
  console.log('Validation.Failure:', toValidationView(Validation.Failure(['name is required'])))

  divider('Pattern matching')
  const describeEither = match({
    Left: (error) => `error:${error}`,
    Right: (value) => `ok:${value}`
  })
  console.log('match:', describeEither(Either.Right(3)))
  console.log(
    'matchOrElse:',
    matchOrElse({ Just: (value) => `just:${value}` }, () => 'fallback')(Maybe.Nothing())
  )
  console.log(
    'matchExhaustive:',
    matchExhaustive({ Left: (error) => `left:${error}`, Right: (value) => `right:${value}` })(
      Either.Right('done')
    )
  )

  divider('Reader and Effect')
  const env = { baseUrl: 'https://example.test', retries: 2 }
  const readBaseUrl = Reader.asks((currentEnv) => currentEnv.baseUrl)
  const withVersionedEnv = Reader.local(
    (currentEnv) => ({ baseUrl: `${currentEnv.baseUrl}/v1` }),
    Reader((currentEnv) => currentEnv.baseUrl)
  )
  console.log('Reader.asks:', readBaseUrl.run(env))
  console.log('Reader.local:', withVersionedEnv.run(env))
  console.log(
    'Reader.ask:',
    Reader.ask()
      .map((currentEnv) => currentEnv.retries)
      .run(env)
  )
  console.log(
    'Effect.of:',
    await Effect.of('config.json')
      .map((path) => `/static/${path}`)
      .run()
  )
  console.log(
    'Effect.tryCatch:',
    await Effect.tryCatch(
      () => {
        throw new Error('network')
      },
      (error) => (error instanceof Error ? error.message : String(error))
    ).run()
  )

  divider('Monoids')
  console.log('Sum:', Sum.concat(10, 20), 'empty:', Sum.empty())
  console.log('Product:', Product.concat(4, 5), 'empty:', Product.empty())
  console.log('All:', All.concat(true, false), 'empty:', All.empty())
  console.log('Any:', Any.concat(false, true), 'empty:', Any.empty())
  console.log('First.of:', toMaybeView(First.of('first')))
  console.log('First.fromNullable:', toMaybeView(First.fromNullable('primary')))
  console.log('First:', toMaybeView(First.concat(Maybe.Just('first'), Maybe.Just('second'))))
  console.log('Last.of:', toMaybeView(Last.of('second')))
  console.log('Last.fromNullable:', toMaybeView(Last.fromNullable('secondary')))
  console.log('Last:', toMaybeView(Last.concat(Maybe.Just('first'), Maybe.Just('second'))))
  console.log('ListMonoid:', ListMonoid.concat([1], [2, 3]), 'empty:', ListMonoid.empty())
  console.log('foldMap Sum:', foldMap(Sum, [1, 2, 3, 4]))

  divider('Collections')
  const evenStream = Stream.iterate((value) => value + 2, 0)
  console.log('take:', take(5, evenStream))
}

run()
