const validator = require('../helpers/validate');
const respond = require('../helpers/responses');
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./database/books.db',sqlite.OPEN_READWRITE)
db.run('CREATE TABLE IF NOT EXISTS books(author TEXT NOT NULL, title TEXT NOT NULL,isbn PRIMARY KEY NOT NULL,release_date TEXT)');

async function bodyParser(request) {
  return new Promise((resolve, reject) => {
    let totalChunked = ""
    request
      .on("error", err => {reject()})
      .on("data", chunk => { totalChunked += chunk })
      .on("end", () => {
        request.body = JSON.parse(totalChunked) // Adding Parsed Chunked into request.body
        resolve()
      })
  })
}

// Get list of books & Single book data (if book ISBN passed as parameter)
async function getBooks (req,isbn,res){
    db.serialize(()=>{
      if(isbn){
        db.get('SELECT * FROM books WHERE isbn =?', [isbn], function(err,book){     
          if(err) respond.errorData(412,err,res)
          if(book)respond.successData(book,res)
          else respond.success("Oops!! Book not found,please check the ISBN",res)
        });
      } else {
        db.all('SELECT * FROM books',[], (err,books)=>{     
         if(err) respond.errorData(412,err,res)
          if(books)respond.successData(books,res)
          else respond.success("Oops!! No books found",res)
        });
      }
    });
}

// Add new book to the database
async function addBook(req, res) {
  await bodyParser(req)
	validator(req.body,(err, status) => {
        if (!status) respond.errorData(412,err,res)
        else {
          try {
            db.serialize(()=>{

              db.run('INSERT INTO books(author,title,isbn,release_date) VALUES(?,?,?,?)', [req.body.author, req.body.title,req.body.isbn,req.body.release_date], function(err) {
                if (err) respond.errorData(412,err,res)
                else respond.success("New book has been added into the database with ISBN = "+req.body.isbn,res)
              });
            });
  			  } catch (err) {respond.error(400,"Invalid body data was provided",res)}
        }
    });
}

// Update existing book in the dataase
async function updateBook(req,isbn, res) {
  await bodyParser(req)
  db.serialize(()=>{
    if(isbn){
      db.get('SELECT * FROM books WHERE isbn =? LIMIT 1', [isbn], function(err,book){     
        if(err) respond.errorData(412,err,res)
        if(book){
          validator(req.body, (err, status) => {
            if (!status) respond.errorData(412,err,res)
              else {
              try {
                  db.run('UPDATE books SET author=?,title=?,isbn=?,release_date=? WHERE isbn=?', [req.body.author, req.body.title,req.body.isbn,req.body.release_date,isbn], function(err) {
                    if (err) {
                        respond.errorData(412,err,res)
                    } else return respond.success("Book with ISBN = "+req.body.isbn+" updated",res)
                  }); 
                } catch (err) { respond.errorData(400,err,res) }
              }
          });
        }
        else respond.error(404,"Oops!! Book not found,please check the ISBN",res)
      });
    } else respond.error(404,"Book ISBN parameter missing",res)
  });
}
// Delete existing book from the database
const deleteBook = (request,isbn,res) => {
  if(isbn){
      db.run('DELETE FROM books WHERE isbn=?',[isbn],function(err) {
        if (err) respond.errorData(412,err,res)
        else respond.success("Book with ISBN = "+isbn+" deleted",res)
      });
  } else respond.error(404,"Book ISBN parameter missing",res)
}
module.exports = {getBooks,addBook,updateBook,deleteBook};