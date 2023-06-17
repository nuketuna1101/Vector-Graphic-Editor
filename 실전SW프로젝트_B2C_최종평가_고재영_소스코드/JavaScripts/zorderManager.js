/*
	zorderManager.js
	z-order 핸들링
	- 맨 위로 보내기
	- 맨 아래로 보내기
	- 한 레이어 위로
	- 한 레이어 아래로
*/


// obj를 가장 앞으로 보내기 (id 값은 맨 뒤로)
function zOrderFirst(){
	Model_zOrderFirst()
	redrawAll(editor.getCtx());
}

// obj를 가장 뒤로 보내기 (id 값은 맨 앞으로)
function zOrderLast(){
	Model_zOrderLast()
	redrawAll(editor.getCtx());
}

// obj를 한 레이어 앞으로 보내기 (id 값은 맨 뒤로)
function zOrderOneLayerUp(){
	Model_zOrderOneLayerUp()
	redrawAll(editor.getCtx());
}

// obj를 한 레이어 뒤로 보내기 (id 값은 맨 앞으로)
function zOrderOneLayerDown(){
	Model_zOrderOneLayerDown()
	redrawAll(editor.getCtx());
}

// 선택된 도형객체를 가장 앞으로 보내기
function Model_zOrderFirst(){
	var index = findSObjIndex();
	objArr.push(objArr[index]);
	objArr.splice(index, 1);
}

// 선택된 도형객체를 맨뒤로 보내기
function Model_zOrderLast(){
	var index = findSObjIndex();
	objArr.unshift(objArr[index++]);
	objArr.splice(index, 1);
}

// 선택된 도형객체를 한 레이어 앞으로 보내기
function Model_zOrderOneLayerUp(){
	var index = findSObjIndex();

	if (objArr.length == 1 || index == objArr.length - 1)
		return;
	else {
		var tmp = objArr[index];
		objArr[index] = objArr[index + 1];
		objArr[index + 1] = tmp;
	}
}

// 선택된 도형객체를 한 레이어 뒤로 보내기
function Model_zOrderOneLayerDown(){
	var index = findSObjIndex();
	
	if (objArr.length == 1 || index == 0)
		return;
	else {
		var tmp = objArr[index - 1];
		objArr[index - 1] = objArr[index];
		objArr[index] = tmp;
	}
}