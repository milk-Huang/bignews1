// 入口函数
$(function () {
    // 需求1:获取用户信息
    getUserInfo();//调用函数

    // 退出登录 (不用写在入口函数外面) 
    let layer = layui.layer;
    $('#btnLogOut').on('click', function () {
        // console.log(1);
        layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 关闭弹窗
            // 销毁token
            localStorage.removeItem('token');
            // 跳转路径
            location.href = '/login.html';
            // 关闭弹窗
            layer.close(index);
        });
    })
})

// 获取用户信息(封装到入口函数的外面, 当做全局变量, 便于其他页面调用)
function getUserInfo() {
    // 发送ajax
    $.ajax({
        // 配置头信息 设置token ,身份识别认证
        url: '/my/userinfo',
        //方式:不写默认为 GET
        success: (res) => {
            // console.log(res);
            if (res.status != 200) {
                return layui.layer.msg(res.message);
            }
            // 请求成功 ,渲染头像
            renderAvatar(res.data);
        },
    })
}

// 头像与文字渲染封装
function renderAvatar(user) {
    console.log(user);
    // 1.渲染用户名,如果有昵称以昵称为准
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 2.渲染头像
    if (user.user_pic == null) {
        // 隐藏图片头`,判断图片头像是否存在
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(name[0].toUpperCase());
    } else {
        // 渲染图片头像,隐藏文字头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    }
}