/*
	dataManager.js
	그래픽 에디터의 도형 객체의 모델 데이터 정의

	- 도형 객체 클래스 정의
	- 추상 클래스 AbstractShape을 통한 도형 객체들의 상속
	- abstract factory 패턴을 통하여 도형 객체 생성
*/


/*
	생성되는 전체 도형 객체 관리와 현시점 선택된 객체 관리
	관리할 글로벌 배열
	objArr				:: 전체 도형 객체
	selectedObjs		:: 선택된 도형 객체
*/
var objArr = new Array();
var selectedObjs = new Array();

/*
	도형과 관련한 클래스들
*/
class AbstractShape {
	/*
		전체 도형 객체들을 위한 부모 역할의 추상 클래스
	*/
	constructor(cx, cy, width, height, objStyle){
		this.cx = cx;
		this.cy = cy;
		this.width = width;
		this.height = height;
		this.borderColor = objStyle.borderColor;
		this.fillColor = objStyle.fillColor;
		this.borderWidth = objStyle.borderWidth;
		this.maxX = this.cx + this.width/2;
		this.minX = this.cx - this.width/2;
		this.maxY = this.cy + this.height/2;
		this.minY = this.cy - this.height/2;
		this.cps = [
			{x: this.cx - this.width / 2, y: this.cy - this.height / 2},
			{x: this.cx + this.width / 2, y: this.cy - this.height / 2},
			{x: this.cx - this.width / 2, y: this.cy + this.height / 2},
			{x: this.cx + this.width / 2, y: this.cy + this.height / 2},
			{x: this.cx				    , y: this.cy - this.height / 2},
			{x: this.cx				    , y: this.cy + this.height / 2},
			{x: this.cx - this.width / 2, y: this.cy                  },
			{x: this.cx + this.width / 2, y: this.cy                  }
			];
	}

	move(dx, dy){
		this.cx += dx;
		this.cy += dy;
	}

	updateCPs(){
		this.cps = [
			{x: this.cx - this.width / 2, y: this.cy - this.height / 2},
			{x: this.cx + this.width / 2, y: this.cy - this.height / 2},
			{x: this.cx - this.width / 2, y: this.cy + this.height / 2},
			{x: this.cx + this.width / 2, y: this.cy + this.height / 2},
			{x: this.cx				    , y: this.cy - this.height / 2},
			{x: this.cx				    , y: this.cy + this.height / 2},
			{x: this.cx - this.width / 2, y: this.cy                  },
			{x: this.cx + this.width / 2, y: this.cy                  }
			];
	}

	isFoundinArea(ax1, ay1, ax2, ay2){
		/*
			두 점의 좌표로 이루어지는 직사각형 영역 안에서, 해당 객체를 찾을 수 있는가
		*/
		var minAX = Math.min(ax1, ax2);
		var minAY = Math.min(ay1, ay2);
		var maxAX = Math.max(ax1, ax2);
		var maxAY = Math.max(ay1, ay2);

		if (this.minX >= minAX && this.maxX <= maxAX && this.minY >= minAY && this.maxY <= maxAY)
			return true;
		else
			return false;
	}	

	draw(context){}
	isFound(x, y){}
	getSelectType(){}
	showProps(){}
	updateProps(){}
}

class Line extends AbstractShape{
	constructor(cx, cy, x1, y1, x2, y2, objStyle){
		super(cx, cy, null, null, objStyle);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;		
		this.borderColor = objStyle.borderColor;
		// this.borderWidth = objStyle.borderWidth;
	}

	move(dx, dy){
		this.cx += dx;
		this.cy += dy;
		this.x1 += dx;
		this.x2 += dx;
		this.y1 += dy;
		this.y2 += dy;
	}

	draw(context){
		/*
			캔버스에 해당 객체 그리기
		*/
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderWidth;

		context.beginPath();
		context.moveTo(this.x1, this.y1);
		context.lineTo(this.x2, this.y2);
		context.stroke();
	}

	isFound(x, y){
		/*
			x, y 좌표 점이 눌렸을 때, line 객체를 찾으면 반환.
			단, line을 누르기 어렵기 때문에 threshold값 이내 범위 클릭 허용
		*/
		var threshold = 25;
		var nearestLine = null;
		var distance = pointToLineDistance(x, y, this.x1, this.y1, this.x2, this.y2);
   		// 거리가 최소인 것 갱신
		if (distance < threshold) {
			nearestLine = this;
		}
		console.log(":: line find ::", nearestLine);
		return nearestLine;
	}

	getSelectType(){
		return "line";
	}

	showProps(){
		/*
			객체가 가진 속성값들을 ui에 넘겨주기
		*/
		document.getElementById('editor_property_x1').value = this.x1;
		document.getElementById('editor_property_y1').value = this.y1;
		document.getElementById('editor_property_x2').value = this.x2;
		document.getElementById('editor_property_y2').value = this.y2;
		document.getElementById('editor_property_borderwidth').value = this.borderWidth;
		document.getElementById('editor_property_bordercolor').value = this.borderColor;
	}

	updateProps(){
		/*
			dom에 있는 속성값을 객체에 직접 적용시켜주기
		*/
		this.x1 = parseFloat(document.getElementById('editor_property_x1').value);
		this.y1 = parseFloat(document.getElementById('editor_property_y1').value);
		this.x2 = parseFloat(document.getElementById('editor_property_x2').value);
		this.y2 = parseFloat(document.getElementById('editor_property_y2').value);
		this.borderWidth = parseFloat(document.getElementById('editor_property_borderwidth').value);
		this.borderColor = document.getElementById('editor_property_bordercolor').value;
	}

}


class Rectangle extends AbstractShape{
	draw(context){
		context.strokeStyle = this.borderColor;
		context.fillStyle = this.fillColor;
		context.lineWidth = this.borderWidth;

		context.beginPath();
		context.fillRect(this.cx - this.width/2, this.cy - this.height/2, this.width, this.height);
		context.strokeRect(this.cx - this.width/2, this.cy - this.height/2, this.width, this.height);
		context.closePath();
		context.stroke();
	}

	isFound(x, y){
		/*
			사각형 객체 찾기
		*/
		if (x >= this.cx - this.width/2 && x <= this.cx + this.width/2 && y >= this.cy - this.height/2 && y <= this.cy + this.height/2)
			return true;
		else
			return false;
	}
	
	getSelectType(){
		return "rect";
	}

	showProps(){
		/*
			객체가 가진 속성값들을 ui에 넘겨주기
		*/
		document.getElementById('editor_property_centerX').value = this.cx;
		document.getElementById('editor_property_centerY').value = this.cy;
		document.getElementById('editor_property_width').value = this.width;
		document.getElementById('editor_property_height').value = this.height;
		document.getElementById('editor_property_bordercolor').value = this.borderColor;
		document.getElementById('editor_property_borderwidth').value = this.borderWidth;
		document.getElementById('editor_property_fillcolor').value = this.fillColor;
	}

	updateProps(){
		/*
			dom에 있는 속성값을 객체에 직접 적용시켜주기
		*/
		this.cx = parseFloat(document.getElementById('editor_property_centerX').value);
		this.cy = parseFloat(document.getElementById('editor_property_centerY').value);
		this.width = parseFloat(document.getElementById('editor_property_width').value);
		this.height = parseFloat(document.getElementById('editor_property_height').value);
		this.borderWidth = parseFloat(document.getElementById('editor_property_borderwidth').value);
		this.borderColor = document.getElementById('editor_property_bordercolor').value;
		this.fillColor = document.getElementById('editor_property_fillcolor').value;
	}
}

class Ellipse extends AbstractShape{
	draw(context){
		context.strokeStyle = this.borderColor;
		context.fillStyle = this.fillColor;
		context.lineWidth = this.borderWidth;

		context.beginPath();
		context.ellipse(this.cx, this.cy, this.width/2, this.height/2, 0, 0, Math.PI * 2);
		context.fill();
		context.closePath();
		context.stroke();
	}

	isFound(x, y){
		/*
			타원 객체 찾기
		*/
		if (((x - this.cx)**2) / ((this.width/2)**2) + ((y - this.cy)**2) / ((this.height/2)**2) <= 1)
			return true;
		else
			return false;
	}

	getSelectType(){
		return "ellipse";
	}

	showProps(){
		/*
			객체가 가진 속성값들을 ui에 넘겨주기
		*/
		document.getElementById('editor_property_centerX').value = this.cx;
		document.getElementById('editor_property_centerY').value = this.cy;
		document.getElementById('editor_property_width').value = this.width;
		document.getElementById('editor_property_height').value = this.height;
		document.getElementById('editor_property_bordercolor').value = this.borderColor;
		document.getElementById('editor_property_borderwidth').value = this.borderWidth;
		document.getElementById('editor_property_fillcolor').value = this.fillColor;
	}

	updateProps(){
		/*
			dom에 있는 속성값을 객체에 직접 적용시켜주기
		*/
		this.cx = parseFloat(document.getElementById('editor_property_centerX').value);
		this.cy = parseFloat(document.getElementById('editor_property_centerY').value);
		this.width = parseFloat(document.getElementById('editor_property_width').value);
		this.height = parseFloat(document.getElementById('editor_property_height').value);
		this.borderWidth = parseFloat(document.getElementById('editor_property_borderwidth').value);
		this.borderColor = document.getElementById('editor_property_bordercolor').value;
		this.fillColor = document.getElementById('editor_property_fillcolor').value;
	}	
}

class Textbox extends AbstractShape {
	constructor(cx, cy, width, height, objStyle, text, fontStyle, fontSize) {
		super(cx, cy, width, height, objStyle);
		this.text = text;
		this.fontStyle = fontStyle;
		this.fontSize = fontSize;
	}

	draw(context) {
		context.strokeStyle = this.borderColor;
		context.fillStyle = this.fillColor;
		//context.font = "12px Arial";
		context.font = this.fontSize + ' ' + this.fontStyle;
		context.textAlign = "center";

		context.beginPath();
		context.fillRect(this.cx - this.width / 2, this.cy - this.height / 2, this.width, this.height);
		context.strokeRect(this.cx - this.width / 2, this.cy - this.height / 2, this.width, this.height);
		context.closePath();
		context.stroke();

		context.fillStyle = "black";
		context.fillText(this.text, this.cx, this.cy);
	}

	isFound(x, y) {
		if (x >= this.cx - this.width / 2 && x <= this.cx + this.width / 2 && y >= this.cy - this.height / 2 &&	y <= this.cy + this.height / 2)
			return true;
		else
			return false;
	}

	getSelectType(){
		return "text";
	}

	showProps(){
		/*
			객체가 가진 속성값들을 ui에 넘겨주기
		*/
		document.getElementById('editor_property_centerX').value = this.cx;
		document.getElementById('editor_property_centerY').value = this.cy;
		document.getElementById('editor_property_width').value = this.width;
		document.getElementById('editor_property_height').value = this.height;

		document.getElementById('editor_property_text').value = this.text;
		showfontStyle(this.fontStyle);
		showfontSize(this.fontSize);
	}

	updateProps(){
		/*
			dom에 있는 속성값을 객체에 직접 적용시켜주기
		*/
		this.cx = parseFloat(document.getElementById('editor_property_centerX').value);
		this.cy = parseFloat(document.getElementById('editor_property_centerY').value);
		this.width = parseFloat(document.getElementById('editor_property_width').value);
		this.height = parseFloat(document.getElementById('editor_property_height').value);

		this.text = document.getElementById('editor_property_text').value;
		this.fontStyle = returnfontStyle(this.fontStyle);
		this.fontSize = returnfontSize(this.fontSize);
	}	
}

/*
	도형 클래스 생성하는 팩토리
*/

class Factory {
	static createLine(x1, y1, x2, y2, objStyle){
		var cx = (x1 + x2) / 2;
		var cy = (y1 + y2) / 2;

		return new Line(cx, cy, x1, y1, x2, y2, objStyle);
	}

	static createRectangle(x1, y1, x2, y2, objStyle){
		var cx = (x1 + x2) / 2;
		var cy = (y1 + y2) / 2;
		var width = Math.abs(x1 - x2);
		var height = Math.abs(y1 - y2);

		return new Rectangle(cx, cy, width, height, objStyle);
	}

	static createEllipse(x1, y1, x2, y2, objStyle){
		var cx = (x1 + x2) / 2;
		var cy = (y1 + y2) / 2;
		var width = Math.abs(x1 - x2);
		var height = Math.abs(y1 - y2);

		return new Ellipse(cx, cy, width, height, objStyle);
	}

	static createTextbox(x1, y1, x2, y2, objStyle, text, fontStyle, fontSize){
		var cx = (x1 + x2) / 2;
		var cy = (y1 + y2) / 2;
		var width = Math.abs(x1 - x2);
		var height = Math.abs(y1 - y2);

		return new Textbox(cx, cy, width, height, objStyle, text, fontStyle, fontSize);
	}
}

class ObjStyle {
	/*
		도형 객체의 스타일 속성은 따로 ObjStyle이란 클래스로 관리
	*/
	constructor(borderColor, fillColor, borderWidth) {
		this.borderColor = borderColor;
		this.fillColor = fillColor;
		this.borderWidth = borderWidth;
	}
}