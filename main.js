var process = require('child_process');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();

app.use('/pages',express.static('pdfs'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:false})); 

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};

app.use(allowCrossDomain);

app.get('/getBase64',function(req,res){
	var url=req.query.url;
   url=url.replace(/&/g,'%26'); 
	var resp={
	   "status":'100'
	}
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	if(url==undefined||url==''||url==null){
	  
       resp.msg='url参数不能为空';
       res.end(JSON.stringify(resp));
    
	}
	else{
		var strShell='phantomjs --disk-cache=true --disk-cache-path=. index.js '+url;
        process.exec(strShell,{
        	maxBuffer:5000*1024,
        },function(error,stdout,strerr){
        	if(error!==null){
                console.log(error);
        		resp.msg='转换失败，稍后重试';
        		res.end(JSON.stringify(resp));
        	}else{
        		resp.data=stdout;
        		res.end(JSON.stringify(resp));
        	}
        })
	}

})

app.post('/getPDF', function(req, res) {
    var xmlObj = req.body.xmlObj;
    var filename = req.body.filename;
    const reqUrl = 'http://192.168.100.189:8080/test.html';//
    var response = {
        "status": '100',
    };
    if (xmlObj == undefined || xmlObj == '' || xmlObj == null) {
        response.msg = 'xml内容未输入';
        res.end(JSON.stringify(response));
    } else if (filename == undefined || filename == '' || filename == null) {
        response.msg = '文件名称未输入';
        res.end(JSON.stringify(response));
    } else {
        fs.writeFile('tmp.txt', xmlObj, function(err) {
            if (err) {
                response.msg = '生成PDF失败,请稍后重试';
                return res.end(JSON.stringify(response));
            }

            var strShell = 'phantomjs pdfs/index.js ' + reqUrl + ' ' + filename;
            process.exec(strShell, {
                maxBuffer: 5000 * 1024,
            }, function(error, stdout, strerr) {
                if (error !== null) {
                    response.msg = '脚本执行错误,请稍后重试';
                    res.end(JSON.stringify(response));
                } else {
                    response.data = stdout.replace("\r\n", "");
                    res.end(JSON.stringify(response));
                }

            })

        })

    }

})

var server = app.listen(8808,function(){
	var host = server.address().address
	var port = server.address().port
    console.log('http://%s:%s',host,port);
})


