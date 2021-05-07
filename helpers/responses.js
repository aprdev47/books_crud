function success(msg,res){
	res.writeHead(200, { "Content-type": "text/plain" })
	res.write(msg)
	res.end()
}
function error(code,msg,res){
	res.writeHead(code, { "Content-type": "text/plain" })
	res.write(msg)
	res.end()
}
function successData(data,res){
	res.writeHead(200, { "Content-Type": "application/json" })
	res.write(JSON.stringify(data))
	res.end()
}
function errorData(code,data,res){
    res.writeHead(code, { "Content-Type": "application/json" })
	res.write(JSON.stringify(data))
	res.end()
}
module.exports = {success,error,successData,errorData};
