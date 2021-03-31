const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

// 注册
router.post('/register', (req, res) => {
    // 1. 获取用户名和密码 用户输入数据
    console.log('获取到的数据:', req.body);
    // 解构
    const { username, password } = req.body
    // 2. 根据注册业务的要求，先去看一下名字有没有占用！
    // 根据用户名去做一次查询 如果找到了结果，说明名字被占用了，如果查询结果为空，说明
    // 名字可以使用
    // 2.1查询是否有数据库数据冲突数据
    const selectStr = `select username from users where username = "${username}" `
    conn.query(selectStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' });
        // 若没有错误,则判断用户输入的用户名是否与数据库中的用户名一致
        // console.log('我是啥东西', result);// []  空数组
        if (result.length > 0) return res.json({ status: 502, msg: '用户名已经被注册了哦😯' });
        // 若数据库没有与之匹配的数据项,则插入该sql语句并执行
        // 2.2若没有冲突数据,则将数据插入数据库
        const insertStr = `insert into users(username,password) values("${username}","${password}")`
        conn.query(insertStr, (err, result) => {
            // console.log('我是啥东西2', res);// 
            if (err) return res.json({ status: 500, msg: '服务器错误' });
            // 成功
            res.json({ status: 200, msg: '注册成功' })
        })
    })
})

// 登录
router.post('/login', (req, res) => {
    // 获取用户输入的数据
    // console.log('获取到的数据:', req.body);
    // 解构
    const { username, password } = req.body
    // 查询数据库
    const selectStr = `select * from users where username = "${username}" and password="${password}"`
    conn.query(selectStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        console.log('王莎莎:', result);
        // 查询是否与数据库中的字段数据匹配
        if (result.length > 0) {
            // 查找到了，说明登陆成功
            // 返回token
            const token = jwt.sign(
                { name: username },
                'gz61',  // 加密的密码，要与express-jwt中的验证密码一致
                { expiresIn: 2 * 60 * 60 } // 过期时间，单位是秒
            )
            // 字符串前加上该字符  行业规范
            token += bearer
            res.json({ msg: "登陆成功", status: 200, token })
        } else {
            res.json({ msg: "登陆失败，用户名密码不对", status: 401 })
        }
    })
})



module.exports = router