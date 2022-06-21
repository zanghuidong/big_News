$(function () {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            let oldPwd = $('.layui-form [name=oldPwd]').val()
            if (value === oldPwd) {
                return '新密码不能与旧密码相同'
            }
        },
        rePwd: function (value) {
            let newPwd = $('.layui-form [name=newPwd]').val()
            if (value !== newPwd) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败!')
                }
                layer.msg('修改密码成功!')
                //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})