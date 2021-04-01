$(function () {
    // 1.渲染文章分类列表 ,(后面删除等操作还有调用,封装函数)
    let layer = layui.layer;
    initArtCataList();
    // 函数封装
    function initArtCataList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                // 错误提示
                if (res.status === 501) return layer.msg(res.msssage);
                // 成功,渲染页面
                const str = template('t1', res);
                $('tbody').html(str);

            },
        })
    }

    // 2.显示添加文章类别 html结构
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '添加文章类别',
            content: $('#dialog-add').html(),
        });

    })


    // 3.事件代理完成, 添加文章分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 错误提示
                if (res.status === 501) { return layer.msg(res.message); }
                // 成功后
                // 调用 渲染页面
                initArtCataList();
                layer.msg('恭喜您,文章类别添加成功');
                // 清空表单数据
                $('#form-add')[0].reset();
                // 关闭弹出层
                layer.close(indexAdd);
            },
        })
    })

    // 4.修改  展示表单
    let indexEdit = null;
    let form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        // 4.1利用框架代码,展示
        indexEdit = indexAdd = layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html(),
        });
        // 4.2获取id 发送 ajax 获取数据 渲染页面
        let Id = $(this).attr('data-id');
        // alert(Id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                // console.log(res);
                form.val('form-edit', res.data);
            },
        })

    })

    // 5.事件代理完成,修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 错误提示
                if (res.status != 0) { return layer.msg(res.message); }
                // 成功后
                // 调用 渲染页面
                initArtCataList();
                layer.msg('恭喜您,文章类别修改成功', { icon: 6 });
                // 清空表单数据
                $('#form-edit')[0].reset();
                // 关闭弹出层
                layer.close(indexAdd);
            },
        })
    })

    // 6.删除
    $('body').on('click', '.btn-delete', function () {
        // 4.2获取id 发送 ajax 获取数据 渲染页面
        let Id = $(this).attr('data-id');
        // 4.1显示对话框
        layer.confirm('确定要删除嘛?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) return layer.msg(res.message);
                    layer.msg('恭喜您,文章类别删除成功啦');
                    initArtCataList();
                    // 关闭对话框
                    layer.close(index);

                },
            })
        });
    })


})