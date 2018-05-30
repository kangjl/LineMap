// JavaScript Document
(function ($) {
    var plugin = {

        defaults: {
            debug: false,
            grid: false,
			line: selectLine,
			//lineStyle:wayLine
			lineStyle:lineType,   //double
        },

        options: {
    },
    identity: function (type) {
        if (type === undefined) type = "name";

        switch (type.toLowerCase()) {
            case "version": return "1.0.0"; break;
            default: return "subwayMap Plugin"; break;
        }
    },
    _debug: function (s) {
        if (this.options.debug)
            this._log(s);
    },
    _log: function () {
        if (window.console && window.console.log)
            window.console.log('[subwayMap] ' + Array.prototype.join.call(arguments, ' '));
    },
	
    _supportsCanvas: function () {
        var canvas = $("<canvas></canvas>");
        if (canvas[0].getContext)
            return true;
        else
            return false;
    },
	
    _getCanvasLayer: function (el, overlay) {
        this.layer++;
        var canvas = $("<canvas style='position:absolute;z-Index:" + ((overlay ? 2000 : 1000) + this.layer) + "' width='" + this.options.pixelWidth + "' height='" + this.options.pixelHeight + "'></canvas>");
        el.append(canvas);
		$(canvas).css("top", "8px");
		$(canvas).css("left", "8px");
        return (canvas[0].getContext("2d"));
    },
	
    _render: function (el) {
        
        this.layer = -1;
        var rows = el.attr("data-rows");
        if (rows === undefined) 
            rows = 10;
        else
            rows = parseInt(rows);

        var columns = el.attr("data-columns");
        if (columns === undefined) 
            columns = 10;
        else
            columns = parseInt(columns);

        var scale = el.attr("data-cellSize");
        if (scale === undefined) 
            scale = 100;
        else
            scale = parseInt(scale);

        var lineWidth = el.attr("data-lineWidth");
        if (lineWidth === undefined) 
            lineWidth = 10;
        else
            lineWidth = parseInt(lineWidth);
			
		var textSize = el.attr("data-textSize");
        if (textSize === undefined) 
            textSize = 14;
        else
            textSize = parseInt(textSize);

        var textClass = el.attr("data-textClass");
        if (textClass === undefined) textClass = "";

        var grid = el.attr("data-grid");
        if ((grid === undefined) || (grid.toLowerCase() == "false"))
            grid = false;
        else
            grid = true;

        var legendId = el.attr("data-legendId");
        if (legendId === undefined) legendId = "";

        var gridNumbers = el.attr("data-gridNumbers");
        if ((gridNumbers === undefined) || (gridNumbers.toLowerCase() == "false"))
            gridNumbers = false;
        else
            gridNumbers = true;

        var reverseMarkers = el.attr("data-reverseMarkers");
        if ((reverseMarkers === undefined) || (reverseMarkers.toLowerCase() == "false"))
            reverseMarkers = false;
        else
            reverseMarkers = true;

        this.options.pixelWidth = columns * scale;
        this.options.pixelHeight = rows * scale;

        //el.css("width", this.options.pixelWidth);
        //el.css("height", this.options.pixelHeight);
		
        var supportsCanvas = $("<canvas></canvas>")[0].getContext;
        if (supportsCanvas) {
			if (grid) 
			   this._drawGrid(el, scale, gridNumbers);
			
		    var lineCtx = this._getCanvasLayer(el, false);
			var drawLine = 	this.options.line;
			if (drawLine != "all"){
               this._drawSubwayLine(el, lineCtx, "all", scale, rows, columns, lineWidth, textSize, reverseMarkers);
			   
			   lineCtx = this._getCanvasLayer(el, false);
			   lineCtx.save();
			   lineCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
               lineCtx.fillRect(0, 0, this.options.pixelWidth, this.options.pixelHeight);
			   lineCtx.restore();
			   this._drawSubwayLine(el, lineCtx, drawLine, scale, rows, columns, lineWidth, textSize, reverseMarkers);
			} else {
			   this._drawSubwayLine(el, lineCtx, drawLine, scale, rows, columns, lineWidth, textSize, reverseMarkers);
			}
        }
    },
	//画线
	 _drawSubwayLine: function (el, ctx, drawLine, scale, rows, columns, width, textSize, reverseMarkers) {
		  var self = this;
			var lines = subwayData.line;
			$(lines).each(function (index) {
				var line = subwayData.line[index];
        if(routdatas==""||drawLine=="all")
        {
        if (drawLine != "all" && drawLine!=line.id)
				return; 
				var lineNodes = [];	 	
				var name = line.name;
				var color = line.color;	
				var count = $(line.path).length;
				for (var i=0; i<count; i++) {
					var node = line.path[i];
					var dir = node.dir;
					if (dir === undefined) dir = "";
					var x = node.x;
					var y = node.y;
					var llinewidth=node.llinewidth; 
					var llinecolor=node.llinecolor;
					var rlinewidth=node.rlinewidth; 
					var rlinecolor=node.rlinecolor;
					 var stationname=node.name;
					 var labelpos=node.labelpos;
					 var stationtype=node.type;
					 var stationid=node.stationid;
					 var stationcode=node.stationcode;
					lineNodes[lineNodes.length] = { x: x, y:y, direction:dir,llinecolor:llinecolor,llinewidth:llinewidth,rlinecolor:rlinecolor,rlinewidth:rlinewidth,stationname:stationname,labelpos:labelpos,stationtype:stationtype,stationid:stationid,stationcode:stationcode};
				}
				//显示各线路名称
				var x = line.x * scale;
        var y = line.y * scale;
        var imgpath=line.imgpath;
	     // ctx.fillStyle = line.color;  
        //ctx.font = textSize+4 +'px 微软雅黑';
        //ctx.fillText(line.name, x, y);
				if(drawStationName)
				self._drawImage(ctx,x,y,imgpath,56,19);
			}
				//点选
			else{
			for(var j=0;j<routdatas.length;j++)
			{
				var lineNodes = [];	
				var routdata = routdatas[j];
				var lineid=routdata.lineid;
				if(lineid==line.id)
				{
				var startnodeid=routdata.startnodeid;//出发站id
				var endnodeid=routdata.endnodeid;//到达站id
				var linecolor=routdata.linecolor;//线路颜色
				var linewidth=routdata.linewidth;//线路宽度
        var startnode=self._getarrayposition(line,startnodeid);
				var endnode=self._getarrayposition(line,endnodeid);
				var startnum=startnode;
				var endnum=endnode;
        if(startnode>endnode)
        {
          startnum=endnode;
          endnum=startnode;
        }
				for (i=startnum; i<=endnum; i++) {
					var node = line.path[i];
					var stationid=node.stationid;
					var dir = node.dir;
					if (dir === undefined) dir = "";
					var x = node.x;
					var y = node.y;
					var llinewidth=linewidth; 
					var llinecolor=linecolor;
					var rlinewidth=linewidth; 
					var rlinecolor=linecolor;
				if(linewidth==null)
				{
				llinewidth=node.llinewidth;
			  rlinewidth=node.rlinewidth;
			  }
				if(linecolor==null)
				{
				llinecolor=node.llinecolor;
			  rlinecolor=node.rlinecolor;
			  }
					 var stationname=node.name;
					 var labelpos=node.labelpos;
					 var stationtype=node.type;
					 var stationid=node.stationid;
					 var stationcode=node.stationcode;
					lineNodes[lineNodes.length] = { x: x, y:y, direction:dir,llinecolor:llinecolor,llinewidth:llinewidth,rlinecolor:rlinecolor,rlinewidth:rlinewidth,stationname:stationname,labelpos:labelpos,stationtype:stationtype,stationid:stationid,stationcode:stationcode};
				}
					if (lineNodes.length > 0){
				   var greenColor = "#00cd00";
				   var wayType="all";
				   if(wayLine=="upway")
				   wayType="left";
				   if(wayLine=="downway")
				   wayType="right";
				   if(wayLine=="upway"||wayLine=="downway")
				   self.options.lineStyle="single";
				   else
				   self.options.lineStyle="double";	
				   switch(self.options.lineStyle){
					   case "single":
                         self._drawLine(el, ctx, scale, rows, columns, color, width, lineNodes, reverseMarkers,wayType);	
                       break;
					   case "double":
				         self._drawLeftLine(el, ctx, scale, rows, columns, color, width/2, lineNodes, reverseMarkers,"left");	
				         self._drawRightLine(el, ctx, scale, rows, columns, color, width/2, lineNodes, reverseMarkers,"right");	
                         break;					   
					   default:
                         self._drawLine(el, ctx, scale, rows, columns, color, width, lineNodes, reverseMarkers,wayType);	
                         break;
				   } 
				}
				//显示各线路名称
				var x = line.x * scale;
        var y = line.y * scale;
	      ctx.fillStyle = line.color;  
        ctx.font = textSize+4 +'px 微软雅黑';
        ctx.fillText(line.name, x, y);
				}
			  }
			}		
			if (lineNodes.length > 0){
				   var greenColor = "#00cd00";
				   var wayType="all";
				   if(wayLine=="upway")
				   wayType="left";
				   if(wayLine=="downway")
				   wayType="right";
				   if(wayLine=="upway"||wayLine=="downway")
				   self.options.lineStyle="single";
				   else
				   self.options.lineStyle="double";	
				   switch(self.options.lineStyle){
					   case "single":
                         self._drawLine(el, ctx, scale, rows, columns, color, width, lineNodes, reverseMarkers,wayType);	
                       break;
					   case "double":
				         self._drawLeftLine(el, ctx, scale, rows, columns, color, width/2, lineNodes, reverseMarkers,"left");	
				         self._drawRightLine(el, ctx, scale, rows, columns, color, width/2, lineNodes, reverseMarkers,"right");	
                         break;					   
					   default:
                         self._drawLine(el, ctx, scale, rows, columns, color, width, lineNodes, reverseMarkers,wayType);	
                         break;
				   } 
				}
					
			});
			if(drawImage)
			{
			//画景点
			self._drawImage(ctx,28.7*scale,30.5*scale,'images/天安门.png',35,35);
			self._drawImage(ctx,35.7*scale,32.9*scale,'images/火车站.png',35,35);
			self._drawImage(ctx,47.2*scale,16.8*scale,'images/飞机.png',35,35);
		  }
			
			var stationCtx = ctx;//this._getCanvasLayer(el, true);
			var completeInterchanges = [];		
			var stations = subwayData.line;
			$(stations).each(function (index) {			
				var station = subwayData.line[index]
;			
				if(routdatas==""||drawLine=="all")
				{	
				if (drawLine != "all" && drawLine!=station.id)
				    return;	
				var stationNodes = [];	    
				var count = $(station.path).length;
				for (var i=0; i<count; i++) {
					var node = station.path[i];
					var label = node.name;
					var labelPos = node.labelpos;
					if (labelPos === undefined) labelPos = "";
					var marker = node.type;
					var markerInfo = "";
					var link = "";
					var title = "";
					
					var x = node.x;
					var y = node.y;
					var llinecolor=node.llinecolor;
					var rlinecolor=node.rlinecolor;
					stationNodes[stationNodes.length] = { x: x, y:y, marker: marker, markerInfo: markerInfo, link: link, title: title, label: label, labelPos: labelPos,llinecolor:llinecolor,rlinecolor:rlinecolor};
				}
			}
				else{
				for(j=0;j<routdatas.length;j++)
			 {
			 	var stationNodes = [];		
			 	var routdata = routdatas[j];			
			 	var lineid=routdata.lineid;
			 	if(station.id==lineid)
			 	{
				var startnodeid=routdata.startnodeid;//出发站id
				var endnodeid=routdata.endnodeid;//到达站id
				var stationbgcolor=routdata.stationbgcolor;//站点边框色
				var stationfgcolor=routdata.stationfgcolor;//站点填充色
				if(stationbgcolor==null)
				stationbgcolor="#ffffff";
				if(stationfgcolor==null)
				stationfgcolor="#000000";
        var startnode=self._getarrayposition(station,startnodeid);
				var endnode=self._getarrayposition(station,endnodeid);
				var startnum=startnode;
				var endnum=endnode;
        if(startnode>endnode)
        {
          startnum=endnode;
          endnum=startnode;
        }
				for (i=startnum; i<=endnum; i++) {
					var node = station.path[i];
					var label = node.name;
					var labelPos = node.labelpos;
					if (labelPos === undefined) labelPos = "";
					var marker = node.type;
					var markerInfo = "";
					var link = "";
					var title = "";
					
					var x = node.x;
					var y = node.y;
					var llinecolor=node.llinecolor;
					var rlinecolor=node.rlinecolor;
					stationNodes[stationNodes.length] = { x: x, y:y, marker: marker, markerInfo: markerInfo, link: link, title: title, label: label, labelPos: labelPos,llinecolor:llinecolor,rlinecolor:rlinecolor};

				}
				  for (var ii = 0; ii < stationNodes.length; ii++) {
                	var node = stationNodes[ii];
                	if (node.marker == "interchange"){
                		var find = false;
                		for (var kk=0; kk<completeInterchanges.length; kk++){
                			var interchange = completeInterchanges[kk];
                			var interchangeName = interchange.label;
                			if (interchangeName == node.label){
                				find = true;
                				break;
                			}
                		}
                		if (find == false){
                			completeInterchanges[completeInterchanges.length] = node;    
                			self._drawMarker(el, stationCtx, scale, width, textSize, stationNodes[ii], reverseMarkers,stationfgcolor,stationbgcolor);
                		}
                	} else{      	
                    self._drawMarker(el, stationCtx, scale, width*1.2, textSize, stationNodes[ii], reverseMarkers,stationfgcolor,stationbgcolor);
					}
          }
        }
			  }
				}
                for (var i = 0; i < stationNodes.length; i++) {
                	var node = stationNodes[i];
                	if (node.marker == "interchange"){
                		var find = false;
                		for (var k=0; k<completeInterchanges.length; k++){
                			var interchange = completeInterchanges[k];
                			var interchangeName = interchange.label;
                			if (interchangeName == node.label){
                				find = true;
                				break;
                			}
                		}
                		if (find == false){
                			completeInterchanges[completeInterchanges.length] = node;    
                			self._drawMarker(el, stationCtx, scale, width, textSize, stationNodes[i], reverseMarkers,"","");
                		}
                	} else{      	
                    self._drawMarker(el, stationCtx, scale, width*1.2, textSize, stationNodes[i], reverseMarkers,"","");
					}
                 }
			});
		
	 },
	  _getarrayposition:function(line,nodeid){
	  	    var count = $(line.path).length;
	  			for (var i=0; i<count; i++) {
	  			var node = line.path[i];
					var stationid=node.stationid;
    					if(stationid==nodeid)
    						return i;
          }
	  	},
//插入图片的方法
_drawImage:function (ctx,x,y,imgpath,cpx,cpy) {
var img = new Image();
img.onload = function(){
ctx.drawImage(img,x,y,cpx*zoomFactor,cpy*zoomFactor);
ctx.stroke();
}
img.src = imgpath;

},

	
	  	//画线的核心方法
    _drawLine: function (el, ctx, scale, rows, columns, color, width, nodes, reverseMarkers,line_type)   {

  //    var ctx = this._getCanvasLayer(el, false);

        var markers = [];
        var lineNodes = nodes;
		        for (var lineNode = 0; lineNode < lineNodes.length; lineNode++) {

        ctx.beginPath();
        ctx.moveTo(nodes[lineNode].x * scale, nodes[lineNode].y * scale);        
        if (lineNode < (lineNodes.length - 1)) {
                var nextNode = lineNodes[lineNode + 1];
                var currNode = lineNodes[lineNode];
								var llinecolor=currNode.llinecolor;
								var llinewidth=currNode.llinewidth;
								var rlinecolor=currNode.rlinecolor;
								var rlinewidth=currNode.rlinewidth;
                // Correction for edges so lines are not running off campus
                var xCorr = 0;
                var yCorr = 0;
                if (nextNode.x == 0) xCorr = width / 2;
                if (nextNode.x == columns) xCorr = -1 * width / 2;
                if (nextNode.y == 0) yCorr = width / 2;
                if (nextNode.y == rows) yCorr = -1 * width / 2;

                var xVal = 0;
                var yVal = 0;
                var direction = "";

                var xDiff = Math.round(Math.abs(currNode.x - nextNode.x));
                var yDiff = Math.round(Math.abs(currNode.y - nextNode.y));
                if ((xDiff == 0) || (yDiff == 0)) {
                    // Horizontal or Vertical
                    ctx.lineTo((nextNode.x * scale) + xCorr, (nextNode.y * scale) + yCorr);
                }
                else if ((xDiff == 1) && (yDiff == 1)) {
                    // 90 degree turn
                    if (nextNode.direction != "")
                        direction = nextNode.direction.toLowerCase();
                    switch (direction) {
                        case "s": xVal = 0; yVal = scale; break;
                        case "e": xVal = scale; yVal = 0; break;
                        case "w": xVal = -1 * scale; yVal = 0; break;
                        default: xVal = 0; yVal = -1 * scale; break;
                    }
                    ctx.quadraticCurveTo((currNode.x * scale) + xVal, (currNode.y * scale) + yVal,
                                                    (nextNode.x * scale) + xCorr, (nextNode.y * scale) + yCorr);
                }
                else if (xDiff == yDiff) {
                    // Symmetric, angular with curves at both ends
                    if (nextNode.x < currNode.x) {
                        if (nextNode.y < currNode.y)
                            direction = "nw";
                        else
                            direction = "sw";
                    }
                    else {
                        if (nextNode.y < currNode.y)
                            direction = "ne";
                        else
                            direction = "se";
                    }
                    var dirVal = 1;
                    switch (direction) {
                        case "nw": xVal = -1 * (scale / 2); yVal = 1; dirVal = 1; break;
                        case "sw": xVal = -1 * (scale / 2); yVal = -1; dirVal = 1; break;
                        case "se": xVal = (scale / 2); yVal = -1; dirVal = -1; break;
                        case "ne": xVal = (scale / 2); yVal = 1; dirVal = -1; break;
                    }
                    this._debug((currNode.x * scale) + xVal + ", " + (currNode.y * scale) + "; " + (nextNode.x + (dirVal * xDiff / 2)) * scale + ", " +
                    (nextNode.y + (yVal * xDiff / 2)) * scale)
                    ctx.bezierCurveTo(
                            (currNode.x * scale) + xVal, (currNode.y * scale),
                            (currNode.x * scale) + xVal, (currNode.y * scale),
                            (nextNode.x + (dirVal * xDiff / 2)) * scale, (nextNode.y + (yVal * xDiff / 2)) * scale);
                    ctx.bezierCurveTo(
                            (nextNode.x * scale) + (dirVal * scale / 2), (nextNode.y) * scale,
                            (nextNode.x * scale) + (dirVal * scale / 2), (nextNode.y) * scale,
                            nextNode.x * scale, nextNode.y * scale);
                }
                else
                    ctx.lineTo(nextNode.x * scale, nextNode.y * scale);
            }
        if(line_type=='right')    
        {
        ctx.strokeStyle = rlinecolor;
        //ctx.globalCompositeOperation='destination-over';
        rlinewidth = Math.floor(rlinewidth*zoomFactor);
        ctx.lineWidth = rlinewidth;
        }
        else
        {
        ctx.strokeStyle = llinecolor;
        llinewidth = Math.floor(llinewidth*zoomFactor);
        ctx.lineWidth = llinewidth;
        }	
        ctx.stroke();
        
        } 


    },
	
	_getLineDirection: function(curNode, nextNode){
		  var dir = ""; 
		  var curX = curNode.x;
		  var curY = curNode.y;
		  var nextX = nextNode.x;
		  var nextY = nextNode.y;
		  var offsetX = nextX - curX;
		  var offsetY = nextY - curY;
		  
		  if (offsetX == 0 && offsetY > 0){
			  dir = "s";
		  }
		  if (offsetX == 0 && offsetY < 0){
			  dir = "n";
		  }
		  if (offsetY == 0 && offsetX > 0){
			  dir = "e";
		  }
		  if (offsetY == 0 && offsetX < 0){
			  dir = "w";
		  }
		  if (offsetX > 0 && offsetY > 0){
			   dir = "se";
		  }
		  if (offsetX > 0 && offsetY < 0){
			  dir = "ne";
		  }
		  if (offsetX < 0 && offsetY < 0){
			  dir = "nw";
		  }
		  if (offsetX < 0 && offsetY > 0){
			  dir = "sw";
		  }  
		  
		  return dir;
	},

    _drawLeftLine: function (el, ctx, scale, rows, columns, color, width, nodes, reverseMarkers,wayLine)   {
 
        var lineNodes = [];
		var offset = (width/2 + 2)/scale;
		offset = Math.round(offset*1000)/1000;
        var offsetX = offset;
		var offsetY = offset;
		var dir = "";
		for(var i = 0; i < nodes.length; i++){  
		  if (i!=nodes.length-1){
		     dir = this._getLineDirection(nodes[i], nodes[i+1]); 
		  }
		  var curX = nodes[i].x;
		  var curY = nodes[i].y;
		  switch(dir){
			  case "n":
			    offsetX = -offset;
				offsetY = 0;
			  break;
			  case "ne":
			    offsetX = -offset;
			    offsetY = -offset;
			  break;
			  case "e":
			    offsetX = offset/2;
				offsetY = -offset;
			  break;
			  case "se":
			    offsetX = offset;
				offsetY = -offset;
			  break;
			  case "s":
			    offsetX = offset;
				offsetY = 0;
				break;
			  case "sw":
			    offsetX = offset;
				offsetY = offset/2;
				break;	
			  case "w":
			    offsetX = offset/2;  
				offsetY = offset;
				break;
			  case "nw":
			    offsetX = -offset;
				offsetY = offset;
				break;	
			  default:
			    offsetX = -offset;
				offsetY = offset;
			  break;
		  }
		  
          var x = curX + offsetX;
		  var y = curY + offsetY;
      var llinecolor=nodes[i].llinecolor;
      var llinewidth=nodes[i].llinewidth;
		  lineNodes[lineNodes.length] =  { x: x, y:y, direction: nodes[i].direction,llinecolor:llinecolor,llinewidth:llinewidth};
        }		
		
		this._drawLine(el, ctx, scale, rows, columns, color, width, lineNodes, reverseMarkers,wayLine);   
    },
	
	 _drawRightLine: function (el, ctx, scale, rows, columns, color, width, nodes, reverseMarkers,wayLine)   {
    var lineNodes = [];
		var offset = (width/2 + 2)/scale;
		offset = Math.round(offset*1000)/1000;
        var offsetX = offset;
		var offsetY = offset;
		var dir = "";
		for(var i = 0; i < nodes.length; i++){  
		  if (i!=nodes.length-1){
		     dir = this._getLineDirection(nodes[i], nodes[i+1]); 
		  }
		  var curX = nodes[i].x;
		  var curY = nodes[i].y;
		  switch(dir){
			  case "n":
			    offsetX = offset;
				offsetY = 0;
			  break;
			  case "ne":
			    offsetX = offset;
			    offsetY = offset;
			  break;
			  case "e":
			    offsetX = -offset/2;
				offsetY = offset;
			  break;
			  case "se":
			    offsetX = -offset;
				offsetY = offset;
			  break;
			  case "s":
			    offsetX = -offset;
				offsetY = 0;
				break;
			  case "sw":
			    offsetX = -offset;
				offsetY = -offset/2;
				break;	
			  case "w":
			    offsetX = -offset/2;
				offsetY = -offset;
				break;
			  case "nw":
			    offsetX = offset;
				offsetY = -offset;
				break;	
			  default:
			    offsetX = offset;
				offsetY = -offset;
			  break;
		  }
		  
          var x = curX + offsetX;
		  var y = curY + offsetY;

		  var rlinecolor=nodes[i].rlinecolor;
      var rlinewidth=nodes[i].rlinewidth;
		  lineNodes[lineNodes.length] =  { x: x, y:y, direction: nodes[i].direction,rlinecolor:rlinecolor,rlinewidth:rlinewidth,};
        }		
		
		this._drawLine(el, ctx, scale, rows, columns, color, width, lineNodes, reverseMarkers,wayLine);   
    },
//画点
    _drawMarker: function (el, ctx, scale, width, textSize, data, reverseMarkers,fgColor,bgColor) {
        if (data.label == "") return;
        if (data.marker == "") data.marker = "station";
		
//		ctx.save();

        // Scale coordinates for rendering
        var x = data.x * scale;
        var y = data.y * scale;

        // Keep it simple -- black on white, or white on black
         if(fgColor=="")
         fgColor = "#ffffff";
         if(bgColor=="")
         bgColor = "#35383e";
        //if (reverseMarkers)
      //  {
       //     fgColor = "#ffffff";
       //     bgColor = "#000000";
       // }

        // Render station and interchange icons
        ctx.strokeStyle = fgColor;
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        switch(data.marker)
        {
            case "interchange":
            case "@interchange":
            var out_width=5;
                ctx.lineWidth = out_width;
                if (data.markerInfo == "")
                    ctx.arc(x, y, width * 0.7, 0, Math.PI * 2, true);
                else
                {
                    var mDir = data.markerInfo.substr(0,1).toLowerCase();
                    var mSize = parseInt(data.markerInfo.substr(1,10));
                    if (((mDir == "v") || (mDir == "h")) && (mSize > 1))
                    {
                        if (mDir == "v")
                        {
                            ctx.arc(x, y, width * 0.7,290 * Math.PI/180, 250 * Math.PI/180, false);
                            ctx.arc(x, y-(width*mSize), width * 0.7,110 * Math.PI/180, 70 * Math.PI/180, false);
                        }
                        else
                        {
                            ctx.arc(x, y, width * 0.7,20 * Math.PI/180, 340 * Math.PI/180, false);
                            ctx.arc(x+(width*mSize), y, width * 0.7,200 * Math.PI/180, 160 * Math.PI/180, false);
                        }
                    }
                    else
                        ctx.arc(x, y, width * 0.7, 0, Math.PI * 2, true);
                }
                break;
            case "station":
            case "@station":
                ctx.lineWidth = width/2;
                if(wayLine=="upway")
                ctx.fillStyle = data.llinecolor;
                else
                ctx.fillStyle = data.rlinecolor;	
                ctx.fillRect(x,y,6*zoomFactor,6*zoomFactor);
                break;
                
            case "walk_interchange":
            case "@walk_interchange":
                break;    
        }
        if(this.options.line!='all'&&data.marker=='interchange1')
        ctx.arc(x, y, width * 0.7, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
/*        
        // Render text labels and hyperlinks
        var pos = "";
        var offset = width + 4;
        var topOffset = 0;
        var centerOffset = "-50px";
        switch(data.labelPos.toLowerCase())
        {
            case "n":
                pos = "text-align: center; margin: 0 0 " + offset + "px " + centerOffset;
                topOffset = offset * 2.5;
                break;
            case "w":
                pos = "text-align: right; margin:0 " + offset + "px 0 -" + (100 + offset) + "px";
                topOffset = offset*0.8;
                break;
            case "e":
                pos = "text-align: left; margin:0 0 0 " + offset + "px";
                topOffset = offset*0.8;
                break;
            case "s":
                pos = "text-align: center; margin:" + offset + "px 0 0 " + centerOffset;
                break;
            case "se":
                pos = "text-align: left; margin:" + offset + "px 0 0 " + offset + "px";
                break;
            case "ne":
                pos = "text-align: left; padding-left: " + offset + "px; margin: 0 0 " + offset + "px 0";
                topOffset = offset * 2.5;
                break;
            case "sw": //TODO
                pos = "text-align: right; margin:0 " + offset + "px 0 -" + (100 + offset) + "px";
//              topOffset = offset;
                break;
            case "nw": //TODO
                pos = "text-align: right; margin:0 " + offset + "px 0 -" + (100 + offset) + "px";
                topOffset = offset * 2.5;
                break;
        }
		
        var style = (textClass != "" ? "class='" + textClass + "' " : "") + "style='" + (textClass == "" ? "font-size:10pt;font-family:Verdana,Arial,Helvetica,Sans Serif;text-decoration:none;" : "") + "width:100px;" + (pos != "" ? pos : "") + ";position:absolute;top:" + (y + el.offset().top - (topOffset > 0 ? topOffset : 0)) + "px;left:" + (x + el.offset().left) + "px;z-index:3000;'";
        if (data.link != "")
            $("<a " + style + " title='" + data.title.replace(/\\n/g,"<br />") + "' href='" + data.link + "' target='_new'>" + data.label.replace(/\\n/g,"<br />") + "</span>").appendTo(el);
        else
            $("<span " + style + ">" + data.label.replace(/\\n/g,"<br />") + "</span>").appendTo(el);;
 */       
		//
		if(data.label!=null)
		{
	     ctx.fillStyle = "#ffffff";  
       ctx.font = textSize +'px 微软雅黑';  
       ctx.textAlign = 'center';  
       ctx.textBaseline = 'top';	
	     var textX = x;
	     var textY = y;
	     var offset = width + 3;
       switch(data.labelPos.toLowerCase())
        {
            case "n":
                if(data.marker=='interchange')
                textY -= offset*2;
                else
                textY -= offset*1.5;
                break;
            case "w":
              ctx.textAlign = 'right';  
				      textX -= offset;
	            textY -= offset/2.5;
                break;
            case "e":
                ctx.textAlign = 'left';  
								textX += offset;
	            	textY -= offset/2.5;
                break;
            case "s":
                 textY += offset;
                break;
            case "se":
                ctx.textAlign = 'left';  
								textX += offset;
	            	textY += offset;
                break;
            case "ne":
                ctx.textAlign = 'left';  
								textX += offset;
								if(data.marker=='interchange')
	           		textY -= offset*1.8;
	           		else
	           		textY -= offset*1.1;	
                break;
            case "sw": 
                ctx.textAlign = 'right';  
                if(data.marker=='interchange')
                {
								textX -= offset;
	             	textY += offset;
	              }
	              else
	              {
	              textX -= offset*0.8;
	             	textY += offset*0.4;
	              }
                break;
            case "nw": 
                ctx.textAlign = 'right';  
								textX -= offset;
	            	textY -= offset*1.8;
                break;
        }
		
//	    ctx.shadowBlur=2;
//      ctx.shadowColor='rgb(0,0,0)';
//      ctx.shadowOffsetX = 3;
//      ctx.shadowOffsetY=3;	
		if(this.options.line=='all'&&data.marker!='interchange1')	  
		ctx.fillText(data.label, textX, textY);
		if(this.options.line!='all')
		ctx.fillText(data.label, textX, textY);
//		ctx.restore();
		}
    },
    _drawGrid: function (el, scale, gridNumbers) {

        var ctx = this._getCanvasLayer(el, false);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        var counter = 0;
        for (var x = 0.5; x < this.options.pixelWidth; x += scale) {
            if (gridNumbers)
            {
                ctx.moveTo(x, 0);
                ctx.fillText(counter++, x-15, 10);
            }
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.options.pixelHeight);
        }
        ctx.moveTo(this.options.pixelWidth - 0.5, 0);
        ctx.lineTo(this.options.pixelWidth - 0.5, this.options.pixelHeight);

        counter = 0;
        for (var y = 0.5; y < this.options.pixelHeight; y += scale) {
            if (gridNumbers)
            {
                ctx.moveTo(0, y);
                ctx.fillText(counter++, 0, y-15);
            }
            ctx.moveTo(0, y);
            ctx.lineTo(this.options.pixelWidth, y);
        }
        ctx.moveTo(0, this.options.pixelHeight - 0.5);
        ctx.lineTo(this.options.pixelWidth, this.options.pixelHeight - 0.5);
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

    }
}

var methods = {

    init: function (options) {

        plugin.options = $.extend({}, plugin.defaults, options);
        // iterate and reformat each matched element
        return this.each(function (index) {

            plugin.options = $.meta
                                    ? $.extend(plugin.options, $(this).data())
                                    : plugin.options;

            plugin._debug("BEGIN: " + plugin.identity() + " for element " + index);

            plugin._render($(this));

            plugin._debug("END: " + plugin.identity() + " for element " + index);
        });

    },
    drawLine: function (data) {
        plugin._drawLine(data.element, data.scale, data.rows, data.columns, data.color, data.width, data.nodes,"all");
    },
};

$.fn.subwayMap = function (method) {
 
   var name = subwayData.line[0].name;
    // Method calling logic
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
    } else {
        $.error('Method ' + method + ' does not exist on jQuery.tooltip');
    }

};

})(jQuery);