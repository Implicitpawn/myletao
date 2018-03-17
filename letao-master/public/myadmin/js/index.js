$(function(){
    checkUser();
    var option_bar = $('.option_bar')[0];
    var firstChars = echarts.init(option_bar)
    var option_bar = {
        title : {
            text: '年度品牌销售排行表',
            subtext: '假的别信',
            x:'center'
        },
        xAxis: {
            type: 'category',
            data: ['李宁', '耐克', '匡威', '阿迪', '百伦', '踏步', '其他']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [1200, 2000, 1500, 800, 700, 1100, 3330],
            type: 'bar'
        }]
    };
    firstChars.setOption(option_bar);
    var option_pie = $('.option_pie')[0];
    var secondChats = echarts.init(option_pie);
    var option_pie = {
        title : {
            text: '商城各地注册信息表',
            subtext: '又是假的',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['湖北','湖南','北京','上海','广州']
        },
        series : [
            {
                // name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:3352, name:'广州'},
                    {value:3102, name:'上海'},
                    {value:2343, name:'北京'},
                    {value:1352, name:'湖南'},
                    {value:1548, name:'湖北'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
   secondChats.setOption(option_pie);
})