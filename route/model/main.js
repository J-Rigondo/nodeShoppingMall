var db=require('../../db.js');

exports.main=(req,res)=>{
    res.render('main');
}

exports.glove=(req,res)=>{
    var maxpost=1;
    var pno=req.params.pagenum;
    if(pno==null) var pno=1;
    var start = maxpost * pno - maxpost;
    var sql='select count(*) as postcnt from product where pro_cate=?';
    db.query(sql,['글러브'],(err,result)=>{
        if(err) console.log(err);
        else{
            var postcnt=result[0].postcnt;
            var sql='select * from product join thumbnail using(pro_no) where th_no = ? order by pro_no desc limit ?,?';
            db.query(sql,[1,start,maxpost],(err,result1)=>{
                if(err) console.log(err);
                else{
                    var pager={
                        pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) + 1,
                        startpost:maxpost * pno - maxpost,
                        endpost : maxpost * (pno-1) < postcnt ? maxpost * (pno-1) : postcnt-1
                    }                    
                    res.render('glove',{product:result1,pager:pager,pno:pno});
                }
            })
        }
    });          
}

exports.sandbag=(req,res)=>{
    res.render('sandbag');
}

exports.headgear=(req,res)=>{
    res.render('headgear');
}

exports.etc=(req,res)=>{
    res.render('etc');
}

exports.proDetail = (req,res)=>{
    res.render('prodetail');
}

exports.test = (req,res)=>{
    res.render('test');
}