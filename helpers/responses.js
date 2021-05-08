function success(msg,res){
	data = {message:msg};
	successData(data,res)
}
function error(code,msg,res){
	data = {message:msg};
	errorData(code,data,res)
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
