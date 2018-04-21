var fs=require("fs");
function sendFile(req,res,next,path){
    fs.readFile(__dirname+"/.."+path,function(err,data){
        if (err) {
            next(err);
            return;
        }
        res.write(data);
        res.end();
        next();
    });
}

module.exports=sendFile;