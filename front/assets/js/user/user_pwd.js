// 入口函数
$(function () {
    let form = layui.form;
    // 1.验证密码规则
    form.verify({
        // 密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 新密码
        newPwd: function (value) {
            // 新密码不能和原密码保持一致
            if (value == $('[name=oldPwd]').val()) return "新密码不能与原密码相同哦";
        },
        // 确认新密码
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) return "确认新密码要与新密码相同哦";
        },
    });

    // 2.修改密码
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) { return layui.layer.msg(res.message); };
                // 成功后 清空数据
                layui.layer.msg('恭喜您,成功修改密码!');
                $('.layui-form')[0].reset();//转为 dom 对象
                // 重定向
                window.parent.location.href = '/login.html';//replace解决重定向套娃事件
                // 重定向障碍
                // location.href = '/login.html';
            },
        })
    })






});







