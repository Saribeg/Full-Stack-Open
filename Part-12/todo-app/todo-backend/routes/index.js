const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const { getAsync, setAsync } = require('../redis');

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  if (getAsync && setAsync) {
    const cached = await getAsync('visits');
    const current = Number(cached) || 0;
    const next = current + 1;
    await setAsync('visits', next);
    visits = next;
  } else {
    visits++;
  }

  res.send({
    ...configs,
    visits
  });
});

/* GET statistics data. */
router.get('/statistics', async (req, res) => {
  if (getAsync && setAsync) {
    const cached = await getAsync('added_todos');
    const addedTodos = Number(cached) || 0;
    res.send({ added_todos: addedTodos });
  } else {
    res.send('Redis is disabled');
  }
});

module.exports = router;
