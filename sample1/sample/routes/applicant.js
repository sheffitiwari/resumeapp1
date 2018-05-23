var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    
    destination: "/Users/soudergt-itsc/Desktop/sample1/sample/uploads",
    
	filename: function(req, file, callback) {
		console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

var upload = multer({
    storage: storage
})

var Applicant = require('../models/applicant').Applicant;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('applicant');
});

router.post('/new', upload.single('resume') , (req, res, next) =>  {
    console.log(req.body);
    console.log(req.body.person.file);
    
    Applicant.forge({
        Firstname: req.body.person.firstname,
        Secondname: req.body.person.lastname,
        Email: req.body.person.email,
        Position: req.body.person.job,
        Resume: req.body.person.file
      })
      .save()
    .then(res.send('Application posted!'))});
module.exports = router;