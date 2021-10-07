 var newArray=new Array();
 var chart=null;

   $(document).ready(function() {
    //通过Android方法来获取参数map,转成json对象获取参数
   	// var mapJson=android.stringToHtml();
   	// var map=JSON.parse(mapJson);
   	function ajax_data() {
   	                //这里先用死数据进行测试，网络请求可以使用下面的ajax
					var dataArr = [400,-500,300,200,400,-500,300,200,400,-500,300,200,400,-500,300,200,
					              400,-500,300,200,400,-500,300,200,400,-500,300,200,400,-500,300,200,
					              400,-500,300,200,400,-500,300,200,400,-500,300,200,400,-500,300,200,
					              400,-500,300,200,400,-500,300,200,400,-500,300,200,400,-500,300,200];
					/*$.ajax({
						type : "GET",
						url : "",//网络请求接口地址
						async : false,
						dataType : "json",
						success : function(data){
							//这里处理返回的数据，即data
						}
					});*/
					return dataArr;
				}
 chart = Highcharts.chart('container', {
	legend: {
		align: 'left',
		verticalAlign: 'top',
		x: 70,
		y: -12,
		itemDistance: 1,
		itemStyle: {color:'#666', fontWeight:'normal' }
	},
	title: {text: ''},
	credits: {enabled: false},
	xAxis: [{
		categories: [],
		crosshair: true,
		tickmarkPlacement: 'on',
		tickPosition: 'inside',
		tickInterval:1,
		labels: {
			// step:1,
//			enabled:false,
			style: {
				color: '#999'
			}
		}
	}],
	chart:{
	},
	scrollbar:{
		enabled:false
	},
	yAxis: [{
		gridLineDashStyle: 'Dash',
		gridLineColor: '#c7c7c7',
		gridLineWidth: 1,
		min:-1000,
		tickInterval:50,
		title:"",//删除y轴注释
		max:1000,
	}],
	tooltip: {
		shared: true
	},
	series: [{
		name: '数据',
		type: 'line',
		yAxis: 0,
		data: ajax_data(),
		color: Highcharts.getOptions().colors[3],
		tooltip: {
			valueSuffix: ''
		},
		lineWidth:0.5,
		marker: {
			symbol: 'circle',
			lineWidth: 0.5,
			lineColor: Highcharts.getOptions().colors[3],
			fillColor: 'white'
		}
	}]
});
});