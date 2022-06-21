$(function () {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    //初始化用户基本信息
    function initUserInfo() {
        $.get('/my/userinfo', function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户基本信息失败!')
            }
            //调用form.val()函数快速给表单赋值
            form.val('formUserInfo', res.data)
        })
    }
    initUserInfo()
    //重置表单数据
    $('#btnReset').on('click', (e) => {
        e.preventDefault()
        initUserInfo()
    })
    //监听表单的提交事件
    $('.layui-form').submit((e) => {
        e.preventDefault()
        $.post('/my/userinfo', $('.layui-form').serialize(), (res) => {
            if (res.status !== 0) {
                return layer.msg('用户信息修改失败!')
            }
            layer.msg('用户信息修改成功!')
            //调用父页面的方法重新渲染用户头像和用户信息
            window.parent.getUserinfo()
        })
    })
})