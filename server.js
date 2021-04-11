/*jslint devel: true */
/*eslint-disable no-console */
/*eslint no-undef: "error" */
/*eslint-env node */

var l = console.log;
// var d = console.dir;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var moment = require('moment');
var JSAlert=require('js-alert');
console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'root',
    port: 3306,
    database:'parking'
});

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/client'));
 
server.listen('80', function() {
    l('웹서버가 시작되었습니다.(113.198.234.53:80)');
	setInterval(intervalFunc, 3000);
});
 
app.get('/', function(req, res) {
    res.sendfile('./client/index.html');
});
 
app.post('/reservation', function(req, res)  // 예약 Post
{  
    let inTimes = req.body.intime.split('T');
    let inTime = inTimes[0] + ' ' + inTimes[1];
    let outTimes = req.body.outtime.split('T');
    let outTime = outTimes[0] + ' ' + outTimes[1];
    
    try {
        /*
        connection.query(`INSERT INTO p1 (name, phone, carnumber, password, indate, outdate) VALUES ('${req.body.name}', ${req.body.phone}, '${req.body.carnumber}', ${req.body.password}, '${inTime}', '${outTime}');`);
        //res.sendfile('./client/success.html');
       res.redirect("http://113.198.234.53");
        */
		connection.query("SELECT * FROM `p1` WHERE `parknum` != 0 ORDER BY `parknum` ASC",
			function(err,arr){
            
                    if(arr.length < 1){
                        console.log('없음');
                        connection.query(`INSERT INTO p1 (name, phone, carnumber, password, indate, outdate,parknum) VALUES ('${req.body.name}', ${req.body.phone}, '${req.body.carnumber}', ${req.body.password}, '${inTime}', '${outTime}', 1 );`);
					    res.redirect("success.html");
                    }else{ 
                        var j=1;
                        
                        console.log('있음');
                        for(var i=0;i<4;i++){ 
                            if(arr[i]==undefined||j!=arr[i].parknum){
                                console.log('정상');
                                connection.query(`INSERT INTO p1 (name, phone, carnumber, password, indate, outdate,parknum) VALUES ('${req.body.name}', ${req.body.phone}, '${req.body.carnumber}', ${req.body.password}, '${inTime}', '${outTime}', ${j} );`);
                                res.redirect("success.html");
                                return true; 
                            }                  
                            else if(j==4){
                                console.log('만들수없음');
                                 //JSAlert.alert("예약이 꽉 차서 불가능합니다.")
                                res.redirect("fail.html");
                            }
                            else{
                                console.log('비정상');
                            }
                            
                            j++
                            }
                        }                 
//                        console.log('있음');
//                        for(var i=0;i<4;i++){ 
//                            if(arr[i]==undefined||(i+1)!=arr[i].parknum){
//                                console.log('정상');
//                                connection.query(`INSERT INTO p1 (name, phone, carnumber, password, indate, outdate,parknum) VALUES ('${req.body.name}', ${req.body.phone}, '${req.body.carnumber}', ${req.body.password}, '${inTime}', '${outTime}', ${i+1} );`);
//                                res.redirect("success.html");
//                                return true;
//                            }                  
//                            else if(i==3){
//                                console.log('만들수없음');
//                                 JSAlert.alert("예약이 꽉 차서 불가능합니다.")
////                                res.redirect("fail.html");
//                            }
//                            else{
//                                console.log('비정상');
//                            }
//
//                        }
                    
		});
    } catch(error) {
        error.message();
        return res.status(500);
    }
});

app.get('/success',function(req,res){
    res.redirect('index.html');
} );
app.get('/fail',function(req,res){
        res.redirect('index.html');
        });

function intervalFunc() {
	var nowtime = moment().format('YYYY-MM-DD HH:mm:ss');
	connection.query("DELETE FROM p1 WHERE outdate < '"+nowtime+"'");
}


/*
app.all('*', function(req, res) {
    res.redirect('/');
});*/