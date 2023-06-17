/*
	canvasManager.js
	캔버스에 그리는 역할 전담

	- 캔버스의 기본값 설정들
	- 캔버스 전체 지우기
	- 현재 상태의 캔버스 전체 다시 그리기
*/

const defaultBorderColor = "#000000";
const defaultBorderColorTextbox = "#ffffff";
const defaultFillColor = "#ffffff";
const defaultBorderWidth = 1;
const transparentFillColor = 'rgba(255, 255, 255, 0.01)';


function clearCanvas(context){
	/*
		캔버스 뷰 전부 지워버리기
	*/
	context.clearRect(0, 0, editor.getCanvas().width, editor.getCanvas().height);
}

function redrawAll(context){
	/*
		저장된 도형 객체를 전부 다 그리기
		- 전체 캔버스를 싹 지운 후,
		- 저장 배열에서 모두 읽어오면서 그리고,
		- 선택된 개체 모두에 대해 control point 보여주기
	*/

	// 전체 캔버스 다 지우기
	clearCanvas(context);
	// 저장 배열에서 모두 읽어오기
	for(var i = 0; i < objArr.length; i++){
		objArr[i].draw(context);
	}
	// 선택되어 있는 객체들에 대해 cp점 가시화
	showSelectedCPs(context);
}

