const express = require('express')
const cors = require('cors')

const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')
const categorysRouter = require('./routers/categorys')
const moderatorsRouter = require('./routers/moderators')
const commentsRouter = require('./routers/comments')
const votesRouter = require('./routers/votes')

const port = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/categorys', categorysRouter)
app.use('/moderators', moderatorsRouter)
app.use('/comments', commentsRouter)
app.use('/votes', votesRouter)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})