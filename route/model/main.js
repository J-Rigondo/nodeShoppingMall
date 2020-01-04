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
    
    var sql='select count(*) as postcnt from product where pro_valid=?';
    sql += " and pro_name like '%"+search+"%'";
    db.query(sql,[1],(err,result)=>{
        if(err) console.log(err);
        else{
            var postcnt=result[0].postcnt;
            
            var sql='select * from product join thumbnail using(pro_no)'
            sql += " where pro_valid=? and pro_name like '%"+search+"%' order by pro_no desc limit ?,?";
                       
            db.query(sql,[1,start,maxpost],(err,result1)=>{
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
    var sql='select * from product join thumbnail using(pro_no) where pro_valid=? and pro_no=?';
    db.query(sql,[1,num],(err,result)=>{
        res.render('prodetail',{result:result});
    })
    
}

exports.orderForm= (req,res)=>{
    var cnt=req.query.cnt;
    var pro_no=req.query.pro_no;
    
    var sql='select * from product join thumbnail using(pro_no) where pro_no=?';
    db.query(sql,[pro_no],(err,result)=>{
        res.render('orderform',{result:result,cnt:cnt,bs:0});        
    });     
    
}

exports.basketOrderForm=(req,res)=>{
    var list=JSON.parse(req.body.orders); //배열로 바꾸기
    var totsum=req.body.total;
    var sql='select * from basket join product using(pro_no) join thumbnail using(pro_no) where bs_no in(';
    for(var i=0;i<list.length;i++){
        if(i==list.length-1){
            sql+="?)";
        }else{
            sql+="?,";
        }
    }
    db.query(sql,list,(err,result)=>{
        res.render('orderform',{result:result,total:totsum,bs:1});
    });   
}

exports.myPage=(req,res)=>{
    if(req.session.displayname){
        res.render('mypage');
    }else{
        res.redirect('/login');
    }
}

exports.orderInfo=(req,res)=>{
    var user=req.session.user;
    var sql="select * from orders join orderdetail using(order_no) join product using(pro_no) join thumbnail using(pro_no) where mem_id=?";
    db.query(sql,[user],(err,result)=>{        
        res.render('orderinfo',{orders:result});        
    });
}

exports.orderFinish=(req,res)=>{
    var data={
        orderReceiveName:req.body.orderReceiveName,
        orderAddress:req.body.orderAddress,
        orderPhone:req.body.orderPhone,
        orderName:req.body.orderName,
        userId:req.body.userId,
        total:parseInt(req.body.total),
        proNo:req.body.proNo,
        cnt:req.body.cnt,
        price:req.body.price,
        bsNo:req.body.bsNo
    }
    
    var sql="insert into orders(mem_id,order_total,order_date,order_status,order_name,order_receivename,order_phone,order_address)\
        values(?,?,now(),?,?,?,?,?)";
    db.query(sql,[data.userId,data.total,'배송준비',data.orderName,data.orderReceiveName,data.orderPhone,data.orderAddress],
    (err,result)=>{
        if(err)
            console.log(err);
        else{
            var innum=result.insertId;
            var sql="insert into orderdetail(order_no,pro_no,detail_cnt,detail_price) values(?,?,?,?)";
            if(data.proNo.length>1){
                for(var i=0;i<data.proNo.length;i++){
                    db.query(sql,[innum,data.proNo[i],data.cnt[i],data.price[i]],(err,result1)=>{
                        if(err)
                            console.log(err);
                    });
                }

                if(data.bsNo){
                    var sql="delete from basket where bs_no=?";
                    for(var i=0;i<data.bsNo.length;i++){
                        db.query(sql,[data.bsNo[i]],(err,result)=>{
                            if(err)
                                console.log(err);
                        })
                    }
                }

            }else{
                db.query(sql,[innum,data.proNo,data.cnt,data.price],(err,result1)=>{
                    if(err)
                        console.log(err);
                });
            }
        }
    });

    res.render('orderfinish');
}
exports.basket=(req,res)=>{
    var sql="select * from basket join member using(mem_id) join product using(pro_no) join thumbnail using(pro_no) where mem_id=?";
    db.query(sql,[req.session.user],(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.render('basket',{product:result});
        }
    });    
}

exports.addbasket=(req,res)=>{
    var proCnt=req.body.proCnt;
    var proNo=req.body.proNo;
    var id=req.session.user;
    
    var sql="select count(*) as cnt from basket where pro_no=?";
    db.query(sql,[proNo],(err,result)=>{
        if(err)
            console.log(err);
        else{
            if(result[0].cnt>0){
                res.send({"result":0});
            }else{
                var sql="insert into basket(pro_no,mem_id,bs_cnt) values(?,?,?)";
                db.query(sql,[proNo,id,proCnt],(err,result)=>{
                    res.send({"result":result.insertId});
                });
            }
        }
    });    
}

exports.numch=(req,res)=>{
    var num=req.body.num;
    var pno=req.body.pno;
    var sql="update basket set bs_cnt=? where pro_no=?";
    db.query(sql,[num,pno],(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.send({result:result.affectedRows});
        }
    });
}

exports.basketdel=(req,res)=>{
    var list=req.body.list;  
    if(Array.isArray(list)==false){
        var temp=list;
        list=new Array();
        list.push(parseInt(temp));
    }
    
    if(list.length>0){
        var sql="delete from basket where bs_no=?";
        for(var i=0;i<list.length;i++){
            db.query(sql,[list[i]],(err,result)=>{
                if(err)
                    console.log(err);                
            });
        }
        res.send({result:1});
    }else{
        res.send({result:0});
    }    
}

exports.help=function(req,res){ //고객센터
    var maxpost=10; //페이지당 상품수
    var pno=req.params.pno; //페이지넘버
    if(!pno)  var pno=1;
    var start=maxpost*pno-maxpost;
    var sql="select count(*) as postcnt from faq";
    db.query(sql,function(err,result){
            if(err) console.log(err);
            else{
                    var postcnt=result[0].postcnt;
                    var sql="select * from faq  ORDER by faq_no DESC limit ?,?;";
                    db.query(sql,[start,maxpost],function(err,result){
                            if(err) console.log(err);
                            else{
                                    var pager={
                                            pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                            startpost:maxpost*pno-maxpost, //시작상품넘버
                                            endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                    }                                   
                                    res.render('faq',{faq:result,pager:pager,pno:pno});
                                    
                            }
                    })
            }
    })
};













exports.test = (req,res)=>{
    res.render('mypage');
}