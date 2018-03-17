
mui('.it_warpper').scroll({
    indicators:false
});
$(function(){
    search()
    $('.it_search>form>a').click(function(){
        console.log(987)
        var data = $('.it_search>form>input').val();
        setLocalStorage(data);
        $('.it_search>form>input').val('')
        location.href="/123/searchList.html?key="+data;
        // search()
    })
    $('.search_history').on('tap','li span',function(){
        that = $(this);
        var data = $(that).siblings('a').html();
        var searchName_arr = getSearchName();
        for(var i = 0; i < searchName_arr.length; i++) {
            if(searchName_arr[i]==data) {
                searchName_arr.splice(i,1);
                break;
            }
        }
        $(that).parent().remove();
        window.localStorage.setItem('searchName',JSON.stringify(searchName_arr));
    })
    $('.search_history').on('tap','li a',function(){
        var data = $(this).html();
        location.href="/123/searchList.html?key="+data;
    })
    $('.search_right').click(function(){
        $('.search_history').remove();
        window.localStorage.removeItem('searchName');
        search()
    })
})
function search() {
    var data = $('.it_search>form>input').val();
    var searchName_arr = getSearchName();
    console.log(typeof searchName_arr[0])
    if(searchName_arr[0] == '' || !searchName_arr[0]) {
        console.log(1)
        $('.search_left').html('没有搜索记录');
        $('.search_right').css('display','none');
        return;
    }else if(searchName_arr[0] != ''){
        console.log(2)
        $('.search_left').html('历史记录');
        $('.search_right').css('display','block');
    }
    var product_arr = window.localStorage.getItem('searchName');
    var search_arr = {};
    search_arr.search = JSON.parse(product_arr);
    var html = template('search_read',search_arr);
    $('.search_history').html(html);
}