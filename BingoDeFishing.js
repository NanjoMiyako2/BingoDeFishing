const TAB_IDX_BINGO = 0
const TAB_IDX_FISHING = 1
const TAB_IDX_SELL_FISH = 2
const TAB_IDX_BUY_ITEM = 3
const TAB_IDX_TODAY_RESULT = 4
const TAB_IDX_SAVE_LOAD =5
const TAB_IDX_HAVING_ITEM = 6

//一ステップにかかる秒数
const ONE_STEP_SECOND = 2;

const ROULETTE_SQUARE_NUM = 9;

const TABLE_ROW = 5;
const TABLE_COL = 5;

const TABLE_VALUE_MITEI = 0;
const TABLE_VALUE_V1 = 1;
const TABLE_VALUE_V2 = 2;
const TABLE_VALUE_V3 = 3;
const TABLE_VALUE_V4 = 4;
const TABLE_VALUE_V5 = 5;
const TABLE_VALUE_C1 = 6;
const TABLE_VALUE_C2 = 7;
const TABLE_VALUE_C3 = 8;

const BINGO_IDX_MAX = 25;

const TABLE_VALUE_STR_LIST = ["未定", "エサ1", "エサ2", "エサ3", "エサ4",
							  "エサ5", "コイン1", "コイン5", "コイン10"]

g_FlipIdx = 0;
g_TableArray1 = [];
g_ConfirmedSquare = [ [0, 1, 0, 0, 0],
					  [0, 0, 3, 1, 0],
					  [0, 0, 0, 1, 0],
					  [0, 1, 4, 0, 0],
					  [0, 0, 1, 2, 1] ]


var g_TableArray1 = [];
for(var i=0; i<TABLE_ROW; i++){
  g_TableArray1[i] = [];
  for(var j=0; j<TABLE_COL; j++){
    g_TableArray1[i][j] = '';
  }
}

class User {

	Coin = 100;


}

var MyUser = new User()

var textOfFile1;

//Form要素を取得する
var form = document.getElementById("myform1");
var file = document.getElementById("myfile1");
//ファイルが読み込まれた時の処理
file.addEventListener('change', function(e) {
  
  //ここにファイル取得処理を書く
  result2 = e.target.files[0];
  
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
  
    //読み込んだファイルの中身を取得する
    reader.readAsText( result2 );
  
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {
    
        //ファイルの中身をtextarea内に表示する
        textOfFile1 = reader.result;    
    })

})


function SaveAsTextFile(text, filename){
  const blob = new Blob([text], { type: 'text/plain' });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.click();
  
}

function StartStepExecuteInAdvanceOneStepTab(){
	g_StepExecuteFlg = true
	
	SEFunc1();
}


var SEFunc1 = function StepExecute(){
	let str2 = ""
	if(g_StepExecuteFlg == true){
		currentTime = new Date()
		minDiff = (currentTime - g_PrevStepTime) / 1000;
		g_PassedStep = parseInt(minDiff)
		setTimeout(SEFunc1, ONE_STEP_SECOND * 1000)
	}
	
	
	BingoFlipCount = parseInt(g_PassedStep / 25);
	for(i=0; i<BingoFlipCount; i++){
		showInitSquare();
		for(j=0; j<BINGO_IDX_MAX; j++){
			FlipOneSquare(j);
		}
		
		AddTableBonusOnlyOneCell();
		JudgetBingoHits();
		
	}
	
	g_FlipIdx = g_FlipIdx + 1;
	if(g_FlipIdx >= BINGO_IDX_MAX){

		AddTableBonusOnlyOneCell();
		JudgeBingoHits();

		g_FlipIdx = 0;
		showInitSquare();
	}
	FlipOneSquare(g_FlipIdx);

	if(g_PassedStep >= 1){
		g_PrevCountStart = 0;
		g_PassedStep = 0;
		g_PrevStepTime = currentTime
	}
	
	

}


function AddTableBonusOnlyOneCell(){
}

function JudgeBingoHits(){
}

function RemoveRouletteValueBtns(){

	for(i=0; i<ROULETTE_SQUARE_NUM; i++){
		idStr1 = "RouletteValueBtn" + String((i+1));
		elem1 = document.getElementById(idStr1);
		
		if(elem1 != null){
			elem1.remove();
		}
	}
	
	return;
}

function ResetBingoTable(){

	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL; j++){
			g_TableArray1[i][j] = TABLE_VALUE_MITEI;
		}
	}
	
	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL; j++){
			rVal = getRandom(TABLE_VALUE_V1, TABLE_VALUE_C3);
			g_TableArray1[i][j] = rVal;
			
			if(g_ConfirmedSquare[i][j] != TABLE_VALUE_MITEI){
				g_TableArray1[i][j] = g_ConfirmedSquare[i][j]
			}
		}
	}
	
	return
}

function FlipOneSquare(sqIdx){

	col1 = getCol(sqIdx);
	row1 = getRow(sqIdx);
	
	
	elemStr1 = "BingoTableSquare" + String((row1+1)) + "_" + String((col1+1));
	elem1 = document.getElementById(elemStr1);
	
	headStr1 = "";
	if(g_ConfirmedSquare[row1][col1] != TABLE_VALUE_MITEI){
		headStr1 = "確定マス<br>"
	}
	elem1.innerHTML= "<span>" + headStr1 + TABLE_VALUE_STR_LIST[ g_TableArray1[row1][col1] ] + "</span>"
	
	elem1.style.backgroundColor = "#b0c4de"
	
	return
}

function showInitSquare(){

	ResetBingoTable();
	
	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL; j++){
			elemStr1 = "BingoTableSquare" + String((i+1))+ "_" + String((j+1));
			elem1 = document.getElementById(elemStr1);
			
			if(g_ConfirmedSquare[i][j] == TABLE_VALUE_MITEI){
				elem1.innerHTML= "<span>未定</span>"
			}else{
				str1 = "確定マス<br>";
				str1 += TABLE_VALUE_STR_LIST[ g_ConfirmedSquare[i][j] ]
				str1 =  "<span>" + str1 + "</span>"
				elem1.innerHTML = str1;
			}
			
			elem1.style.backgroundColor = "#ffffff"
			
		}
	}	
}

function getRow(sqIdx){
	return parseInt(sqIdx / TABLE_COL);
}

function getCol(sqIdx){
	return (sqIdx % TABLE_ROW)
}

function save(){

	SaveAsTextFile(JSON.stringify(MyUser), "saveBingoDeFishingGameData1.txt");
	
	alert("ゲームデータを保存しました");
}

function LoadSaveDataFile(){

	LoadGameDataFromJsonFile(textOfFile1)
}

function LoadGameDataFromJsonFile(JsonFileText1){

	text1 = JsonFileText1
	
	MyUser = JSON.parse(text1)

}

function load(){

	LoadSaveDataFile();
	
	PrintParams();
	PrintTotalWalk();
	PrintHavingItems();
	PrintSoubiHin();
	PrintHavingKosekis();
	UnSetButtle();
		
	alert("ゲームデータをロードしました");
}


document.addEventListener('DOMContentLoaded', function () {
    const targets = document.getElementsByClassName('tab');
    for (let i = 0; i < targets.length; i++) {
        targets[i].addEventListener('click', changeTab, false);
    }
    // タブメニューボタンをクリックすると実行
    function changeTab() {
        // タブのclassを変更
        document.getElementsByClassName('is-active')[0].classList.remove('is-active');
        this.classList.add('is-active');
        // コンテンツのclassの値を変更
        document.getElementsByClassName('is-display')[0].classList.remove('is-display');
        const arrayTabs = Array.prototype.slice.call(targets);
        const index = arrayTabs.indexOf(this);
        
        document.getElementsByClassName('content')[index].classList.add('is-display');
    };
}, false);

function getRandom( min, max ) {
    var random = Math.floor( Math.random() * (max + 1 - min) ) + min;
  
    return random;
}

main();

function main(){

 g_PrevStepTime = new Date()

 showInitSquare()
 
 g_FlipIdx = -1;
 StartStepExecuteInAdvanceOneStepTab();
 
}