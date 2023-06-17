/*
	undoManager.js
	Undo, Redo 담당하는 부분
	Memento패턴 적용
	처리 요청 명령과 추가적인 상태 정보 관리하기 위해
*/

undoStack = new Array();
redoStack = new Array();

// 매번 undostack



// Memento 객체
class DrawingState {
	constructor(objArr) {
		this.objArr = objArr;
	}

	getState() {
		return this.objArr;
	}
}

// Originator 객체
class Drawing {
	constructor() {
		this.objArrs = [];
		this.undoStack = [];
		this.redoStack = [];
	}

	addShape(objArr) {
		this.objArrs.push(objArr);
    	// let state = JSON.stringify(this.objArr); // 상태 저장
    	let state = this.objArr;
    	this.undoStack.push(new DrawingState(state));
    }

    undo() {
    	if (this.undoStack.length > 1) {
    		let currentState = this.undoStack.pop();
    		this.redoStack.push(currentState);
    		let prevState = this.undoStack[this.undoStack.length - 1].getState();
      		this.shapes = JSON.parse(prevState); // 상태 복원
      	}
	}

    redo() {
      	if (this.redoStack.length > 0) {
      		let nextState = this.redoStack.pop().getState();
	      	this.shapes = JSON.parse(nextState); // 상태 복원
	     	let state = JSON.stringify(this.shapes); // 상태 저장
	     	this.undoStack.push(new DrawingState(state));
		}		
	}

	getShapes() {
		return this.shapes;
	}
}




