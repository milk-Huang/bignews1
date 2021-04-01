// 入口函数
$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 2.创建文件 上传图片
    $('#btnChooseImg').click(function () {
        $('#file').click();
    })

    // 3.更换裁剪的图片
    $('#file').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 非空校验
        if (file == undefined) return layer.msg('请选择一张图片哦');
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 4.点击确定按钮,更换头像信息
    $('#btnUpLoad').on('click', function () {
        // 4.修改头像
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: (res) => {
                console.log(res);
                // 判断 :失败
                if (res.status != 0) return layui.layer.msg(res.message);
                // 成功后,渲染页面
                layui.layer.msg('恭喜您,头像更新成功啦!💥');
                window.parent.getUserInfo();//调用函数
            },
        })
    })

})