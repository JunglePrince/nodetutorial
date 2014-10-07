var express = require('express');
var router = express.Router();

/*
 * GET data list.
 */
router.get('/list', function(req, res) {
  var db = req.db;
  db.collection('datalist').find().toArray(function (err, items) {
    res.json(items);
  });
});

/*
 * POST to adduser.
 */
router.post('/add', function(req, res) {
  var db = req.db;
  db.collection('datalist').insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;

/*
 * DELETE to deleteuser.
 */
router.delete('/delete/:id', function(req, res) {
  var db = req.db;
  var userToDelete = req.params.id;
  db.collection('datalist').removeById(userToDelete, function(err, result) {
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  });
});
