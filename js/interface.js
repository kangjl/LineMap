var defaultCellSize=40;
var defaultLineWidth = 8;
var defaultTextSize = 14;
var top = -536; 
var left = -120;
var selectLine= "all";
var lineType="";
var wayLine="allway";
var routdatas="";
/*
方法作用：放大、缩小路网图
@param:scale:放大、缩小倍数
			 selectLine1:所选线路（all表示全部）
			 wayLine1:线路方向（allway：全部；upway：上行；downway：下行）
@author:xiaomy
*/  
function scale_routemap(scale,selectLine1,wayLine1){
	selectLine=selectLine1;
	wayLine=wayLine1;
	 if(wayLine1=="allway")
    lineType="double";
   else
    lineType="single";  
	if(scale>2||scale<0.4)
	return "error";  
	   	$("#map canvas").css("top", top +"px");
	    $("#map canvas").css("left", left +"px");
		   var cellSize = defaultCellSize;//$(".subway-map").attr("data-cellSize");  
		   cellSize = Math.floor(cellSize*scale);
		   var lineWidth = defaultLineWidth;
		   lineWidth = Math.floor(lineWidth*scale);
		   var textSize = defaultTextSize;
		   textSize = Math.floor(textSize*scale);		   
		   $(".subway-map").attr("data-cellSize", cellSize);
		   $(".subway-map").attr("data-lineWidth", lineWidth<=4?4:lineWidth);
		   $(".subway-map").attr("data-textSize", textSize);
		   $("#map canvas").remove();
		   $("#map span").remove();
		   $(".subway-map").subwayMap({ debug: true, line:selectLine1,lineType:lineType});
		   if(cellSize<=40)
		   {
		   $("#map canvas").css("top", top+(40-cellSize)*lineWidth*4+"px");
		   $("#map canvas").css("left", left+(40-cellSize)*lineWidth*3.8+"px");
		   }
		   else
		   {
		   $("#map canvas").css("top", top+(40-cellSize)*lineWidth*1.5+"px");
		   $("#map canvas").css("left", left+(40-cellSize)*lineWidth*1.5+"px");
		   }
}
/*
方法作用：鼠标移动路网图
@param:x:鼠标移动后的x轴位置
			 y:鼠标移动后的y轴位置
@author:xiaomy
*/
function move_routemap(x,y){
				$("#map canvas").css("top", top+x +"px");
				$("#map canvas").css("left", left+y +"px");
}

/*
方法作用：显示路网图
@param:scale:放大、缩小倍数
			wayLine1:线路方向（allway：全部；upway：上行；downway：下行）
			selectLine1:所选线路（all表示全部）
			stationinfo：各站点基本信息（json数组）
@author:xiaomy
*/ 
function show_routemap(scale,selectLine1,wayLine1,stationinfo){
	selectLine=selectLine1;
	wayLine=wayLine1;
	 if(wayLine1=="allway")
    lineType="double";
   else
    lineType="single";  
	if(scale>2||scale<0.4)
	return "error";  
	   	$("#map canvas").css("top", top +"px");
	    $("#map canvas").css("left", left +"px");
		   var cellSize = defaultCellSize;//$(".subway-map").attr("data-cellSize");  
		   cellSize = Math.floor(cellSize*scale);
		   var lineWidth = defaultLineWidth;
		   lineWidth = Math.floor(lineWidth*scale);
		   var textSize = defaultTextSize;
		   textSize = Math.floor(textSize*scale);		   
		   $(".subway-map").attr("data-cellSize", cellSize);
		   $(".subway-map").attr("data-lineWidth", lineWidth<=4?4:lineWidth);
		   $(".subway-map").attr("data-textSize", textSize);
		   $("#map canvas").remove();
		   $("#map span").remove();
		   $(".subway-map").subwayMap({ debug: true, line:selectLine1, wayLine:wayLine1,lineType:lineType});
		   if(cellSize<=40)
		   {
		   $("#map canvas").css("top", top+(40-cellSize)*lineWidth*4+"px");
		   $("#map canvas").css("left", left+(40-cellSize)*lineWidth*3.8+"px");
		   }
		   else
		   {
		   $("#map canvas").css("top", top+(40-cellSize)*lineWidth*1.5+"px");
		   $("#map canvas").css("left", left+(40-cellSize)*lineWidth*1.5+"px");
		   }
}
/*
方法作用：点选路网图
@param:scale:放大、缩小倍数
			 stationinfo：各站点基本信息（json数组）
			 例：{startnodeid:"23",endnodeid:"28",linecolor:"#cd0000",linewidth:3,travalinfo:"{出发时间:19:00,到站时间: "19:10"}"},{}…
@author:xiaomy
*/
function click_routemap (scale,stationinfo){
if(scale>2||scale<0.4)
return "error";  
wayLine="upway";
routdatas=stationinfo;
routdatas=eval('(' + routdatas + ')');
	   	$("#map canvas").css("top", top +"px");
	    $("#map canvas").css("left", left +"px");
		   var cellSize = defaultCellSize;  
		   cellSize = Math.floor(cellSize*scale);
		   var lineWidth = defaultLineWidth;
		   lineWidth = Math.floor(lineWidth*scale);
		   var textSize = defaultTextSize;
		   textSize = Math.floor(textSize*scale);		   
		   $(".subway-map").attr("data-cellSize", cellSize);
		   $(".subway-map").attr("data-lineWidth", lineWidth<=4?4:lineWidth);
		   $(".subway-map").attr("data-textSize", textSize);
		   $("#map canvas").remove();
		   $("#map span").remove();
		   $(".subway-map").subwayMap({ debug: true, line:"",lineType:"single"});
		   if(cellSize<=40)
		   {
		   $("#map canvas").css("top", top+(40-cellSize)*lineWidth*4+"px");
		   $("#map canvas").css("left", left+(40-cellSize)*lineWidth*3.8+"px");
		   }
		   else
		   {
		   $("#map canvas").css("top", top+(40-cellSize)*lineWidth*1.5+"px");
		   $("#map canvas").css("left", left+(40-cellSize)*lineWidth*1.5+"px");
		   }
  return routdatas;
}

function getCanvasTop(){
			 	var top = $("#map canvas").css("top");
				top = top.replace("px", "");
				top = parseInt(top,10);
				return top;
		 }
		 
function getCanvasLeft(){
				var left = $("#map canvas").css("left");
				left = left.replace("px", "");
				left = parseInt(left,10);
				return left;
		 }