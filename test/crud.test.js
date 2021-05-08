
require('http')
var chai = require('chai')
var expect = chai.expect
var chaiHttp = require('chai-http')

chai.use(chaiHttp)
app_url = 'http://localhost:8000'
describe('Books CRUD test', () => {
        it('Books list', (done) => {
            chai.request(app_url)
			    .get('/books')
			    .end(function(err, res) {
			        expect(err).to.be.null
			        expect(res).to.have.status(200)
			        expect(res).to.be.json
			        expect(res.body).to.be.a('array')
			        done()
		    });
        });
		it('Add new book : Data validation', (done) => {
	        let book = {
	          title: "",
	          author: "",
	          isbn: "",
	          release_date : "XYZ_ABC"
	        }
	        chai.request(app_url)
	            .post('/books')
	            .send(book)
	            .end((err, res) => {
	                  expect(res).to.have.status(412)
	                  expect(res).to.be.json
	                  expect(res.body).to.have.deep.nested.property('errors.author[0]');
	                  expect(res.body).to.have.deep.nested.property('errors.title[0]');
	                  expect(res.body).to.have.deep.nested.property('errors.isbn[0]');
	                  expect(res.body).to.have.deep.nested.property('errors.release_date[0]');
	              done();
	        });
	    });
	    it('Add new book functionality', (done) => {
	        let book = {
	          title: "The Lord of the Rings",
	          author: "J.R.R. Tolkien",
	          isbn: "9780563528883",
	          release_date : "2002"
	        }
	        chai.request(app_url)
	            .post('/books')
	            .send(book)
	            .end((err, res) => {
	                  expect(res).to.have.status(200)
	              done();
	        });
	    });
	    it('Update existing book functionality', (done) => {
	        let book = {
	          title: "The Lord of the Rings_2",
	          author: "J.R.R. Tolkien_3",
	          isbn: "9780563528883",
	          release_date : "2002"
	        }
	        chai.request(app_url)
	            .put('/books?isbn=9780563528883')
	            .send(book)
	            .end((err, res) => {
	                  expect(res).to.have.status(200)
	              done();
	        });
	    });
	    it('Book details with isbn', (done) => {
        chai.request(app_url)
		    .get('/books?isbn=9780563528883')
		    .end(function(err, res) {
		        expect(err).to.be.null
		        expect(res).to.have.status(200)
		        expect(res).to.be.json
				expect(res.body).to.have.all.keys('author', 'title','isbn','release_date');
		        done()
		    });
      	});
    	it('Delete existing book functionality', (done) => {
            chai.request(app_url)
            .delete('/books?isbn=9780563528883')
            .end((err, res) => {
                  expect(res).to.have.status(200)
              done();
        	});
        });


});
