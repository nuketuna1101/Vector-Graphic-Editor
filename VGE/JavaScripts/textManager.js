/*
	Text 에 관련한 코드만 모음

	text 관련 세부 기능
	- 텍스트 font 설정
	- 텍스트 색상 설정
	- 텍스트의 외곽선 설정
	- 텍스트의 정렬 설정

*/

// 텍스트 관련 context의 기본값 선언
const defaultTextFont 		= "10px sans-serif";
const defaultTextAlign 		= "start";
const defaultTextBaseline 	= "alphabetic";
const defaultTextContents	= "EMPTY TEXTBOX";

// 텍스트 관련 기본값으로 돌리기
function setDefaultTextStyle(){
	myContext.font 			= defaultTextFont;
	myContext.textAlign 	= defaultTextAlign;
	myContext.textBaseline 	= defaultTextBaseline;
}

// 텍스트 객체 임시 생성 반환
function returnTempText(me, startX, startY){
	var curX = me.offsetX;
	var curY = me.offsetY;
	var tmp = new ShapeObj("Text", new coord(startX, startY), new coord(curX, curY), myContext.strokeStyle, myContext.fillStyle, -1);
	return tmp;
}

// 텍스트 객체 그리기
function drawText(textObj){
	// myContext.font 			= defaultTextFont;
	// myContext.textAlign 	= defaultTextAlign;
	// myContext.textBaseline 	= defaultTextBaseline;

    // 3-6. 텍스트+외곽선 그리기
	myContext.fillText("TYPING TEXT RIGHT NOW", 10, 150);
	myContext.strokeText("TYPING TEXT RIGHT NOW", 10, 150);
}



/*
	Text관련해서 그냥 TextBox란 객체는 Rectangle 객체의 특수한 경우로 생각하자.
	상속 같은 경우는 나중에 리팩토링 작업

*/


// 객체 임시 생성 반환
function returnTempTextBox(me, startX, startY){
	var curX = me.offsetX;
	var curY = me.offsetY;
	var tmp = new ShapeObj("TextBox", new coord(startX, startY), new coord(curX, curY), myContext.strokeStyle, myContext.fillStyle, -1);
	return tmp;
}

// 도형 객체 그리기
function drawTextBox(obj){
	myContext.strokeStyle = obj.bordercolor;
	myContext.fillStyle = obj.fillcolor;
	myContext.beginPath();
	myContext.fillRect(obj.centerpoint.x - obj.width/2, obj.centerpoint.y - obj.height/2, obj.width, obj.height);
	myContext.strokeRect(obj.centerpoint.x - obj.width/2, obj.centerpoint.y - obj.height/2, obj.width, obj.height);
	myContext.closePath();
	myContext.stroke();
}