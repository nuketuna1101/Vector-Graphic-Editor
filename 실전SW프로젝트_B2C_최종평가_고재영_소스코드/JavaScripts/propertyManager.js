/*
	propertyManager.js
	객체 속성편집창에 대한 전반적인 관리
	- Observer 패턴을 적용하여 리팩토링하려 시도했으나 실패
	- 속성창과 관련하여서는 가장 모듈화가 떨어지는 단점
*/

tmp_mode = "unselect";

/*
	속성창 보여주는 코드

	속성창이 가지는 상태
	unselect, line, rect, ellipse, text, image, multi-select
*/

function updatePropEdit() {
	/*
		현재 모드에 따른 속성창 가시화하기

		- 선택된 것이 없을 때
		- 2개 이상 다중 선택 시
		- 단일 선택시
	*/
	if (selectedObjs.length == 0){
		tmp_mode = "unselect";
	}
	else if (selectedObjs.length > 1){
		tmp_mode = "multi-select";
	}
	else {
		tmp_mode = selectedObjs[0].getSelectType();
	}
	setEditorPropertyVisibility(tmp_mode);
}

class Subject {
	/*
		시간이 지남에 따라 가변하는 중요한 상태를 가진 객체로서의 subject
		여기서는, selectedObjs가 그에 해당할 것.
	*/
	constructor() {
		this._observers = [];
	}

	attach(observer) {
		this._observers.push(observer);
	}

	detach(observer) {
		this._observers = this._observers.filter(obs => observer !== obs);
	}

  	// Notify all observers
	notify() {
		this.observers.forEach(observer => observer.update(this));
	}

  	// Set rectangle properties and notify observers
	setProperties(width, height, color) {
		this.width = width;
		this.height = height;
		this.color = color;
		this.notify();
	}
}

class Observer {
	/*
		인터페이스 역할의 옵저버
		정보를 업데이트하는 역할
	*/
	constructor(state) {
		this.state = state;
		this.initialState = state;
	}

	update(change) {
		let state = this.state;
		switch (change) {
		case 'INC':
			this.state = ++state;
			break;
		case 'DEC':
			this.state = --state;
			break;
		default:
			this.state = this.initialState;
		}
	}
}

class PropertyPanel extends Observer {

	constructor() {
		super()
	}

	reactToEvent(event) {
	}
}
