const express = require('express')
const { query } = require('../db')
const { selectModeratorsStatement, userIsModerator } = require('../db/utils')
const auth = require('../middleware/auth')()

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { username, category } = req.query
    let whereClause = ''
    let whereClauseParams = []
    if (username && category) {
      whereClause = 'where u.username = $1 and sr.name = $2'
      whereClauseParams = [username, category]
    } else if (username) {
      whereClause = 'where u.username = $1'
      whereClauseParams = [username]
    } else if (category) {
      whereClause = 'where sr.name = $1'
      whereClauseParams = [category]
    }

    const getModeratorsStatement = `${selectModeratorsStatement} ${whereClause}`

    const { rows } = await query(getModeratorsStatement, whereClauseParams)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { username, category } = req.body
    if (!username) {
      throw new Error('Must specify user')
    }
    if (!category) {
      throw new Error('Must specify category')
    }

    if (await userIsModerator(req.user.username, category) === false) {
      return res.status(403).send({
        error: `You do not have permissions to add a moderator in the category ${category}`
      })
    }

    const insertModeratorStatement = `
      insert into moderators(user_id, category_id)
      values(
        (select id from users where username = $1),
        (select id from categorys where name = $2)
      ) returning *
    `

    const { rows: [insertedModerator] } = await query(insertModeratorStatement, [
      username,
      category
    ])

    res.status(201).send(insertedModerator)

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/', auth, async (req, res) => {
  try {
    const { username, category } = req.body
    if (!username) {
      throw new Error('Must specify user')
    }
    if (!category) {
      throw new Error('Must specify category')
    }

    if (await userIsModerator(req.user.username, category) === false) {
      return res.status(403).send({
        error: `You do not have permissions to delete a moderator in the category '${category}'`
      })
    }

    const deleteModeratorStatement = `
      delete from moderators
      where user_id = (select id from users where username = $1)
      and category_id = (select id from categorys where name = $2)
      returning *
    `

    const { rows: [deletedModerator] } = await query(deleteModeratorStatement, [
      username,
      category
    ])

    if (!deletedModerator) {
      return res.status(404).send({ error: 'Could not find that moderator' })
    }

    res.send(deletedModerator)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router