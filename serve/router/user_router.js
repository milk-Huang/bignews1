const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

// 获取用户的基本信息
router.get('/userinfo', (req, res) => {
    // console.log('获取信息:', req.query);
    const { username } = req.query//postman在 pramas 中添加数据进行测试
    console.log(username);
    // console.log(req.query.username);
    // 查询用户在数据库中是否存在
    const selectStr = `select * from users where username="${req.query.username}" `
    conn.query(selectStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        // 成功
        res.json({
            status: 0, msg: "获取用户基本信息成功",
            data: result[0]//拿到的用户名
        })

    })
})


// 文件上传专用
const multer = require('multer')
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName)
    }
})
// 导出存放文件的地方
const uploads = multer({ storage })

// 上传用户头像
router.post('/uploadPic', uploads.single('file_data'), (req, res) => {
    // 如果文件上传成功
    console.log('本次上传的文件是', req.file)
    // 后面再做：错误处理
    res.json({
        "code": 200,
        "msg": "上传成功",
        "src": "http://127.0.0.1:3030/uploads/" + req.file.filename
    })
})


// 更新用户
router.post('/userinfo', (req, res) => {
    // 解构
    const { id, nickname, email, userPic, password } = req.body
    // 更新sql
    const modifyStr = `update users set nickname="${nickname}",email="${email}",userPic="${userPic}" where id="${id}"`
    // console.log(modifyStr);
    conn.query(modifyStr, (err, result) => {
        // 修改错误
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        // 成功修改
        res.json({ status: 200, msg: '用户信息修改成功' })
    })
})

// 重置用户密码
router.post('/updatepwd', (req, res) => {
    // 解构
    const { oldPwd, newPwd, id } = req.body;
    // return console.log(oldPwd, newPwd, id);
    // 查询sql
    const selStr = `select password from users where id=${id}`
    conn.query(selStr, (err, result) => {
        // 修改错误
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        // result[0].password  就是原密码
        if (result[0].password !== oldPwd) return res.json({ status: 401, msg: "旧密码错误" })

        // 修改密码sql
        const modifyStr = `update users set password="${newPwd}" where id="${id}"`
        // console.log(modifyStr);
        conn.query(modifyStr, (err, result) => {
            // 修改错误
            if (err) return res.json({ status: 501, msg: '服务器错误' })
            // 成功修改
            res.json({ status: 200, msg: '用户密码修改成功' })
        })

    })
})




module.exports = router