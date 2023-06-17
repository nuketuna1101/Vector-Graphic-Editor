/*
	functions.js
	- 데이터와 계산 관련한 함수
	- 캔버스 이미지 다운로드나 삭제와 같이 직접 연결되는 버튼 액션 함수
*/

// 캔버스를 PNG로 다운로드
function downloadImg() {
	var download = document.getElementById("editor_download");
	var image = document.getElementById("myCanvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
	download.setAttribute("href", image);
	download.setAttribute("download","myImage.png");
}

// 선택된 객체 삭제
function deleteObj(){
	Model_deleteObj();
	redrawAll(editor.getCtx());
	updatePropEdit();
}

// 선택된 도형 객체 삭제(
function Model_deleteObj(){
	while (selectedObjs.length != 0){
		var index = findSObjIndex();
		objArr.splice(index, 1);
		selectedObjs.shift();
	}
}

//----------------------------------------------------

// 점과 선 사이의 거리 계산 함수 (포인트와 선분 사이의 거리 계산)
function pointToLineDistance(x, y, x1, y1, x2, y2) {
	var dot = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
	var lineLength = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
	var param = dot / lineLength;
	var xx, yy;

	if (param < 0) {
		xx = x1;
		yy = y1;
	} else if (param > 1) {
		xx = x2;
		yy = y2;
	} else {
		xx = x1 + param * (x2 - x1);
		yy = y1 + param * (y2 - y1);
	}

	var dx = x - xx;
	var dy = y - yy;
	return Math.sqrt(dx * dx + dy * dy);
}

function selectSingleObj(x, y){
	/*
		선택모드일 때 해당 좌표에 가장 최상위 z-order 객체 선택, 없을 시엔 아무것도 선택 x
		x, y 좌표가 눌렸을 때, 해당 좌표 점에서 가장 최상위 z-order 객체를 찾아서 반환해준다.
	*/
	selectedObjs.splice(0);
	for (var i = objArr.length - 1; i >= 0; i--){
		if (objArr[i].isFound(x, y)){
			selectedObjs.push(objArr[i]);
			//updateProperty(objArr[i]);
		}

		// 1개만 찾는 것이므로, push될 시에 종료
		if (selectedObjs.length == 1)
			break;
	}
}

function isHitAlready(x, y){
	// 이미 선택된 객체나 객체들 중 하나라도 또 선택되면 드래그 무브 상태로 진입할 수 있게 플래그
	for (var i = 0; i < selectedObjs.length; i++){
		//if (isObjSelected(selectedObjs[i], x, y))
		if (selectedObjs[i].isFound(x, y))
			return true;
	}
	return false;
}

function selectObjsInArea(ax1, ay1, ax2, ay2){
	selectedObjs.splice(0);
	objArr.forEach(function (element){
		// 해당 오브젝트가 영역 내에 있으면 추가해주기
		if (element.isFoundinArea(ax1, ay1, ax2, ay2)){
			selectedObjs.push(element);
		}
	});
}

// --------------------------------
// 전체 도형객체 안에서 현재 선택된 객체의 index값 찾기
function findSObjIndex(){
	var index = -1;
	for(var i = 0; i < objArr.length; i++){
		if (objArr[i] == selectedObjs[0])
			index = i;
	}
	return index;
}

function editPropValue(){
	/*
		dom 속성창에서 속성값 변화를 주었을 때,
		- 바뀐 데이터 적용
		- 바뀐 데이터에 따른 뷰 갱신
	*/
	selectedObjs[0].updateProps();
	selectedObjs[0].updateCPs();
}

function updateDataAfterCreate(obj){
	/*
		생성되었을 때, 데이터단에서 관리 처리
		- 생성된 객체 배열에 갱신해주고
		- 다시 기본 select 모드로 회귀
	*/
	// 관리 배열에 추가
	objArr.push(obj);
	// 생성과 동시에 선택되기
	selectedObjs.splice(0);
	selectedObjs.push(obj);
	// 다시 select 모드로 돌아가기
	editor.setState(modeSelect);
}

function updatePropEditAfterCreate(){
	updatePropEdit();
	selectedObjs[0].showProps();
}

// //----------------
// function save(){
// 	var canvasData = editor.getCanvas().toDataURL(); // 캔버스 데이터 URL로 변환
// 	localStorage.setItem('savedCanvas', canvasData); // 로컬 스토리지에 저장
// 	console.log('캔버스 상태가 저장되었습니다.');
// }

// function load(){
// 	var savedCanvasData = localStorage.getItem('savedCanvas'); // 로컬 스토리지에서 불러오기
// 	if (savedCanvasData) {
// 		var image = new Image();
// 		image.onload = function() {
// 			editor.getCtx().clearRect(0, 0, editor.getCanvas().width, editor.getCanvas().height); // 캔버스 초기화
// 			editor.getCtx().drawImage(image, 0, 0); // 이미지 그리기
// 			console.log('캔버스 상태가 불러와졌습니다.');
// 		};
// 		image.src = savedCanvasData;
// 	} else {
// 		console.log('저장된 캔버스 상태가 없습니다.');
// 	}	
// }