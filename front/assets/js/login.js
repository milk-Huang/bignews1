// 入口函数
$(function () {
    // 1.点击去注册账号时, 隐藏登录区域, 显示注册区域
    $('#link_reg').on('click', () => {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 2.点击去登录账号时,显示登录区域, 隐藏注册区域
    $('#link_login').on('click', () => {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //3.自定义校验规则
    let form = layui.form;
    // verify() 是一个验证方法
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须是6到12位的哦，且不能出现空格'
        ],

        // 4.确认密码校验规则
        repwd: function (value) {
            // console.log(value);//获取确认密码输入框数据
            // 选择器必须带空格,选择的是后代中的 input , name 属性值为第一个带 password 的第一个标签
            let pwd = $('.reg-box input[name=password]').val();
            // 比较
            if (value != pwd) {
                return "两次密码输入不一致,请重新确认密码";
            };
        }

    })

    // 4.注册功能
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认事件 提交事件
        e.preventDefault();
        // 发送 ajax
        $.ajax({
            type: 'POST',
            url: '/api/register',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: (res) => {
                // console.log(res);
                // 提示用户  创建用户名失败时
                if (res.status != 0) { return layer.msg(res.message, { icon: 5, time: 4000 }) };
                // 提交成功
                layer.msg(res.message, { icon: 6 });
                // 手动切换到登录界面
                $('#link_login').click();
                // 清空注册页面表单数据   添加 [0] 是为了转为 DOM 元素进行操作
                $('#form-reg')[0].reset();
            },
        })
    })

    // 4.登录功能
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认事件 提交事件
        e.preventDefault();
        // 发送 ajax
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 提示用户  创建用户名失败时
                console.log(res.token);
                if (res.status === 501) { return layer.msg(res.message) };
                // 提交成功
                layer.msg('恭喜您,登录成功喽');
                // 保存token   未来接口要使用token
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = "/index.html";
            },
        })
    })




})

