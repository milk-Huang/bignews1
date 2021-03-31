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
    // 查询用户在数据库中是否存在
    const selectStr = `select * from users where username="${username}" `
    conn.query(selectStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        // 成功
        res.json({
            status: 0, msg: "获取用户基本信息成功",
            data: result[0]//拿到的用户名
        })

    })
})





module.exports = router