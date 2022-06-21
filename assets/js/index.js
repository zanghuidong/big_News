$(function () {
    //调用getUserinfo()函数获取用户基本信息
    getUserinfo()
    let layer = layui.layer
    $('#btnLogout').on('click', () => {
        //提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储里面的token
            localStorage.removeItem('token')
            //重新跳转到登录页
            location.href = '/login.html'
            //关闭confirm询问框
            layer.close(index)
        });
    })
})

//获取用户的基本信息
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers就是请求头配置对象
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败!')
            }
            //调用渲染用户头像函数
            renderAvatar(res.data)
        }
    })
}


//渲染用户头像函数
function renderAvatar(user) {
    //获取用户名称
    let name = user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}