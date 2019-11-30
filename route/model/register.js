var db=require('../../db.js');

exports.idcheck=function(req,res){ //아이디중복확인
    var id=req.body.id;
    var sql='select count(*) as result from member where mem_id=?';
    db.query(sql,id,function(err,result){
            if(err) console.log(err);
            else{
                    res.send({"result":result[0].result})
            }
    })
};

exports.regipost=function(req,res){ //회원가입
    var user={
            id:req.body.id,
            pw:req.body.pw,
            email:req.body.email,
            name:req.body.name,            
            tel:req.body.tel
    }
    var sql='insert into member values(?,?,?,?,?,1)';
    db.query(sql,[user.id,user.pw,user.email,user.name,user.tel],function(err,result){
            if(err) console.log(err);
            else{
                    var ok=result.affectedRows;
                    console.log(ok);
                    console.log(result);
                    if(ok==1){
                            res.send('<script>alert("회원가입에 성공하셧습니다.");location.href="/login"</script>');
                    }else{
                            res.send('<script>alert("회원가입을 실패하셨습니다.");history.back();</script>',{result:ok});
                    }
            }
    })
};