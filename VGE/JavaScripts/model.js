// MODEL :: 데이터 객체


// 배열로 도형 객체 저장하여 관리
var objArr = new Array();
var selectedObjs = new Array();
var objID = 0;
// ---	함수	---

// 관리해야하는 도형 오브젝트 생성자
function ShapeObj(type, startpoint, endpoint, bordercolor, fillcolor, ID){
	/*
	type: 도형 종류
	startpoint: 시작점
	endpoint: 끝점
	*/
	this.type = type;
	this.centerpoint = new coord((startpoint.x + endpoint.x)/2, (startpoint.y + endpoint.y)/2);
	this.width = Math.abs(startpoint.x - endpoint.x);
	this.height = Math.abs(startpoint.y - endpoint.y);
	this.bordercolor = bordercolor;
	this.fillcolor = fillcolor;
	this.ID = ID;

	this.framePoints = new Array(8);
	rearrangeFramePoint(this);

}

// x,y 좌표 좌표값
function coord(x, y){
	this.x = x;
	this.y = y;
}

// 도형객체 obj에 대해, (x, y)좌표 터치 시 선택하기
function isObjSelected(obj, x, y){
	if (obj.type == 'Rectangle'){
		if (x >= obj.centerpoint.x - obj.width/2 && x <= obj.centerpoint.x + obj.width/2 && y >= obj.centerpoint.y - obj.height/2 && y <= obj.centerpoint.y + obj.height/2){
			console.log("Rect object selected", obj.centerpoint.x);
			selectedObjs.push(obj);
			updateProperty(obj);
		}
	}
	else if (obj.type == 'Ellipse'){
		if(((x - obj.centerpoint.x)**2) / ((obj.width/2)**2) + ((y - obj.centerpoint.y)**2) / ((obj.height/2)**2) <= 1){
			console.log("Ellipse object selected", obj.centerpoint.x);
			selectedObjs.push(obj);
			updateProperty(obj);
		}
	}
}

// 선택된 도형 객체 삭제
function Model_deleteObj(){
	var index = -1;
	for(var i = 0; i < objArr.length; i++){
		if (objArr[i].ID == selectedObjs[0].ID)
			index = i;
	}
	objArr.splice(index, 1);
	selectedObjs.splice(0);
}

// 선택된 도형객체를 가장 앞으로 보내기
function Model_zOrderFirst(){
	var index = -1;
	for(var i = 0; i < objArr.length; i++){
		if (objArr[i].ID == selectedObjs[0].ID)
			index = i;
	}
	objArr.push(objArr[index]);
	objArr.splice(index, 1);
}

// 선택된 도형객체를 맨뒤로 보내기
function Model_zOrderLast(){
	var index = -1;
	for(var i = 0; i < objArr.length; i++){
		if (objArr[i].ID == selectedObjs[0].ID)
			index = i;
	}
	objArr.unshift(objArr[index++]);
	objArr.splice(index, 1);
}

function rearrangeFramePoint(ShapeObj){
	ShapeObj.framePoints[0] = new coord(ShapeObj.centerpoint.x - ShapeObj.width/2, ShapeObj.centerpoint.y - ShapeObj.height/2);
	ShapeObj.framePoints[1] = new coord(ShapeObj.centerpoint.x, ShapeObj.centerpoint.y - ShapeObj.height/2);
	ShapeObj.framePoints[2] = new coord(ShapeObj.centerpoint.x + ShapeObj.width/2, ShapeObj.centerpoint.y - ShapeObj.height/2);
	ShapeObj.framePoints[3] = new coord(ShapeObj.centerpoint.x - ShapeObj.width/2, ShapeObj.centerpoint.y);
	ShapeObj.framePoints[4] = new coord(ShapeObj.centerpoint.x + ShapeObj.width/2, ShapeObj.centerpoint.y);
	ShapeObj.framePoints[5] = new coord(ShapeObj.centerpoint.x - ShapeObj.width/2, ShapeObj.centerpoint.y + ShapeObj.height/2);
	ShapeObj.framePoints[6] = new coord(ShapeObj.centerpoint.x, ShapeObj.centerpoint.y + ShapeObj.height/2);
	ShapeObj.framePoints[7] = new coord(ShapeObj.centerpoint.x + ShapeObj.width/2, ShapeObj.centerpoint.y + ShapeObj.height/2);
}