// VIEW :: UI 뷰 표현


// 기본 캔버스, 컨텐스트. 기본 모드. drawing 플래그. 이전 x,y좌표
var canvas = document.getElementById("myCanvas");
var myContext = canvas.getContext("2d");

// 기본 context 라인 스타일
const defaultBorderColor = "#000000";
const defaultFillColor = "#ffffff";

myContext.lineCap = "round";
myContext.lineJoin = "round";

// 캔버스 뷰 깨끗한 상태로
function clearCanvas(){
	myContext.clearRect(0, 0, canvas.width, canvas.height);
}

// 캔버스 컨텍스트의 색상 디폴트값으로 재지정
function setDefaultStyle(){
	myContext.strokeStyle = defaultBorderColor;
	myContext.fillStyle = defaultFillColor;
}

// 사각형 도형 객체 임시 생성 반환
function returnTempRect(me, startX, startY){
	var curX = me.offsetX;
	var curY = me.offsetY;
	var tmp = new ShapeObj("Rectangle", new coord(startX, startY), new coord(curX, curY), myContext.strokeStyle, myContext.fillStyle, -1);
	return tmp;
}

// 타원 도형 객체 임시 생성 반환
function returnTempEllipse(me, startX, startY){
	var curX = me.offsetX;
	var curY = me.offsetY;
	var tmp = new ShapeObj("Ellipse", new coord(startX, startY), new coord(curX, curY), myContext.strokeStyle, myContext.fillStyle, -1);
	return tmp;
}

function drawLine(LineObj){
	myContext.strokeStyle = LineObj.bordercolor;

	/*
	라인 객체 생성
	*/
}

// 사각형 도형 객체 그리기
function drawRectangle(RectObj){
	myContext.strokeStyle = RectObj.bordercolor;
	myContext.fillStyle = RectObj.fillcolor;
	myContext.beginPath();
	myContext.fillRect(RectObj.centerpoint.x - RectObj.width/2, RectObj.centerpoint.y - RectObj.height/2, RectObj.width, RectObj.height);
	myContext.strokeRect(RectObj.centerpoint.x - RectObj.width/2, RectObj.centerpoint.y - RectObj.height/2, RectObj.width, RectObj.height);
	myContext.closePath();
	myContext.stroke();
}

// 타원 도형 객체 그리기
function drawEllipse(EllObj){
	myContext.strokeStyle = EllObj.bordercolor;
	myContext.fillStyle = EllObj.fillcolor;
	myContext.beginPath();
	myContext.ellipse(EllObj.centerpoint.x, EllObj.centerpoint.y, EllObj.width/2, EllObj.height/2, 0, 0, Math.PI * 2);
	myContext.fill();
	myContext.closePath();
	myContext.stroke();
}

// 중심좌표 (x,y)인 작은 원 그리기
function drawBasicCircle(center){
	setDefaultStyle();
	myContext.beginPath();
	myContext.ellipse(center.x, center.y, 2, 2, 0, 0, Math.PI * 2);
	myContext.fill();
	myContext.closePath();
	myContext.stroke();
}

// 저장된 도형 객체 모두 그리기
function redrawAll(){
	// 전체 캔버스 다 지우기
	clearCanvas();
	// 저장 배열에서 모두 읽어오기
	for(var i = 0; i < objArr.length; i++){
		if (objArr[i].type == 'Line'){
			drawLine(objArr[i]);
		}
		else if (objArr[i].type == 'Rectangle'){
			drawRectangle(objArr[i]);
		}
		else if (objArr[i].type == 'Ellipse'){
			drawEllipse(objArr[i]);
		}
	}
	// 선택된 개체에 한해선 프레임포인트 보여주기
	if (selectedObjs.length == 1){
		showFrameofObj(selectedObjs[0]);
	}
	// 캔버스 컨텍스트의 색상 디폴트값으로 재지정
	setDefaultStyle();
}

// 객체 하나 선택시, 속성창 보이기
function showPropertyEdit(){
	if (selectedObjs.length == 1){
		document.getElementById('editor-property-edit').style.display = 'block';
	}
	else{
		document.getElementById('editor-property-edit').style.display = 'none';
	}
}


// 객체의 값을 속성창에 업데이트 (model -> view)
function updateProperty(obj){
	if (obj.type == 'Rectangle'){
		document.getElementById('editor-property-centerX').value = obj.centerpoint.x;
		document.getElementById('editor-property-centerY').value = obj.centerpoint.y;
		document.getElementById('editor-property-width').value = obj.width;
		document.getElementById('editor-property-height').value = obj.height;
		document.getElementById('editor-property-bordercolor').value = obj.bordercolor;
		document.getElementById('editor-property-fillcolor').value = obj.fillcolor;
	}
	else if (obj.type == 'Ellipse'){
		document.getElementById('editor-property-centerX').value = obj.centerpoint.x;
		document.getElementById('editor-property-centerY').value = obj.centerpoint.y;
		document.getElementById('editor-property-width').value = obj.width;
		document.getElementById('editor-property-height').value = obj.height;
		document.getElementById('editor-property-bordercolor').value = obj.bordercolor;
		document.getElementById('editor-property-fillcolor').value = obj.fillcolor;
	}
}


// obj를 감싸는 최소 직사각형 프레임 가시화
function showFrameofObj(obj){
	for(var i = 0; i < 8; i++){
		drawBasicCircle(obj.framePoints[i]);
	}
}