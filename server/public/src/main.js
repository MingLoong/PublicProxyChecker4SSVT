var $ = mdui.$;
var inst = new mdui.Drawer('#drawer');
function menu() {
    if(inst.state == 'closed') inst.open();
    else inst.close();
}
$.ajax({
    method: 'GET',
    url: 'user/getCount',
    success: function (data){
        try{
            data = JSON.parse(data);
            $('sacount').text(data.s5.a);
            $('sfcount').text(data.s5.f);
            $('ssacount').text(data.ss.a);
            $('ssfcount').text(data.ss.f);
            $('vtacount').text(data.vt.a);
            $('vtfcount').text(data.vt.f);
        }
        catch(e){
            mdui.snackbar({
                message: '回调错误，检查服务器设置',
                position: 'right-top',
            });
        }
    },
    error: function (){
        mdui.snackbar({
            message: '请求异常，检查服务器设置',
            position: 'right-top',
        });
    }
});
function reLoad(){
    $.ajax({
        method: 'GET',
        url: 'user/getCount',
        success: function (data){
            try{
                data = JSON.parse(data);
                $('sacount').text(data.s5.a);
                $('sfcount').text(data.s5.f);
                $('ssacount').text(data.ss.a);
                $('ssfcount').text(data.ss.f);
                $('vtacount').text(data.vt.a);
                $('vtfcount').text(data.vt.f);
                mdui.snackbar({
                    message: '刷新成功',
                    position: 'right-top',
                });
            }
            catch(e){
                mdui.snackbar({
                    message: '回调错误，检查服务器设置',
                    position: 'right-top',
                });
            }
        },
        error: function (){
            mdui.snackbar({
                message: '请求异常，检查服务器设置',
                position: 'right-top',
            });
        }
    });
}