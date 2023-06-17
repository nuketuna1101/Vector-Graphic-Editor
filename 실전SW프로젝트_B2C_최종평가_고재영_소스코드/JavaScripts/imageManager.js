/*
	이미지 넣기

*/


class ModeImage {
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
			Factory.createRectangle(this.startX, this.startY, this.curX, this.curY, new ObjStyle(defaultBorderColor, defaultFillColor)).draw(editor.getCtx());
			console.log('Rect: onMouseMove');
		}		
	}

	onMouseUp() {
		// 뗀 좌표로 만들기
		this.endX = window.event.offsetX;
		this.endY = window.event.offsetY;
		// 생성
		var newObj = Factory.createRectangle(this.startX, this.startY, this.endX, this.endY, new ObjStyle(defaultBorderColor, defaultFillColor));
		// 마우스 누른 상태 플래그 변수 회수
		this.isMouseDown = false;
		// 데이터 처리
		updateDataAfterCreate(newObj);
		// 캔버스 다시그리기
		redrawAll(editor.getCtx());
		// 속성창
		updatePropEditAfterCreate();

		// var input = window.event.target;
		// var reader = new FileReader();
		// reader.readAsDataURL(input.files[0]);
		// editor.getCtx().drawImage(image, 100, 100);

		// var data = editor.getCanvas().readAsDataURL();
		// var img = document.querySelector('#my-img');
		// img.src = data;

		var reader = new FileReader();
		var image = new Image();
		image.onload = () => {
    	// 콘텍스트로 캔버스에 그리기
			editor.getCtx().drawImage(image, 0, 0);
		};
		reader.onload = function(e) {
			image.src = e.target.result;
		};

		// 파일을 Data URL로 읽기
		reader.readAsDataURL();

		

	}
}


// function loadImage(event) {
// 	var input = event.target;
// 	if (input.files && input.files[0]) {
// 		var reader = new FileReader();

// 		reader.onload = function(e) {
//           // 이미지 객체 생성
// 			var image = new Image();

//           // 이미지 로드 완료 시 호출되는 함수
// 			image.onload = function() {
//             // 이미지 그리기
// 				editor.getCtx().drawImage(image, 100, 100);
// 			};

//           // 이미지 소스 설정
// 			image.src = e.target.result;
// 		};

//         // 파일을 Data URL로 읽기
// 		reader.readAsDataURL(input.files[0]);
// 	}
// }

// document.getElementById('mm_image').addEventListener('onclick', loadImage);


const modeImage = new ModeImage();
