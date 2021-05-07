const http = require("http")
const validator = require('./helpers/validate');
let db=[]
const server = http.createServer((request, response) => {
  let url = request.url
  let method = request.method

  switch (method) {
    case "GET":
      if (url === "/books") {
        getBooks(request,response)
      }
      break
    case "POST":
      if (url === "/books") {
        addBook(request,response)
      }
      break
	case "PUT":
      updateBook(request, response)
	  break
	case "DELETE":
      deleteBook(request, response)
      break
    default:
      response.writeHead(200, { "Content-Type": "text/plain" })
      response.write("Url Not Found")
      response.end()
  }
})

server.listen(9000, () => {
  console.log(`Server running on Port 9000`)
})

async function bodyParser(request) {
  return new Promise((resolve, reject) => {
    let totalChunked = ""
    request
      .on("error", err => {
        console.error(err)
        reject()
      })
      .on("data", chunk => {
        totalChunked += chunk // Data is in chunks, concatenating in totalChunked
      })
      .on("end", () => {
        request.body = JSON.parse(totalChunked) // Adding Parsed Chunked into request.body
        resolve()
      })
  })
}
const validationRules = {
    "author": "required|string",
    "title": "required|string",
    "isbn": "required|min:13",
    "release_date": "string"
}
const getBooks = (request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(db))
  response.end()
}

async function addBook(request, response) {
	await bodyParser(request)
	validator(request.body, validationRules, {}, (err, status) => {
        if (!status) {
            response.writeHead(412, { "Content-Type": "application/json" })
		    response.write(JSON.stringify(err))
		    response.end()
        } else {
        	try {
			    db.push(request.body)
			    response.writeHead(200, { "Content-Type": "application/json" })
			    response.write(JSON.stringify(db))
			    response.end()
			  } catch (err) {
			    response.writeHead(400, { "Content-type": "text/plain" })
			    response.write("Invalid body data was provided")
			    response.end()
			  }
        }
    });
}


async function updateBook(request, response) {
  await bodyParser(request)
  validator(request.body, validationRules, {}, (err, status) => {
        if (!status) {
            response.writeHead(412, { "Content-Type": "application/json" })
		    response.write(JSON.stringify(err))
		    response.end()
        } else {
        	try {
			    // Getting url for request stream.
			    let url = request.url
			    // Js string function to split url
			    let idQuery = url.split("?")[1]
			    let idKey = idQuery.split("=")[0] // index of our DB array which will be id
			    let idValue = idQuery.split("=")[1] // Index Value

			    if (idKey === "isbn") {
			    	let book_index = db.findIndex(book => book.isbn === idValue)
					if (book_index<0) {
					    response.writeHead(400, { "Content-type": "text/plain" })
				        response.write("Oops!! Book not found,please check the ISBN")
				        response.end()
					}  
					else {
						// Appending Request body into provided index
				  		db[book_index] = request.body
				  		response.writeHead(200, { "Content-Type": "application/json" })
				        response.write(JSON.stringify(db))
				        response.end()
					}
			       
			    } else {
			        response.writeHead(400, { "Content-type": "text/plain" })
			        response.write("Invalid Query")
			        response.end()
			    }
			} catch (err) {
			    response.writeHead(400, { "Content-type": "text/plain" })
			    response.write("Invalid body data was provided", err.message)
			    response.end()
			}
        }
    });
  
}
const deleteBook = (request, response) => {
  let url = request.url

  let idQuery = url.split("?")[1]
  let idKey = idQuery.split("=")[0]
  let idValue = idQuery.split("=")[1]

  if (idKey === "isbn") {
  	let book_index = db.findIndex(book => book.isbn === idValue)
	if (book_index<0) {
	   response.writeHead(400, { "Content-type": "text/plain" })
       response.write("Oops!! Book not found,please check the ISBN")
       response.end()
	}  
	else{
		db.splice(book_index, 1) // Splicing Array or DB.
		response.writeHead(200, { "Content-type": "text/plain" })
	    response.write("Delete Success")
	    response.end()
	}
   
  } else {
    response.writeHead(400, { "Content-type": "text/plain" })
    response.write("Invalid Query")
    response.end()
  }
}
