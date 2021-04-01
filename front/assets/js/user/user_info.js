// 入口函数
$(function () {
    // 1.自定义验证规则  校验规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            let length = value.trim().length;//用户昵称长度
            if (length <= 1 || length > 6) {
                return '您的昵称长度必须在2-6位哦😯';
            }
            // layer.msg('修改成功');
        }
    })

    // 2.初始化用户信息  封装函数 ,后方使用
    // 导出layer
    let layer = layui.layer;
    initUserInfo();//调用
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                // 验证用户身份
                if (res.status != 0) { return layer.msg(res.message); }
                // 成功后,渲染
                form.val('formUserInfo', res.data);
            },
        })
    }


    // 3.重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 调用
        initUserInfo();
    })


    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                // 判断用户验证失败
                if (res.status != 0) {
                    return layer.msg('用户信息修改失败!', { icon: 5 });
                }
                layer.msg('恭喜你呀!用户信息修改成功啦', { icon: 6 });
                // 调用父级方法
                window.parent.getUserInfo();
            },
        })
    })





})

