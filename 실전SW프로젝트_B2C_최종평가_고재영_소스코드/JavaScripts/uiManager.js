/*
	uiManager.js
	UI 버튼의 상태 및 동작 관리
*/

var tmIds = ["tm_new", "tm_load", "tm_save", "tm_undo", "tm_redo", "tm_download"];
var mmIds = ["mm_select", "mm_line", "mm_rect", "mm_ellipse", "mm_text", "mm_image"];
var epIds = ["ep_delete", "ep_z_first", "ep_z_up", "ep_z_last", "ep_z_down"];

var fontList = ["맑은 고딕", "굴림", "돋움", "바탕", "궁서", "Arial", "Comic Sans MS", "Courier New", "Tahoma", "Times New Roman", "Verdana"];
var fontSizeList = ["8pt", "9pt", "10pt", "12pt", "16pt", "24pt", "36pt", "54pt", "80pt"];
var shadowList = ["none", "black", "grey", "white", "red", "green", "blue", "cyan", "magenta", "yellow"];


initTopMenu();
initModeMenu();
initEditorProperty();

function initTopMenu() {
	// 버튼 위치 지정
	for (i = 0; i < tmIds.length; i++) {
		menu = document.getElementById(tmIds[i]);
		menu.className = "tmc_normal";
		menu.style.left = (595 + i*45) + "px";
	}
}

function initModeMenu() {
	// 버튼 위치 지정
	for (i = 0; i < mmIds.length; i++) {
		menu = document.getElementById(mmIds[i]);
		menu.style.top = (5 + i*45) + "px";
	}
	// mm_select 버튼을 눌린 상태로 시작
	setModeMenu("mm_select");
}

function returnToSelect() {
	// 디폴트로 mm_select 모드로 돌아가기
	setModeMenu("mm_select");
}

function setModeMenu(id) {
	// 모든 버튼은 안눌린 상태(mmc_normel)로 변경
	for (i = 0; i < mmIds.length; i++) {
		menu = document.getElementById(mmIds[i]);
		menu.className = "mmc_normal";
	}
	// 클릭한 버튼을 선택 상태(mmc_select)로 변경하고 이벤트 핸들러 호출
	for (i = 0; i < mmIds.length; i++) {
		menu = document.getElementById(id);
		if (id == mmIds[i]) {			
			menu.className = "mmc_select";

			// 기존 코드와 연결
			switch (id) {
			case "mm_select":  editor.setState(modeSelect);	break;
			case "mm_line":    editor.setState(modeLine);	break;
			case "mm_rect":    editor.setState(modeRect);	break;
			case "mm_ellipse": editor.setState(modeEll);	break;
			case "mm_text":    editor.setState(modeText);	break;
			case "mm_image":   /*editor.setState(modeImage);*/	break;
			}
		}
	}
}

function onClickModeMenu(id) {
	setModeMenu(id);
}

function initEditorProperty() {
	// 버튼 위치 지정
	for (i = 0; i < epIds.length; i++) {
		menu = document.getElementById(epIds[i]);
		menu.className = "epc_normal";
		menu.style.left = (5 + i*45) + "px";
	}
	setEditorPropertyVisibility(tmp_mode);
}

function setEditorPropertyVisibility(mode) {
	/*
		속성창 ui를 mode 상태에 따라 가시화 변경
	*/
	if (mode == "unselect")
		setEPVisibility(false, false, false, false, false, false, false, false);
	else if (mode == "line")
		setEPVisibility(true, true, false, true, false, false, false, false);
	else if (mode == "rect")
		setEPVisibility(true, false, true, true, true, false, false, false);
	else if (mode == "ellipse")
		setEPVisibility(true, false, true, true, true, false, false, false);
	else if (mode == "text")
		setEPVisibility(true, false, true, false, false, true, true, false);
	else if (mode == "image")
		setEPVisibility(true, false, true, true, false, false, false, false);
	else if (mode == "multi-select")
		setEPVisibility(true, false, false, false, false, false, false, false);
}

function setEPVisibility(zi, li, po, bo, fi, te, fo, sh) {
	document.getElementById("ep_zindex").style.display = zi ? "block" : "none";
	document.getElementById("epv_line").style.display = li ? "block" : "none";
	document.getElementById("epv_position").style.display = po ? "block" : "none";
	document.getElementById("epv_border").style.display = bo ? "block" : "none";
	document.getElementById("epv_fill").style.display = fi ? "block" : "none";
	document.getElementById("epv_text").style.display = te ? "block" : "none";
	document.getElementById("epv_font").style.display = fo ? "block" : "none";
	document.getElementById("epv_shadow").style.display = sh ? "block" : "none";
}
