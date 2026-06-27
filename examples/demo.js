import {
  Either,
  Effect,
  Maybe,
  Reader,
  Stream,
  Sum,
  curry,
  foldMap,
  match,
  take
} from '../src/index.js'

const mockDatabase = {
  users: {
    1: { name: 'alice', role: 'admin', scores: [10, 20, 30] },
    2: { name: 'bob', role: 'member', scores: [5, 5, 5] }
  }
}

const mockConfigEnv = {
  db: mockDatabase,
  logger: (message) => console.log(`[LOG] ${message}`),
  welcomePrefix: 'Greetings'
}

const uppercase = (value) => value.toUpperCase()

const parseJson = (value) =>
  Either.tryCatch(
    () => JSON.parse(value),
    (err) => `Invalid JSON structure: ${err.message}`
  )

const getProp = curry((prop, obj) => Maybe.fromNullable(obj?.[prop]))

const fetchUserFromEnv = (userId) =>
  Reader((env) =>
    Effect.tryCatch(
      () => {
        env.logger(`Fetching user ${userId} from DB...`)
        const user = env.db.users[userId]

        if (!user) throw new Error('User not found!')

        return user
      },
      (err) => `DB Error: ${err.message}`
    )
  )

const buildWelcomeString = (user) =>
  Reader((env) => {
    const formattedName = uppercase(user.name)
    return `${env.welcomePrefix}, ${formattedName}!`
  })

export const runDemo = async () => {
  console.log('--- STARTING FP DEMONSTRATION PROJECT ---\n')

  console.log('1. Lazy Lists & Monoids:')
  const infiniteEvens = Stream.iterate((n) => n + 2, 0)
  const firstFiveEvens = take(5, infiniteEvens)
  const sumOfEvens = foldMap(Sum, firstFiveEvens)
  console.log(`   First 5 Evens: [${firstFiveEvens}]`)
  console.log(`   Sum of Evens:  ${sumOfEvens}\n`)

  console.log('2. Either Parsing & Pattern Matching:')
  const goodJson = '{"userId": 1}'
  const badJson = '{"userId": 1'

  const handleJsonResult = match({
    Right: (data) => `   Success: Extracted ID -> ${data.userId}`,
    Left: (error) => `   Failure: ${error}`
  })

  console.log(handleJsonResult(parseJson(goodJson)))
  console.log(`${handleJsonResult(parseJson(badJson))}\n`)

  console.log('3. Composing Architecture (Reader + Effect + Maybe):')

  const program = fetchUserFromEnv(2).flatMap((effectUser) =>
    Reader((env) =>
      effectUser
        .map((user) => {
          const userScores = getProp('scores', user).getOrElse([])
          const totalScore = foldMap(Sum, userScores)
          return { ...user, totalScore }
        })
        .flatMap((userWithScore) => {
          const greeting = buildWelcomeString(userWithScore).run(env)
          return Effect.of(`${greeting} Your total score is ${userWithScore.totalScore}.`)
        })
    )
  )

  const executableEffect = program.run(mockConfigEnv)
  const outputMessage = await executableEffect.run()
  console.log(`   Result: ${outputMessage}\n`)

  console.log('--- DEMONSTRATION COMPLETE ---')
}

runDemo()
