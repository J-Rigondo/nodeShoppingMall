var db=require('../../db.js');

exports.main=(req,res)=>{
    res.render('main');
}

exports.search=(req,res)=>{
    var search = req.query.search;    
    var pno=req.query.page;
    var maxpost=2;
    if(pno==null) var pno=1;
    var start = maxpost * pno - maxpost;
    
    var sql='select count(*) as postcnt from product';
    sql += " where pro_name like '%"+search+"%'";
    db.query(sql,[],(err,result)=>{
        if(err) console.log(err);
        else{
            var postcnt=result[0].postcnt;
            
            var sql='select * from product join thumbnail using(pro_no)'
            sql += " where pro_name like '%"+search+"%' order by pro_no desc limit ?,?";
                       
            db.query(sql,[start,maxpost],(err,result1)=>{
                if(err) console.log(err);
                else{
                    var pager={
                        pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) + 1,
                        startpost:maxpost * pno - maxpost,
                        endpost : maxpost * (pno-1) < postcnt ? maxpost * (pno-1) : postcnt-1
                    }                 
                    
                    res.render('product',{product:result1,pager:pager,pno:pno,search:search});
                }
            })
        }
    });          
}
exports.proDetail = (req,res)=>{
    var num=req.query.num;
    var sql='select * from product join thumbnail using(pro_no) where pro_no=?';
    db.query(sql,[num],(err,result)=>{
        res.render('prodetail',{result:result});
    })
    
}

exports.orderForm= (req,res)=>{
    var cnt=req.query.cnt;
    var pro_no=req.query.pro_no;
    res.render('orderform');

}
exports.myPage=(req,res)=>{
    if(req.session.displayname){
        res.render('mypage');
    }else{
        res.redirect('/login');
    }
}

exports.orderInfo=(req,res)=>{
    res.render('orderinfo');
}

exports.orderFinish=(req,res)=>{
    res.render('orderfinish');
}
exports.basket=(req,res)=>{
    res.render('basket');
}
exports.test = (req,res)=>{
    res.render('mypage');
}