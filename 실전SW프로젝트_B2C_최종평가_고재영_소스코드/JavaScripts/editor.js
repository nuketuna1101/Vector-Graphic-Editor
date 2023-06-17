/*
	editor.js

	전반적인 그래픽 에디터의 컨트롤 부분
	- State 패턴 이용해서 모드에 따라 다른 마우스 이벤트 구현
*/

class GraphicEditor {
	constructor() {
		this.canvas = document.getElementById("myCanvas");
		this.canvas.width = 800;
		this.canvas.height = 600;
		this.ctx = this.canvas.getContext('2d');
		this.currentTool = null;
		this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	getCanvas(){
		return this.canvas;
	}

	getCtx(){
		return this.ctx;
	}

	setState(mode) {
		this.curMode = mode;
	}

	onMouseDown() {
		if (this.curMode) {
			this.curMode.onMouseDown();
		}
	}

	onMouseUp() {
		if (this.curMode) {
			this.curMode.onMouseUp();
		}
		returnToSelect();
	}

	onMouseMove() {
		if (this.curMode) {
			this.curMode.onMouseMove();
		}
	}
}

class ModeSelect {
	/*
		선택 모드 일때, (기본 모드 상태)
	*/
	onMouseDown() {
		console.log('Select: onMouseDown');
		/*
			현재 누른 좌표 기준으로 선택 대상 탐색 ... 1) 객체가 선택됨 / 2) control point가 선택됨 / 3) 아무것도 선택되지 않음
		*/

		// 최초 누른 좌표
		this.startX = window.event.clientX - editor.getCanvas().getBoundingClientRect().left;
		this.startY = window.event.clientY - editor.getCanvas().getBoundingClientRect().top;


		if (selectedObjs.length < 2){
			console.log('Select: onMouseDown  :::: 1');

			selectSingleObj(this.startX, this.startY);

		}
		else if (selectedObjs.length >= 2){
			console.log('Select: onMouseDown ::::: 2');
			if (!isHitAlready(this.startX, this.startY))
				selectSingleObj(this.startX, this.startY);
		}

		this.isSelected = true;

	}

	onMouseMove() {
		console.log('Select: onMouseMove');
		/*
			1-1. 선택된 상태면, 마우스 이동하는 것 따라서 객체도 위치 이동 미리보기
			1-2. 선택 안 된 상태면, 다중 선택을 위한 영역 표시
		*/

		// 현재 진행 중인 좌표로 만들기
		// this.curX = window.event.offsetX;
		// this.curY = window.event.offsetY;
		this.curX = window.event.clientX - editor.getCanvas().getBoundingClientRect().left;
		this.curY = window.event.clientY - editor.getCanvas().getBoundingClientRect().top;

		var tmpDirX = this.curX - this.startX;
		var tmpDirY = this.curY - this.startY;

		// 캔버스 다시그리기
		redrawAll(editor.getCtx());
		// 선택된 상태면 선택된 애 이동시키는거 그려주기
		if (this.isSelected && selectedObjs.length != 0){
			selectedObjs.forEach(function (selectedObj){
				//selectedObj.move(tmpDirX, tmpDirY);
				/*
					move 쓰면 안됨 반영하지 않고 뷰에서만 보도록 해야됨
				*/

				selectedObj.draw(editor.getCtx());
			});
		}
		else if (this.isSelected && selectedObjs.length == 0){
			// 선택 안된 상태 >> 다중 선택을 위한 영역 전개
			Factory.createRectangle(this.startX, this.startY, this.curX, this.curY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth)).draw(editor.getCtx());

		}
	}

	onMouseUp() {
		console.log('Select: onMouseUp');
		/*
			1-1. 선택된 상태면, 내려놓기
			1-2. 선택 안 된 상태면, 해당 영역까지 다중 선택

			액션이 끝난 후엔, 속성창 처리
		*/
		this.curX = window.event.offsetX;
		this.curY = window.event.offsetY;

		var tmpDirX = this.curX - this.startX;
		var tmpDirY = this.curY - this.startY;

		if (this.isSelected && selectedObjs.length != 0){
			// 선택되어 있던 객체들을 이동시켜 내려놓기
			selectedObjs.forEach(function (selectedObj){
				selectedObj.move(tmpDirX, tmpDirY);
				selectedObj.draw(editor.getCtx());
				selectedObj.updateCPs();
				selectedObj.showProps();
			});
		}
		else if (this.isSelected && selectedObjs.length == 0){
			// 전개한 영역 내부에 객체 선택하기
			/*
			전개된 영역 내부에 객체 탐색, 해당되는 객체들 모두 선택. case: 0개, 1개, 여러개
			여러 개가 selectedobjs에 할당되면서 각각에 대한 control point도 보여줌
			*/
			selectObjsInArea(this.startX, this.startY, this.curX, this.curY);
		}
		this.isSelected = false;
		updatePropEdit();

	}
}

class ModeLine {
	/*
		onmousedown의 시작좌표와 onmouseup의 끝좌표를 통해 line 객체 생성

		isMouseDown은 마우스를 누른 상태에 대한 플래그 변수
	*/
	onMouseDown() {
		// 최초 누른 좌표
		this.startX = window.event.clientX - editor.getCanvas().getBoundingClientRect().left;
		this.startY = window.event.clientY - editor.getCanvas().getBoundingClientRect().top;
		// 시작점 좌표
		editor.getCtx().moveTo(this.startX, this.startY);
		console.log('Line: onMouseDown', this.startX, this.startY);
		// 마우스 누른 상태 플래그 변수
		this.isMouseDown = true;
	}

	onMouseMove() {
		// 마우스를 누른 상태로 드래그한 경우에만
		if (this.isMouseDown){
			// 현재 진행 중인 좌표로 만들기
			this.curX = window.event.offsetX;
			this.curY = window.event.offsetY;
			// 캔버스 다시 그리기
			redrawAll(editor.getCtx());
			// 현재 객체 생성 전 미리 보여주기
			Factory.createLine(this.startX, this.startY, this.curX, this.curY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth)).draw(editor.getCtx());
			console.log('Line: onMouseMove');
		}
	}

	onMouseUp() {
		/*
			- 도형 생성하기.
			- 생성과 동시에 뷰 처리 : 캔버스 다시 그리기, 속성창 갱신
			- 생성과 동시에 데이터 처리 : 관리 배열 처리
		*/
		// 뗀 좌표로 만들기
		this.endX = window.event.offsetX;
		this.endY = window.event.offsetY;
		// 생성
		var newObj = Factory.createLine(this.startX, this.startY, this.endX, this.endY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth));
		// 마우스 누른 상태 플래그 변수 회수
		this.isMouseDown = false;
		// 데이터 처리
		updateDataAfterCreate(newObj);
		// 캔버스 다시그리기
		redrawAll(editor.getCtx());
		// 속성창
		updatePropEditAfterCreate();
	}
}

class ModeRect {
	/*
		onmousedown의 시작좌표와 onmouseup의 끝좌표를 통해 rectangle 객체 생성
	*/
	constructor(){
		this.startX = null;
		this.startY = null;
		this.endX = null;
		this.endY = null;
	}

	onMouseDown() {
		// 최초 누른 좌표
		this.startX = window.event.clientX - editor.getCanvas().getBoundingClientRect().left;
		this.startY = window.event.clientY - editor.getCanvas().getBoundingClientRect().top;
		// 시작점 좌표
		editor.getCtx().moveTo(this.startX, this.startY);
		console.log('Rect: onMouseDown', this.startX, this.startY);
		// 마우스 누른 상태 플래그 변수
		this.isMouseDown = true;
	}

	onMouseMove() {
		// 마우스를 누른 상태로 드래그한 경우에만
		if (this.isMouseDown){
			// 현재 진행 중인 좌표로 만들기
			this.curX = window.event.offsetX;
			this.curY = window.event.offsetY;
			// 캔버스 다시 그리기
			redrawAll(editor.getCtx());
			// 현재 객체 생성 전 미리 보여주기
			Factory.createRectangle(this.startX, this.startY, this.curX, this.curY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth)).draw(editor.getCtx());
			console.log('Rect: onMouseMove');
		}		
	}

	onMouseUp() {
		// 뗀 좌표로 만들기
		this.endX = window.event.offsetX;
		this.endY = window.event.offsetY;
		// 생성
		var newObj = Factory.createRectangle(this.startX, this.startY, this.endX, this.endY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth));
		// 마우스 누른 상태 플래그 변수 회수
		this.isMouseDown = false;
		// 데이터 처리
		updateDataAfterCreate(newObj);
		// 캔버스 다시그리기
		redrawAll(editor.getCtx());
		// 속성창
		updatePropEditAfterCreate();		
	}
}

class ModeEll {
	/*
		onmousedown의 시작좌표와 onmouseup의 끝좌표를 통해 ellipse 객체 생성
	*/
	constructor(){
		this.startX = null;
		this.startY = null;
		this.endX = null;
		this.endY = null;
	}

	onMouseDown() {
		// 최초 누른 좌표
		this.startX = window.event.clientX - editor.getCanvas().getBoundingClientRect().left;
		this.startY = window.event.clientY - editor.getCanvas().getBoundingClientRect().top;
		// 시작점 좌표
		editor.getCtx().moveTo(this.startX, this.startY);
		console.log('Ell: onMouseDown', this.startX, this.startY);
		// 마우스 누른 상태 플래그 변수
		this.isMouseDown = true;
	}

	onMouseMove() {
		// 마우스를 누른 상태로 드래그한 경우에만
		if (this.isMouseDown){
			// 현재 진행 중인 좌표로 만들기
			this.curX = window.event.offsetX;
			this.curY = window.event.offsetY;
			// 캔버스 다시 그리기
			redrawAll(editor.getCtx());
			// 현재 객체 생성 전 미리 보여주기
			Factory.createEllipse(this.startX, this.startY, this.curX, this.curY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth)).draw(editor.getCtx());
			console.log('Ell: onMouseMove');
		}
	}

	onMouseUp() {
		// 뗀 좌표로 만들기
		this.endX = window.event.offsetX;
		this.endY = window.event.offsetY;
		// 생성
		var newObj = Factory.createEllipse(this.startX, this.startY, this.endX, this.endY, new ObjStyle(defaultBorderColor, defaultFillColor, defaultBorderWidth));
		// 마우스 누른 상태 플래그 변수 회수
		this.isMouseDown = false;
		// 데이터 처리
		updateDataAfterCreate(newObj);
		// 캔버스 다시그리기
		redrawAll(editor.getCtx());
		// 속성창
		updatePropEditAfterCreate();			
	}
}

class ModeText {
	/*
		onmousedown의 시작좌표와 onmouseup의 끝좌표를 통해 rectangle 객체 생성
	*/
	constructor(){
		this.startX = null;
		this.startY = null;
		this.endX = null;
		this.endY = null;
	}

	onMouseDown() {
		// 최초 누른 좌표
		this.startX = window.event.clientX - editor.getCanvas().getBoundingClientRect().left;
		this.startY = window.event.clientY - editor.getCanvas().getBoundingClientRect().top;
		// 시작점 좌표
		editor.getCtx().moveTo(this.startX, this.startY);
		console.log('Rect: onMouseDown', this.startX, this.startY);
		// 마우스 누른 상태 플래그 변수
		this.isMouseDown = true;
	}

	onMouseMove() {
		// 마우스를 누른 상태로 드래그한 경우에만
		if (this.isMouseDown){
			// 현재 진행 중인 좌표로 만들기
			this.curX = window.event.offsetX;
			this.curY = window.event.offsetY;
			// 캔버스 다시 그리기
			redrawAll(editor.getCtx());
			// 현재 객체 생성 전 미리 보여주기
			Factory.createRectangle(this.startX, this.startY, this.curX, this.curY, new ObjStyle(defaultBorderColor, transparentFillColor)).draw(editor.getCtx());
			console.log('Rect: onMouseMove');
		}		
	}

	onMouseUp() {
		// 뗀 좌표로 만들기
		this.endX = window.event.offsetX;
		this.endY = window.event.offsetY;
		// 생성
		var newObj = Factory.createTextbox(this.startX, this.startY, this.endX, this.endY, new ObjStyle(defaultBorderColorTextbox, transparentFillColor), defaultText, defaultFontStyle, defaultFontSize);
		// 마우스 누른 상태 플래그 변수 회수
		this.isMouseDown = false;
		// 데이터 처리
		updateDataAfterCreate(newObj);
		// 캔버스 다시그리기
		redrawAll(editor.getCtx());
		// 속성창
		updatePropEditAfterCreate();
	}

}

// 
const editor = new GraphicEditor();

const modeSelect = new ModeSelect();
const modeLine = new ModeLine();
const modeRect = new ModeRect();
const modeEll = new ModeEll();
const modeText = new ModeText();