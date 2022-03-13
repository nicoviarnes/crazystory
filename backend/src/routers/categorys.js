const express = require('express')
const { query } = require('../db')
const auth = require('../middleware/auth')()

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const selectCategorysStatement = `select * from categorys`
    const { rows } = await query(selectCategorysStatement)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params
    const selectCategoryStatement = `select * from categorys where name = $1`
    const {
      rows: [category],
    } = await query(selectCategoryStatement, [name])

    if (!category) {
      res.status(404).send({ error: 'Could not find category with that name' })
    }

    res.send(category)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body

    const nameRegex = new RegExp('^[a-z0-9]+$', 'i')

    if (!nameRegex.test(name)) {
      throw new Error(
        'Category name must consist only of alphanumeric characters, and must have length at least 1'
      )
    }

    const insertCategoryStatement = `
      insert into categorys(name, description)
      values($1, $2)
      returning *
    `

    let category
    try {
      ;({
        rows: [category],
      } = await query(insertCategoryStatement, [name, description]))
    } catch (e) {
      res
        .status(409)
        .send({ error: 'A category with that name already exists' })
    }

    const insertModeratorStatement = `
      insert into moderators(user_id, category_id)
      values($1, $2)
    `

    await query(insertModeratorStatement, [req.user.id, category.id])

    res.send(category)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
