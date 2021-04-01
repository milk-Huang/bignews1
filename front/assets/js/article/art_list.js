$(function () {

    template.defaults.imports.dateFormat = function (dateStr) {
        let dt = new Date(dateStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    function padZero(num) {
        return num < 10 ? "0" + num : num
    }


    // 封装函数
    let q = {
        pagenum: 1,  //是    int 页码值
        pagesize: 2,    //是 int 每页显示多少条数据
        cate_id: '', //否    string  文章分类的 Id
        state: '',  //否 string  文章的状态，可选值有：已发布、草稿
    }
    initTable()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 渲染到页面
                renderPage(res.total);

            }
        })
    }

    // 初始化分类
    let form = layui.form;
    initCata();//调用函数
    // 封装函数
    function initCata() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                // 成功后  赋值  渲染页面
                let htmlStr = template('tpl-cata', res);
                $('[name=cate_id]').html(htmlStr);
                // 渲染进 layui 中的 select  
                form.render();
            },
        })
    }


    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        console.log(cate_id, state);
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })



    // 5.分页
    let laypage = layui.laypage;//导出 laypage
    function renderPage(total) {
        // alert(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示的条数
            curr: q.pagenum,//起始页
            // limits: 2, //每页条数的选择项
            layout: ['count', 'limit', 'prev', 'page', 'next'],
            limits: [2, 3, 5, 6],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    // 页码值赋给  q.pagenum  ,以显示
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    initTable();
                    // limit = q.pagesize;
                }
            }
        });
    }


    //删除 
    let layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        // console.log(1);
        // 获取id
        let Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                data: {},
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) return layer.msg(res.message);
                    // 成功 提示
                    layer.msg('恭喜您,文章删除成功啦🌶');
                    // 页面总删除按钮等于1或页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    // 渲染页面
                    initTable();
                    // 关闭弹窗
                    layer.close(index);
                },
            })

        });
    })
})