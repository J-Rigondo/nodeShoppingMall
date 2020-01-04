const router = require('express').Router();
const manager = require('../model/manager');
var multer=require('multer');

var upload=multer({storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/images/dbimg');
        },
        filename: function (req, file, cb) {
          cb(null, Date.now()+"-"+file.originalname);
        }
}),});

router.get('/member', manager.member); 
router.post('/member/del', manager.memberdel);



router.get("/faq",manager.faq);  //faq페이지
router.get('/faqupload',manager.faqupload); //faq등록페이지
router.post('/faqupload',manager.faquploadpost); //faq등록
router.get(["/faqmodify","/faqmodify=:num"],manager.faqmodi); //faq수정페이지
router.post('/faqmodify',manager.faqmodify); //faq수정
router.post('/faqdelete',manager.faqdel); //faq삭제

router.get('/product',manager.product);
router.get('/order',manager.order); 
router.post('/order/rev',manager.orderrev);
router.post('/order/del',manager.orderdel);

router.get('/product/upload',manager.proupload)
router.get('/prorevise',manager.prorevise)

router.post("/simgdb",upload.single('simg'),manager.simgupload);
router.post('/productupload',upload.single('content'),manager.bimgupload);
router.post('/productrev',upload.single('content'),manager.bimgrev);

router.post('/getnum',manager.getnum); // Auto_increment Get

router.get('/prodel',manager.prodel)
router.post('/simgrev',manager.simgrevise)


module.exports=router;