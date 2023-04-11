// CONTROLLER :: 이벤트 컨트롤러
// 마우스 클릭 액션

var drawMode = 'drawLine';
var drawing = false;
var startX;
var startY;

// 이벤트 드리븐 :: 마우스 입력에 따라
// 모드 플래그에 따라 다른 기능
canvas.onmousedown	= start;
canvas.onmousemove	= draw;
canvas.onmouseup	= stop;


function start() {
	e = window.event;
	startX = e.clientX - 10;
	startY = e.clientY - 10;

	if (drawMode == 'select'){
		selectedObjs.splice(0);
		for(var i = 0; i < objArr.length; i++){
			isObjSelected(objArr[i], startX, startY);
		}
		showPropertyEdit();
	}
	else if (drawMode == 'drawLine' || drawMode == 'drawRect' || drawMode == 'drawEllip'){
		myContext.moveTo(startX, startY);
		drawing = true;
	}
}

function draw(me) {
	if (drawing && drawMode == 'drawLine') {

	}
	else if (drawing && drawMode == 'drawRect'){
		redrawAll();
		drawRectangle(returnTempRect(me, startX, startY));
	}
	else if (drawing && drawMode == 'drawEllip'){
		redrawAll();
		drawEllipse(returnTempEllipse(me, startX, startY));
	}
}

function stop(me) {
	if (drawMode == 'drawLine'){

	}
	else if (drawMode == 'drawRect'){
		// 뗀 좌표로 만들기
		var curX = me.offsetX;
		var curY = me.offsetY;

		// 사각형 도형 객체 생성, 도형 배열에 추가
		var resultObj = new ShapeObj("Rectangle", new coord(startX, startY), new coord(curX, curY), myContext.strokeStyle, myContext.fillStyle, objID++);
		objArr.push(resultObj);

		// 도형이 추가됐으면 자연스럽게 해당 도형 선택하기
		selectedObjs.splice(0);
		selectedObjs.push(resultObj);
		updateProperty(resultObj);
		showPropertyEdit();

	}
	else if (drawMode == 'drawEllip'){
		// 뗀 좌표로 만들기
		var curX = me.offsetX;
		var curY = me.offsetY;

		// 사각형 도형 객체 생성, 도형 배열에 추가
		var resultObj = new ShapeObj("Ellipse", new coord(startX, startY), new coord(curX, curY), myContext.strokeStyle, myContext.fillStyle, objID++);
		objArr.push(resultObj);

		// 도형이 추가됐으면 자연스럽게 해당 도형 선택하기
		selectedObjs.splice(0);
		selectedObjs.push(resultObj);
		updateProperty(resultObj);
		showPropertyEdit();
	}

	// 다시 그리기
	redrawAll();
	drawing = false;
	// 기본 상태인 select 모드로 돌아가기
	document.getElementsByName('mode')[0].checked = true;
	selectMode('select');
}

// 라디오버튼으로 모드 선택
function selectMode(mode){
	drawMode = mode;
}

// 속성창에 입력한 값을 객체에 업데이트 (controller -> model)
function editPropValue(type){
	if (type == 'centerX'){
		selectedObjs[0].centerpoint.x = parseFloat(document.getElementById('editor-property-centerX').value);
	}
	else if (type == 'centerY'){
		selectedObjs[0].centerpoint.y = parseFloat(document.getElementById('editor-property-centerY').value);
	}
	else if (type == 'width'){
		selectedObjs[0].width = parseFloat(document.getElementById('editor-property-width').value);
	}
	else if (type == 'height'){
		selectedObjs[0].height = parseFloat(document.getElementById('editor-property-height').value);
	}
	else if (type == 'bordercolor'){
		selectedObjs[0].bordercolor = document.getElementById('editor-property-bordercolor').value;
	}
	else if (type == 'fillcolor'){
		selectedObjs[0].fillcolor = document.getElementById('editor-property-fillcolor').value;
	}
	rearrangeFramePoint(selectedObjs[0]);
	redrawAll();
}


// 선택된 객체 삭제
function deleteObj(){
	Model_deleteObj();
	showPropertyEdit();
	redrawAll();
}


// obj를 가장 앞으로 보내기 (id 값은 맨 뒤로)
function zOrderFirst(){
	Model_zOrderFirst()
	redrawAll();
}

// obj를 가장 뒤로 보내기 (id 값은 맨 앞으로)
function zOrderLast(){
	Model_zOrderLast()
	redrawAll();
}
