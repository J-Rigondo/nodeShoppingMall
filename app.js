//서버설정
var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var session=require('express-session');
var mss=require('express-mysql-session')(session);
    
var option={ //세션설정
        host:'114.71.137.109',
        port:3306,
        user:'201844014',
        password:'201844014',
        database:'SW_201844014',
        charset:'utf8'
}
var sstore=new mss(option);

app.locals.pretty=true;
app.set('view engine','jade');
app.set('views',['./views/user','./views/manager','./views']);
app.use(express.static(__dirname+'/public'));
app.use('/bootstrap',express.static(__dirname+'/public/bootstrap/css'));
app.use('/img',express.static(__dirname+'/public/images'));
app.use('/css',express.static(__dirname+'/public/css'));
app.use('/js',express.static(__dirname+'/public/js'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({ //세션
    secret:'warwefwegwegwtqwerwfawfawgwaegwae',
    resave:false,
    saveUninitialized:true,
    store:sstore
}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});


app.use('/',require('./route/controller/mainctr'));
app.use('/login',require('./route/controller/loginctr'));
app.use('/manager',require('./route/controller/managerctr'));


app.listen(3000,(req,res)=>{
    console.log('running at 3000 port');
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
            switch ($1) {
                    case "yyyy": return d.getFullYear();
                    case "yy": return (d.getFullYear() % 1000).zf(2);
                    case "MM": return (d.getMonth() + 1).zf(2);
                    case "dd": return d.getDate().zf(2);
                    case "E": return weekName[d.getDay()];
                    case "HH": return d.getHours().zf(2);
                    case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                    case "mm": return d.getMinutes().zf(2);
                    case "ss": return d.getSeconds().zf(2);
                    case "a/p": return d.getHours() < 12 ? "오전" : "오후";
                    default: return $1;
            }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};