var db=require('../../db.js');

exports.loginget=function(req,res){ //로그인페이지
        res.render('sign');
};
exports.loginpost=function(req,res){ //로그인
        var user={
                id:req.body.id,
                pw:req.body.pw
        }
        var sql='select count(*) as ok,mem_id,mem_name, mem_valid from member where mem_id=? and mem_pw=?';
                db.query(sql,[user.id,user.pw],function(err,result){
                if(err) console.log(err);
                else{
                        var ok=result[0].ok;
                        if(ok==1 && result[0].mem_valid ==1){
                                req.session.displayname=result[0].mem_name;
                                req.session.user=user.id;
                            if(result[0].mem_id=='root'){
                                req.session.save(function(){
                                        res.redirect('/manager/member')
                                });
                                
                            }else{                                    
                                                                
                                req.session.save(function(){
                                        res.redirect('/');
                                });
                            }
                                
                        }else{
                                res.send('<script>alert("아이디나 비밀번호가 일치하지 않습니다");location.href="/login"</script>');
                        }
                }
                })
};
exports.logout=function(req,res){ //로그아웃
        req.session.destroy((err)=>{
                req.session;
        });
        res.redirect('/');
};