var db=require('../../db.js');
var fs=require('fs');
var path=require('path')

exports.member= (req,res)=>{   
  
    var search = req.query.search;    
    var pno=req.query.page;
    var maxpost=4;
    if(pno==null) var pno=1;
    var start = maxpost * pno - maxpost;
    
    var sql='select count(*) as postcnt from member';
    //sql += " and pro_name like '%"+search+"%'";
    db.query(sql,[],(err,result)=>{
        if(err) console.log(err);
        else{
            var postcnt=result[0].postcnt;
            
            var sql='select * from member limit ?,?';
            //sql += " where pro_valid=? and pro_name like '%"+search+"%' order by pro_no desc limit ?,?";
                       
            db.query(sql,[start,maxpost],(err,result1)=>{
                if(err) console.log(err);
                else{
                    var pager={
                        pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) + 1,
                        startpost:maxpost * pno - maxpost,
                        endpost : maxpost * (pno-1) < postcnt ? maxpost * (pno-1) : postcnt-1
                    }                 
                    
                    res.render('man-member',{members:result1,pager:pager,pno:pno,search:search});
                }
            });
        }
    });          
}

exports.memberdel=(req,res)=>{
    var id=req.body.id;
    var sql="update member set mem_valid =0 where mem_id=?";
    db.query(sql,[id],(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.send({result:1})
        }
    })
}


exports.simgupload=(req,res)=>{
    var file={
        path:req.file.path,
        origin:req.file.originalname,
        name:req.file.filename
}
console.log(file)
var num=req.body.no;
var sql="insert into thumbnail(pro_no,th_name) values(?,?)";
db.query(sql,[num,file.name],function(err,result){
        if(err) console.log(err);
        else{
               res.send({"src":file.name})
        }
})
}

exports.simgrevise=(req,res)=>{
    var file={
        path:req.file.path,
        origin:req.file.originalname,
        name:req.file.filename
}
console.log(file)
var num=req.body.no;
var sql="update thumbnail set th_name=? where pro_no=?";
db.query(sql,[file.name,num],function(err,result){
        if(err) console.log(err);
        else{
               res.send({"src":file.name})
        }
})
}

exports.bimgrev=(req,res)=>{
    var num=req.body.no;
    var name=req.body.name;
    var com=req.body.com;
    if(req.file){
        var file={
                path:req.file.path,
                origin:req.file.originalname,
                name:req.file.filename
        }
        var sql="update product set pro_name=?,pro_com=?,pro_content=? where pro_no=?"
        db.query(sql,[name,com,file.name,num],(err,result)=>{
            if(err)
                console.log(err);
            else{
                res.redirect('/manager/product')
            }
        })
        
}
}

exports.getnum=function(req,res){ //Auto_increment Get
    var sql="SHOW TABLE STATUS LIKE 'product'";
    db.query(sql,function(err,result){
            if(err) console.log(err);
            else{
                    res.send({num:result[0].Auto_increment});
            }
    })
};

exports.bimgupload=(req,res)=>{
    var num=req.body.no;
    var name=req.body.name;
    var com=req.body.com;
    if(req.file){
        var file={
                path:req.file.path,
                origin:req.file.originalname,
                name:req.file.filename
        }
        var sql="insert into product(pro_name,pro_code,pro_com,pro_cate,pro_content,pro_stock,pro_cost,pro_valid,pro_date) values(?,'bx-ba12',?,'글러브',?,10,120000,1,now())"
        db.query(sql,[name,com,file.name],(err,result)=>{
            if(err)
                console.log(err);
            else{
                res.redirect('/manager/product')
            }
        })
        
}

}

exports.prorevise=(req,res)=>{
    var no=req.query.no;
    console.log(no)
    var sql='select * from product where pro_no=?'
    db.query(sql,[no],(err,result)=>{
        if(err)
            console.log(err);
        else{
            console.log(result[0])
            res.render('man-prorevise',{result:result[0]});
        }
            

        
    })
    
}

exports.prodel=(req,res)=>{
    var no = req.query.no;
    console.log(no)
    sql='delete from product where pro_no=?';
    db.query(sql,[no],(err,result)=>{
        if(err)
            console.log(err);
        else{
            sql='delete from thumbnail where pro_no=?'
            db.query(sql,[no],(err,result)=>{
                if(err)
                    console.log(err);
                else
                    res.redirect('/manager/product');
            })
        }
    })
}

exports.product=(req,res)=>{


    var search = req.query.search;    
    var pno=req.query.page;
    var maxpost=4;
    if(pno==null) var pno=1;
    var start = maxpost * pno - maxpost;
    
    var sql='select count(*) as postcnt from product where pro_valid=?';
    
    db.query(sql,[1],(err,result)=>{
        if(err) console.log(err);
        else{
            var postcnt=result[0].postcnt;
            
            var sql='select * from product limit ?,?';            
                       
            db.query(sql,[start,maxpost],(err,result1)=>{
                if(err) console.log(err);
                else{
                    var pager={
                        pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) + 1,
                        startpost:maxpost * pno - maxpost,
                        endpost : maxpost * (pno-1) < postcnt ? maxpost * (pno-1) : postcnt-1
                    }                 
                    
                    res.render('man-product',{product:result1,pager:pager,pno:pno,search:search});
                }
            });
        }
    });          
}

exports.order=(req,res)=>{
  

    var search = req.query.search;    
    var pno=req.query.page;
    var maxpost=4;
    if(pno==null) var pno=1;
    var start = maxpost * pno - maxpost;
    
    var sql='select count(*) as postcnt from orders';
    
    db.query(sql,[1],(err,result)=>{
        if(err) console.log(err);
        else{
            var postcnt=result[0].postcnt;
            
            var sql='select * from orders join orderdetail using(order_no) join product using(pro_no) limit ?,?';            
                       
            db.query(sql,[start,maxpost],(err,result1)=>{
                if(err) console.log(err);
                else{
                    var pager={
                        pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) + 1,
                        startpost:maxpost * pno - maxpost,
                        endpost : maxpost * (pno-1) < postcnt ? maxpost * (pno-1) : postcnt-1
                    }                 
                    
                    res.render('man-order',{orders:result1,pager:pager,pno:pno,search:search});
                }
            });
        }
    });
}

exports.orderrev=(req,res)=>{
    var no=req.body.no;
    var status=req.body.status;
    console.log(status,no)
    var sql='update orders set order_status=? where order_no=?';
    db.query(sql,[status,no],(err,result)=>{
        if(err)
            console.log(err);
        else
            res.send({result:1});
    })
}

exports.orderdel=(req,res)=>{
    var no=req.body.no;    
    var sql='delete from orders where order_no=?';
    db.query(sql,[no],(err,result)=>{
        if(err)
            console.log(err);
        else
            res.send({result:1});
    })
}

exports.proupload=(req,res)=>{
        res.render('man-proupload')
}



exports.faq=function(req,res){ //faq페이지
    var maxpost=4; //페이지당 상품수
    var pno=req.query.page; //페이지넘버
    var val=req.query.val;
    var query=req.query;
    if(!pno)  var pno=1;
    var start=maxpost*pno-maxpost;
    var sql="select count(*) as postcnt from faq";
    if(val){
            sql=sql+" where faq_title like '%"+val+"%'";
    }
    db.query(sql,function(err,result){
            if(err) console.log(err);
            else{
                    var postcnt=result[0].postcnt;
                    var sql="select * from faq";
                    if(val){
                            sql=sql+" where faq_title like '%"+val+"%'";
                    }sql=sql+" order by faq_no desc limit ?,?"
                    db.query(sql,[start,maxpost],function(err,result){
                            if(err) console.log(err);
                            else{
                                    var pager={
                                            pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                            startpost:maxpost*pno-maxpost, //시작상품넘버
                                            endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                    }
                                  
                                            res.render('man-faq',{result:result,pager:pager,pno:pno,query:query});
                                    
                            }
                    })
            }
    })
};
exports.faqupload=function(req,res){ //faq등록페이지
    if(req.session.displayname){
            var dname=req.session.displayname;
            res.render('man-faqupload',{name:dname,id:req.session.user});
    }else{
            res.render('man-faqupload');
    }
};
exports.faquploadpost=function(req,res){ //faq등록
    console.log(req.body);
    var title=req.body.title;
    var text=req.body.text;
    var sql="insert into faq(faq_title,faq_content) values(?,?)";
    db.query(sql,[title,text],function(err,result){
            if(err) console.log(err);
            else{
                    if(result.affectedRows){
                            res.redirect("/manager/faq");
                    }else{
                            res.send('<script>alert("faq등록이 실패하였습니다");location.href="/faq"</script>');
                    }
            }
    })
};
exports.faqmodi=function(req,res){ //faq수정페이지
    var num=req.query.num;
    var sql="select * from faq where faq_no=?";
    db.query(sql,num,function(err,result){
            if(err) console.log(err);
            else{
                    console.log(result);
                    if(result){
                            if(req.session.displayname){
                                    var dname=req.session.displayname;
                                    res.render('man-faqmodify',{name:dname,id:req.session.user,faq:result[0]});
                            }else{
                                    res.render('man-faqmodify');
                            }
                    }else{
                            res.send('<script>alert("faq 수정 오류!!");location.href="/faq"</script>');
                    }
            }
    })
};



exports.faqmodify=function(req,res){ //faq수정
    var num=req.body.num;
    var title=req.body.title;
    var text=req.body.text;
    var sql="update faq set faq_title=?,faq_content=? where faq_no=?";
    db.query(sql,[title,text,num],function(err,result){
            if(err) console.log(err);
            else{
                    if(result.affectedRows){
                            res.send('<script>alert("수정 완료!!");location.href="/manager/faq"</script>');
                    }else{
                            res.send('<script>alert("수정 오류!!");location.href="/manager/faq"</script>');
                    }
            }
    })
};
exports.faqdel=function(req,res){ //faq삭제
    var num=req.body.num;
    var sql="delete from faq where faq_no=?";
    db.query(sql,num,function(err,result){
            if(err) console.log(err);
            else{
                    if(result.affectedRows){
                            res.send("true");
                    }else{
                            res.send("false");
                    }
            }
    })
};


