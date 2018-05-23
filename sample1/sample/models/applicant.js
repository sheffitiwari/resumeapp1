var knex = require('knex')({
    client: 'pg',
    connection: {
      host     : '127.0.0.1',
      user     : 'postgres',
      password : 'itscitsc',
      database : 'Resumeappdatabase',
      charset  : 'utf8'
    }
  });
var bookshelf = require('bookshelf')(knex);

var Applicant = bookshelf.Model.extend({
  tableName: 'Applicantinfo',
});

module.exports.Applicant = Applicant;
