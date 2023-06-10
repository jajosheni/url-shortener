const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let id = req.params.id ?? null;
  res.send({id: id});
});

module.exports = router;
