/*
	:: 2차 리팩토링

	Z-ORDER에 관련한 데이터 처리 코드만 모으기

	Z-ORDER의 조작은 controller에 있음.
*/

// 전체 도형객체 안에서 현재 선택된 객체의 index값 찾기
function findSObjIndex(){
	var index = -1;
	for(var i = 0; i < objArr.length; i++){
		if (objArr[i].ID == selectedObjs[0].ID)
			index = i;
	}
	return index;
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
