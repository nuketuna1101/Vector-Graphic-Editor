/*
	cpManager.js
	컨트롤 포인트 관련 코드
*/


/*
	select되어서 변경될 때 마다 갱신시키기
	cp 데이터 갱신
	cp 가시화 갱신
*/


// 캔버스 컨텍스트의 색상 디폴트값으로 재지정
function setDefaultStyle(context){
	context.strokeStyle = defaultBorderColor;
	context.fillStyle = defaultFillColor;
	context.lineWidth = defaultBorderWidth;
}

function isCPselected(cps, x, y){
	/*
		클릭 좌표가 cp를 히트했는지
		클릭된 좌표와 cp점의 좌표 간의 계산
	*/
	var selectedCP = null;
	var threshold = 25;
	cps.forEach(function (cp){
		var distance = Math.sqrt((x - cp.x) * (x - cp.x) + (y - cp.y) * (y - cp.y));
		if (distance <= threshold)
			selectedCP = cp;
	});
	return selectedCP;
}

function showSelectedCPs(context){
	/*
		선택된 객체들에 대한 cp점들 가시화
	*/
	selectedObjs.forEach(function (obj){
		showCPs(obj.cps, context);
	});
}

function showCPs(cps, context){

	/*
		cp 점 해당하는 좌표 위에 그래픽 표현
		curCP에 해당하는 좌표들 차례로 그리게 하기
	*/
	cps.forEach(function (cp){
		drawCPpoint(cp.x, cp.y, context);
	});

}

function drawCPpoint(x, y, context){
	/*
		중심좌표 x,y인 cp 점 가시화
	*/
	setDefaultStyle(context);
	context.beginPath();
	context.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2);
	context.fill();
	context.closePath();
	context.stroke();
}