// JavaScript Document
var selectLine= "all";
var lineType="single";
var wayLine="upway";
var canvastop = -890; 
var canvasleft = -580;
var routdatas="";
var zoomFactor = 1.0;
var drawImage=true;//是否显示景点图
var drawStationName=true;//是否显示路线名称
var t=30;
var l=30;
var new_canvas=null;
  $(function(){ 
	   var defaultCellSize = 40;
	   var defaultLineWidth = 8;
	   var defaultTextSize = 14;
	   var mapMouseDown = false;
	   var mapMouseDownX = 0;
	   var mapMouseDownY = 0;
	   
	   var stationCoordinate = [];
	   var timer = null;
	   var lastX = 0;
	   var lastY = 0;
	   //var lineType = "double";//single,double
	   //for station anim
	   var stationAnimInterval = null;
	   var stationAnimCanvas = null;
	   var stationAnimCtx = null;
	   var curStation = null;
       var lineWidth = 1;
       var lineAlpha = 1.0;
	   var stationRadius = 8;
	   
	   initSlider(function(value){
		   zoomMap(value);
		   zoomFactor = value;
		  });
		 initLineSelecter();//初始化线路选择框
		  
	   function initLineSelecter(){
		  var lines = subwayData.line;
		  var ids = "";
		  var idflag = 0;
		  $(lines).each(function (index) {	
				var line = subwayData.line[index];	
				var id = line.id;
				
				var idarr = ids.split(",");
				for(var i=0;i<idarr.length;i++){
					if(idarr[i]==id){	
						idflag = 1;
					}	
				}
				if(idflag==0){
					ids = ids + id + ",";
					var name = line.name;
					var color = line.color;
					var lineSelectSpan =  $("<div id='"+id +"'" +"class='lineSelect'>"+
											  "<span class='lineColor' style=background-color:"+color+";></span>"+
											  "<span class='lineName'>" + name + "</span></div>");
					$("#selectLine").append(lineSelectSpan);
				}else{
					idflag = 0;
				}
	         
		     
			});
			
			var scale = $(".subway-map").attr("data-cellSize");
			getStationCoordinate(selectLine, scale);
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
		 
//		 alert($.browser.version);
			
//          if($.browser.msie){
            $(".subway-map").bind("mousewheel",function(e){
              var e=e||event,v=e.wheelDelta||e.detail;
			  if (v>0){
			    if (zoomFactor <= 1.6)
				  zoomFactor += 0.1
			  } else {
				if (zoomFactor >= 0.6)
				  zoomFactor -= 0.1	
			  }
			  zoomMap(zoomFactor);	
			  moveSlider(zoomFactor); 
				  
              window.event.returnValue = false;
             //e.stopPropagation();
             return false;
             })
//         }else{
           $(".subway-map").bind("DOMMouseScroll",function(event){
             if(event.detail<0){
				if (zoomFactor <= 1.7)
				  zoomFactor += 0.1
			 } else {
				if (zoomFactor >= 0.6)
				  zoomFactor -= 0.1	
			 }
			 zoomMap(zoomFactor);	
			 moveSlider(zoomFactor); 
				 	 	 
             event.preventDefault()
             //event.stopPropagation();
           })
//       }
	   
	    $("#map").mousedown(function(e){
			mapMouseDown = true;
			mapMouseDownX = e.pageX;
			mapMouseDownY = e.pageY;
		})
		$("#map").mousemove(function(e){
			if (mapMouseDown){
		
				var offsetX = e.pageX - mapMouseDownX;
				var offsetY = e.pageY - mapMouseDownY;
				var top = getCanvasTop();
				var left = getCanvasLeft();
				$("#map canvas").css("top", top+offsetY +"px");
				$("#map canvas").css("left", left+offsetX +"px");
				mapMouseDownX = e.pageX;
				mapMouseDownY = e.pageY;
			  canvastop=canvastop+offsetY;
			  canvasleft=canvasleft+offsetX;
			}
		})
		
		$("#map").mouseup(function(e){
			mapMouseDown = false;
		})
		   	  
	   $(".mapZoomIn").click(function(){
		   if (zoomFactor <= 1.7)
				zoomFactor += 0.1
		   //moveSlider(zoomFactor);
           zoomMap(zoomFactor);

       }); 
       $(".mapZoomOut").click(function(){ 
       	if (zoomFactor >= 0.6) 
       	zoomFactor -= 0.1	
       	//var pos = moveSlider(zoomFactor); 
       	zoomMap(zoomFactor); 
       	});

	   function moveSlider(factor){	
       slider = document.getElementById("slider"); 
       dist = parseInt(slider.getAttribute('distance')); 
       display = document.getElementById("display"); 
       display.value = factor.toFixed(1);//Math.round(factor*10)/10; //alert(display.value); 
       pos = dist-(factor-0.5)*dist/1.5; if(pos>98) pos=98.6; 
       if (pos>2 && pos<dist*0.99) 
       carpeTop("slider", pos); 
       }

	   function zoomMap(factor){
	   	var cellSize = defaultCellSize;//$(".subway-map").attr("data-cellSize");  
	   	cellSize = Math.floor(cellSize*factor); 
	   	var lineWidth = defaultLineWidth; 
	   	lineWidth = Math.floor(lineWidth*factor); 
	   	var textSize = defaultTextSize; 
	   	textSize = Math.floor(textSize*factor); 
	   	var top = getCanvasTop(); 
	   	var left = getCanvasLeft(); 
	   	$(".subway-map").attr("data-cellSize", cellSize); 
	   	$(".subway-map").attr("data-lineWidth", lineWidth<=4?4:lineWidth); 
	   	$(".subway-map").attr("data-textSize", textSize); 
	   	$("#map canvas").remove(); 
	   	$("#map span").remove(); 
	   	$(".subway-map").subwayMap({ debug: true, line:selectLine, lineStyle:lineType}); //alert(cellSize);
	   	$("#map canvas").css("top", (defaultCellSize*(1-factor)*30+canvastop) +"px"); 
	   	$("#map canvas").css("left",(defaultCellSize*(1-factor)*30+canvasleft) +"px");
		   getStationCoordinate(selectLine, cellSize);
		   stationAnimCanvas = null;
	   }
	   $(".mapZoomIn").hover(function(){
 
       $(".mapZoomIn").css({"backgroundPosition":"0px -243px"}); }, function(){ 
       $(".mapZoomIn").css({"backgroundPosition":"0px -221px"});
});

       $(".mapZoomOut").hover(function(){
           $(".mapZoomOut").css({"backgroundPosition":"0px -287px"});
           },
	       function(){
           $(".mapZoomOut").css({"backgroundPosition":"0px -265px"});
       });
	   
	   $(".carpe_slider").hover(function(){
           $(".carpe_slider").css({"backgroundPosition":"0px -320px"});
           },
	       function(){
           $(".carpe_slider").css({"backgroundPosition":"0px -309px"});
       });
	   
	    $(".mapZoomIn").hover(function(){
           $(".mapZoomIn").css({"backgroundPosition":"0px -243px"});
           },
		   function(){
           $(".mapZoomIn").css({"backgroundPosition":"0px -221px"});
       });
	   $(".lineSelect").hover(function(){
           $(this).css({"background-color":"#afeafa"});
           },
		   function(){
           $(this).css({"background-color":"transparent"});
        });
/**		$(".waySelect").hover(function(){
           $(this).css({"background-color":"#f4f4f4"});
           },
		   function(){
           $(this).css({"background-color":"transparent"});
        });*/
		$(".lineSelect").click(function(){
			$(this).css({"background-color":"#afeafa"}); 
           selectLine = $(this).attr("id");
		   var cellSize = $(".subway-map").attr("data-cellSize");
		   var lineWidth = defaultLineWidth;
		   lineWidth = Math.floor(lineWidth*zoomFactor);
		   //var top = getCanvasTop();
		   //var left = getCanvasLeft();
		   var stations = subwayData.line;
		   var line_x='';
		   var line_y='';
			$(stations).each(function (index) {
				var station = subwayData.line[index];
				if (selectLine==station.id)
				  {
				    line_x=station.line_x;
				    line_y=station.line_y;
				    canvastop=-(line_y-l)*zoomFactor*40-890;
			 			canvasleft=-(line_x-t)*zoomFactor*40-580; 
				    return;
				  }
				});
  
       zoomMap(cellSize/defaultCellSize);  
           
        });
		
				$(".waySelect").click(function(){
          wayLine = $(this).attr("id");
          document.getElementById(wayLine+"1").checked=true;
          if(wayLine=="allway")
            lineType="double";
          else
          	lineType="single";  
		   var cellSize = $(".subway-map").attr("data-cellSize");
           zoomMap(cellSize/defaultCellSize);
        });
		
		
       function getStationCoordinate(selectLine,scale){
			stationCoordinate = [];
			var stations = subwayData.line;
			$(stations).each(function (index) {
				var station = subwayData.line[index];
				if (selectLine != "all" && selectLine!=station.id)
				    return;
				//var line = station.line;
				var count = $(station.path).length;
				for (var i=0; i<count; i++) {
					var node = station.path[i];
					var label = node.name;
					var type  = node.type;
					
					var x = node.x;
					var y = node.y;
					var stationid = node.stationid;
					var stationcode = node.stationcode;
					stationCoordinate[stationCoordinate.length] = { x: x*scale, y:y*scale,line_x:x,line_y:y, name:label, marker:type,stationid:stationid,stationcode:stationcode};
				}
			});
		}
		
		$(".subway-map").mousemove(function(evt){
			if (timer != null){
			    clearTimeout(timer);
			}
			hideDiv("stationInfo");
			clearInterval(stationAnimInterval);
			if (stationAnimCanvas != null){
			    stationAnimCtx.clearRect(0, 0, stationAnimCanvas.width, stationAnimCanvas.height);
			}

 		    if (!evt) evt = window.event;
			lastX = mouseX(evt);
			lastY = mouseY(evt);
//          if (window.console && window.console.log)
//            window.console.log("mouse X=" + lastX + "Y=" + lastY);	
			timer = setTimeout(mapMouseMoveStop,150);				
		});
		$(".subway-map").click(function(){	
	    MouseClick(lastX,lastY);
	    });
	    //鼠标点击站点触发的事件
	    function MouseClick(x,y){
	    	var offsetY = getCanvasTop();
			  var offsetX = getCanvasLeft();
		   	$(stationCoordinate).each(function (index) {
				var station =  stationCoordinate[index];
				var stationX = station.x;
				var stationY = station.y;
				var line_y=station.line_y;
				var line_x=station.line_x;
				var zoomFac=1;
				//var a=(zoomFac-1)*(line_y-t)*40*30;
	    	//var b=(zoomFac-1)*(line_x-l)*40*30;
	    	if (Math.abs(x-offsetX - stationX) <=8 && Math.abs(y-offsetY - stationY) <=8)
	    	{
	    		zoomFac=1.3;
	    		canvastop=-(line_y-t)*zoomFac*defaultCellSize-890;
			 		canvasleft=-(line_x-l)*zoomFac*defaultCellSize-580;
			 		var newtop=defaultCellSize*(1-zoomFac)*30+canvastop;
			 		var newleft=defaultCellSize*(1-zoomFac)*30+canvasleft;
			 		//放大路网图
	    		zoomMap(zoomFac);
	    		//弹框
	    		if(station.name!=null)
					popupDiv("stationInfo", station.line_x*40*zoomFac+getCanvasLeft(), station.line_y*40*zoomFac+getCanvasTop(), "站名:"+station.name);
	    		
	    		var new_ctx=null;
	    		//if(new_canvas==null)
	    	//	{ 
					   var width =  $("#map canvas").attr("width");
					   var height = $("#map canvas").attr("height");
					   var canvas = $("<canvas id='new_canvas' style='position:absolute;z-Index:2000' width='" +width + "' height='" + height + "'></canvas>");
             $(".subway-map").append(canvas);
					   new_canvas = document.getElementById('new_canvas');
	           new_ctx = new_canvas.getContext('2d');	
	           $("#new_canvas").css("top", newtop+"px"); 
	   			   $("#new_canvas").css("left",newleft +"px");
	           stationRadius = $(".subway-map").attr("data-lineWidth");
						 stationRadius *=1.2;
	        // curStation=station;
	       // } 
         //站点圆圈放大
	    		new_stationAnim(new_ctx,station);
	    	}	  	    	  	
	    	});
	    }
	  function new_stationAnim(new_ctx,station){
	         //new_ctx.clearRect(0, 0, new_ctx.width, new_ctx.height);
		       new_ctx.strokeStyle = 'rgba(16,16,16,'+ lineAlpha +')';
           new_ctx.fillStyle = 'rgba(255,255,255,1.0)';
           new_ctx.beginPath();
           new_ctx.lineWidth = lineWidth;
           new_ctx.arc(station.x, station.y, stationRadius, 0, Math.PI * 2, true);
           new_ctx.closePath();
           new_ctx.stroke();
           new_ctx.fill();
		       lineWidth += 1;
           if (lineWidth >= 11)
              lineWidth = 0;   
           lineAlpha -= 0.1;
           if (lineAlpha <= 0)
              lineAlpha = 1.0;  	
	   	    new_canvas=null;   
	  }  
		function mapMouseMoveStop(){
			clearTimeout(timer);
					
			var top = getCanvasTop();
			var left = getCanvasLeft();
			getMouseOverStation(lastX,lastY,left,top);
		}
		
        function mouseX(evt) {
         // firefox
         if (evt.pageX) 
		   return evt.pageX;
         // IE
         else if (evt.clientX)
           return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
         else return null;
        }

        function mouseY(evt) {
          // firefox
          if (evt.pageY)
		    return evt.pageY;
          // IE
          else if (evt.clientY)
            return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
          else return null;
         }	  
	 
	    function getMouseOverStation(x, y,offsetX, offsetY){ 
	      var self = this;  
			  var FPS  = 20;
		   	$(stationCoordinate).each(function (index) {
				var station =  stationCoordinate[index];
				var stationX = station.x;
				var stationY = station.y;
				if (Math.abs(x-offsetX - stationX) <=8 && Math.abs(y-offsetY - stationY) <=8){
					mapMouseDown = false;
					if (stationAnimCanvas == null){
					   var width =  $("#map canvas").attr("width");
					   var height = $("#map canvas").attr("height");
					   var canvas = $("<canvas id='stationAnimCanvas' style='position:absolute;z-Index:2000' width='" +width + "' height='" + height + "'></canvas>");
                       $(".subway-map").append(canvas);
					   $("#stationAnimCanvas").css("top", offsetY +"px");
				     $("#stationAnimCanvas").css("left", offsetX +"px");
					   stationAnimCanvas = document.getElementById('stationAnimCanvas');
	                   stationAnimCtx = stationAnimCanvas.getContext('2d');				 
					}
					
					stationRadius = $(".subway-map").attr("data-lineWidth");
					switch(station.marker.toLowerCase()){
                          case "interchange":
            
			              break;  
						  case "station":
						    stationRadius *=0.9;
						  break;
		            }
						
					curStation = station;
          stationAnimInterval = setInterval(stationAnim, 1000/FPS);
					return false;
				} 			
			});
	    }
		
		function stationAnim(){
	         stationAnimCtx.clearRect(0, 0, stationAnimCanvas.width, stationAnimCanvas.height);
		       stationAnimCtx.strokeStyle = 'rgba(16,16,16,'+ lineAlpha +')';
           stationAnimCtx.fillStyle = 'rgba(255,255,255,1.0)';
           stationAnimCtx.beginPath();
           stationAnimCtx.lineWidth = lineWidth;
           stationAnimCtx.arc(curStation.x, curStation.y, stationRadius, 0, Math.PI * 2, true);
           stationAnimCtx.closePath();
           stationAnimCtx.stroke();
           stationAnimCtx.fill();
  
           
		   lineWidth += 1;
           if (lineWidth >= 11)
              lineWidth = 0;
    
           lineAlpha -= 0.1;
           if (lineAlpha <= 0)
              lineAlpha = 1.0;  
       } 
	   
	   $("#stationInfo").hover(function(){
            $(this).animate({ opacity: "show"}, 300);    
           },
		   function(){
		    $(this).animate({opacity: "hide" }, 300);
			clearInterval(stationAnimInterval);
			if (stationAnimCanvas != null){
			    stationAnimCtx.clearRect(0, 0, stationAnimCanvas.width, stationAnimCanvas.height);
			}
           });
	   
	   function popupDiv(div_id, left, top, station) {
            var div_obj = $("#" + div_id);
			$("#" + div_id).css({left: left, top:top});
            div_obj.animate({ opacity: "show"}, 200);     
			$("#stationInfoBody").text(station);     
        }     
		   
       function hideDiv(div_id) {
            $("#" + div_id).animate({opacity: "hide" }, 100);
        }
		
       $(".clsHead").click(function(){ 
          if($("#selectLine").is(":visible")){ //如果内容可见
             $(".clsHead span img").attr("src","Images/a1.gif"); //改变图片
             $("#selectLine").css("display","none"); //隐藏内容 
          }else{
             $(".clsHead span img").attr("src","Images/a2.gif"); //改变图片
             $("#selectLine").css("display","block");//显示内容
          }
      });
	   $(".clswayHead").click(function(){ 
          if($("#selectWay").is(":visible")){ //如果内容可见
             $(".clswayHead span img").attr("src","Images/a1.gif"); //改变图片
             $("#selectWay").css("display","none"); //隐藏内容 
          }else{
             $(".clswayHead span img").attr("src","Images/a2.gif"); //改变图片
             $("#selectWay").css("display","block");//显示内容
          }
      });
  });