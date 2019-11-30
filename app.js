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


app.listen(3000,(req,res)=>{
    console.log('running at 3000 port');
});
