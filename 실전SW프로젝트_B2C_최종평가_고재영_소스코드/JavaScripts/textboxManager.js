/*
	textboxManager.js
	텍스트 관련
	- 디폴트값 선언
	- 텍스트 폰트 (글꼴과 폰트 사이즈) 양방향 관리 함수
*/

const defaultFontStyle = '궁서';
const defaultFontSize = '12px';
const defaultText = "Enter Text.";


function showfontStyle(style){
	/*
		fontstyle 데이터를 ui에 올리기
	*/
	const fontStyle = document.getElementById('editor_property_font');
	for (let i = 0; i < fontStyle.options.length; i++){  
		if(fontStyle.options[i].label == style){
			fontStyle.options[i].selected = true;
		}
	}
}

function showfontSize(size){
	/*
		fontsize 데이터를 ui에 올리기
	*/
	const fontSize = document.getElementById('editor_property_fontsize');
	for (let i = 0; i < fontSize.options.length; i++){  
		if(fontSize.options[i].label == size){
			fontSize.options[i].selected = true;
		}
	}
}

function returnfontStyle(style){
	const fontStyle = document.getElementById('editor_property_font');
	for (let i = 0; i < fontStyle.options.length; i++){  
		if(fontStyle.options[i].selected == true)
			return fontStyle.options[i].label;
	}
}

function returnfontSize(size){
	const fontSize = document.getElementById('editor_property_fontsize');
	for (let i = 0; i < fontSize.options.length; i++){  
		if(fontSize.options[i].selected == true)
			return fontSize.options[i].label;
	}
}