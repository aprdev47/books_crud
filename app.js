const http = require('http')
const url = require('url')
const books_controller = require('./controllers/books_controller');

const server = http.createServer((req, res) => {
  let data = '';
  const path = url.parse(req.url, true).pathname;
  const query_object = url.parse(req.url, true).query;
  switch (req.method) {
    case "GET":
      if(path == '/books' ){
        isbn = query_object.isbn
        books_controller.getBooks(req,isbn,res)
        break
      }
    case "POST":
      if (path === "/books") {
        books_controller.addBook(req,res)
        break
      }
  	case "PUT":
      if (path === "/books") {
        isbn = query_object.isbn
        books_controller.updateBook(req,isbn,res)
        break
      }
  	case "DELETE":
      if (path === "/books") {
        isbn = query_object.isbn
        books_controller.deleteBook(req,isbn,res)
        break
      }
    default:
      res.writeHead(404, { "Content-type": "text/plain" })
      res.write("Not Found")
      res.end()
  }
})

server.listen(9000, () => {
  console.log(`Server running on Port 9000`)
})




