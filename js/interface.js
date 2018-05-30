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
�������ã��Ŵ���С·��ͼ
@param:scale:�Ŵ���С����
			 selectLine1:��ѡ��·��all��ʾȫ����
			 wayLine1:��·����allway��ȫ����upway�����У�downway�����У�
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
�������ã�����ƶ�·��ͼ
@param:x:����ƶ����x��λ��
			 y:����ƶ����y��λ��
@author:xiaomy
*/
function move_routemap(x,y){
				$("#map canvas").css("top", top+x +"px");
				$("#map canvas").css("left", left+y +"px");
}

/*
�������ã���ʾ·��ͼ
@param:scale:�Ŵ���С����
			wayLine1:��·����allway��ȫ����upway�����У�downway�����У�
			selectLine1:��ѡ��·��all��ʾȫ����
			stationinfo����վ�������Ϣ��json���飩
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
�������ã���ѡ·��ͼ
@param:scale:�Ŵ���С����
			 stationinfo����վ�������Ϣ��json���飩
			 ����{startnodeid:"23",endnodeid:"28",linecolor:"#cd0000",linewidth:3,travalinfo:"{����ʱ��:19:00,��վʱ��: "19:10"}"},{}��
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