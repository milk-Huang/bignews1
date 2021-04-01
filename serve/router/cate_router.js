const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

// 获取文章分类列表
router.get('/cates', (req, res) => {
    // console.log('获取到的数据', req, res);
    const selectStr = `select * from categories`
    conn.query(selectStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        res.json({ status: 200, msg: '获取成功', data: result })
    })
})

// 新增文章分类
router.post('/addcates', (req, res) => {
    const { name, slug } = req.body
    const insertStr = `insert into categories(name,slug) values("${name}","${slug}")`
    console.log(insertStr);
    conn.query(insertStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        res.json({ status: 200, msg: '添加成功' })
    })
})

// 根据 Id 删除文章分类
router.get('/deletecate', (req, res) => {
    const { id } = req.body
    // 查询文章 id
    const deleteStr = `delete from categories where id=${id}`
    // console.log(deleteStr);
    conn.query(deleteStr, (err, result) => {
        if (err) return res.json({ status: 501, msg: '服务器错误' })
        res.json({ status: 200, msg: '分类删除成功' })
    })
})

// 根据 Id 获取文章分类数据
router.get('/getCatesById', (req, res) => {
    const { id } = req.query
    const selectStr = `select * from categories where id=${id}`
    console.log(selectStr);
    conn.query(selectStr, (err, result) => {
        if (err) return res.json({ status: 500, msg: '服务器失败' })
        res.json({ status: 200, msg: '获取成功', data: result })
    })
})

// 根据 Id 更新文章分类数据
router.post('/updatecate', (req, res) => {
    const { id, name, slug } = req.body
    const modifyStr = `update categories set name="${name}",slug="${slug}"  where id=${id}`
    console.log(modifyStr);
    conn.query(modifyStr, (err, result) => {
        if (err) return res.json({ status: 500, msg: '服务器错误' })
        res.json({ status: 200, msg: '更新成功' })
    })
})

module.exports = router