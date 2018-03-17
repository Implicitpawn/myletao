window.getSearchName = function(){
    var searchName_key = window.localStorage.getItem('searchName') || '[]';
    var arr = JSON.parse(searchName_key);
    return arr;
}
window.setLocalStorage = function(data){
    if(!data) {
        console.log(9856)
        $('.it_search>form>input').val('请输入关键词')
        return;
    }
    var searchName_arr = getSearchName();
    for(var i = 0; i < searchName_arr.length; i++) {
        if(searchName_arr[i]==data) {
            searchName_arr.splice(i,1);
            break;
        }
    }
    if(searchName_arr.length>9) {
        searchName_arr.pop();
    }
    searchName_arr.unshift(data) 
    window.localStorage.setItem('searchName',JSON.stringify(searchName_arr));
}
window.location_search = function(){
    var str_location = location.search;
    var location_search = {};
    if(str_location.indexOf('?') == 0){
        var arr_location = location.search.substr(1).split('&')[0].split('=');
        location_search[arr_location[0]] = decodeURI(arr_location[1]);
    }
    return location_search;
}
window.addCart = function(options){
    if(!options.url) return false;
    $.ajax({      
        url:options.url,
        type:options.type || 'get',
        data:options.data || '',
        dataType:options.dataType || 'json',
        beforeSend:function(){
            window.isS = true;
        },
        success:function(date){
            if(date && date.error == 400){
                location.href = '/123/user/login.html?returnUrl='+location.pathname+location.search;
                return false;
            }
        console.log(date)
        
        options.success && options.success(date)
            
        },
        error:function(){
            mui.toast('服务器繁忙');
            options.error && options.error()
        }
    })
}