const TAB_IDX_BINGO = 0
const TAB_IDX_FISHING = 1
const TAB_IDX_SELL_FISH = 2
const TAB_IDX_BUY_ITEM = 3
const TAB_IDX_CURRENT_RESULT = 4
const TAB_IDX_SAVE_LOAD =5
const TAB_IDX_HAVING_ITEM = 6

//一ステップにかかる秒数
const ONE_STEP_SECOND = 5;

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
							  
const TABLE_VALUE_COLOR_LIST = ["#ffffff", "#e6e6fa", "#fafad2", "#ff6347", "#3cb371",
								"#87cefa", "#ed853f", "#ee82ee", "#9acd32", "#ffc0cb"];

const UNCHECKED = 0;
const CHECKED = 1;

const CONFIRM_SQ_NUMBER = 25;

const CONFIRM_SQ_MIN = 3;
const CONFIRM_SQ_MAX = 9;

const NEED_COIN_VOL_FOR_ROURLETTE = 5;
const NEED_COIN_VOL_FOR_INIT_BINGO_TABLE = 100;

const FISH_TYPE_NUM = 3;

const FISH_TYPE1 = 1;
const FISH_TYPE2 = 2;
const FISH_TYPE3 = 3;

const BITE_IDX_LIST = [1, 2, 3, 4, 5]
const FISH_NAME_LIST = ["魚A1", "魚B2" , "魚C3"];

const FISH_TYPE_LIST = [1, 2, 3];


g_FishRouletteList = [ [3,2,1],
					   [0,5,5],
					   [3,1,0],
					   [1,1,1],
					   [4,5,1]]


g_FlipIdx = 0;
g_TableArray1 = [];
g_ConfirmedSquare = [ [0, 0, 0, 0, 0],
					  [0, 0, 0, 0, 0],
					  [0, 0, 0, 0, 0],
					  [0, 0, 0, 0, 0],
					  [0, 0, 0, 0, 0] ]

g_ConfirmedSquareCount = 0;

var g_TableArray1 = [];
for(var i=0; i<TABLE_ROW; i++){
  g_TableArray1[i] = [];
  for(var j=0; j<TABLE_COL; j++){
    g_TableArray1[i][j] = '';
  }
}

class User {

	HavingFishingBites = [1, 2, 3, 4, 5];
	HavingFish = [0, 0, 0]
	Coin = 150;


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
	
	if(g_FlipIdx >= BINGO_IDX_MAX){
		g_FlipIdx = 0;
		showInitSquare();
		FlipOneSquare(g_FlipIdx);
	}
	FlipOneSquare(g_FlipIdx);
	

	
	
	BingoFlipCount = parseInt(g_PassedStep / 25);
	for(i=0; i<BingoFlipCount; i++){
		showInitSquare();
		for(j=0; j<BINGO_IDX_MAX; j++){
			FlipOneSquare(j);
		}
		
		clearBingoLog();
		AddTableBonusOnlyOneCell();
		JudgetBingoHits();
		
	}
	
	g_FlipIdx = g_FlipIdx + 1;
	if(g_FlipIdx >= BINGO_IDX_MAX){
		clearBingoLog();
		AddTableBonusOnlyOneCell();
		JudgeBingoHits();
		
	}

	if(g_PassedStep >= 1){
		g_PrevCountStart = 0;
		g_PassedStep = 0;
		g_PrevStepTime = currentTime
	}
	
	

}

g_FishBitePrice = [1, 3, 6, 10, 14];
function BuyFishBite(){

	select1 = document.getElementById("BuyBiteKindSelectBox");
	val1 = g_FishBitePrice[Number(select1.value)-1];
	
	textbox1 = document.getElementById("BuyVolTextBox");
	vol1 = Number(textbox1.value);
	
	totalprice = val1 * vol1;
	
	if(MyUser.Coin < totalprice){
		alert("コインが足りません");
		return
	}
	
	MyUser.Coin -= totalprice;
	MyUser.HavingFishingBites[(Number(select1.value)-1)] += vol1;
	
	str2 = "エサを"+String(totalprice)+"コインで購入しました"
	alert(str2);
	
	showUserHavingFishBiteSpans()
	showUserCoinSpan1();
		
}


g_FishPrice = [1, 8, 15];

function SellFish(){

	vol = 0;
	totalprice = 0;
	for(i=0; i<MyUser.HavingFish.length; i++){
		vol = MyUser.HavingFish[i];
		totalprice += g_FishPrice[i] * vol;
		MyUser.HavingFish[i] = 0;
	}
	MyUser.Coin += totalprice;
	str1 = "魚を売った<br>"+"総売却金額:"+String(totalprice)+"コイン";	
	addSellFishLog(str1);
	
	showUserCoinSpan1();
	showUserHavingFishSpans();
	
}

function FishingStart(){
	clearFishingLog();
	addFishingLog("釣り開始した");
	
	
	catchFishList = [0,0,0];
	for(i2=0; i2<MyUser.HavingFishingBites.length; i2++){
		FishBiteVol = MyUser.HavingFishingBites[i2];
		if(FishBiteVol >= 1){
			biteName = TABLE_VALUE_STR_LIST[(i2+1)]
			str1 = biteName + "を" + String(FishBiteVol) + "個使用した"
			addFishingLog(str1);
			
			biteIdx = (BITE_IDX_LIST[i2]-1)
			retList = MakeMaltipleFishingRouletteListForBiteType(biteIdx)
			
			catchFishList = [0, 0, 0]
			FishingByOneKindBite(biteIdx, retList.fishnameList, retList.roulettePercentArray,FishBiteVol,catchFishList)
			
			for(k2=0; k2<FISH_TYPE_LIST.length; k2++){
				if(catchFishList[k2] >= 1){
					fishName1 = FISH_NAME_LIST[k2];
					catchVol = catchFishList[k2];
					
					str2 = fishName1 + "を" + catchVol +"匹釣りあげた";
					addFishingLog(str2);
					
				}
			}
		}
	}
	
	
	addFishingLog("持っているエサをすべて使用し終えた");
	
	

	
	addFishingLog("釣り終えた");
	
	
}

function clearSellFishLog(){
	elem1 = document.getElementById("SellFishLogSpan1");
	elem1.innerHTML = "";
	
}

function addSellFishLog(str1){
	elem1 = document.getElementById("SellFishLogSpan1");
	
	elemText1 = elem1.innerHTML;
	elem1.innerHTML = "<span>" + str1 + "</span> <br>" + elemText1
	
}

function clearFishingLog(){
	elem1 = document.getElementById("FishingLogSpan1");
	elem1.innerHTML = "";
	
}

function addFishingLog(str1){
	elem1 = document.getElementById("FishingLogSpan1");
	
	elemText1 = elem1.innerHTML;
	elem1.innerHTML = "<span>" + str1 + "</span> <br>" + elemText1
	
}


function clearBingoLog(){
	elem1 = document.getElementById("BingoLogSpan1");
	elem1.innerHTML = "";
	
}

function addBingoLog(str1){
	elem1 = document.getElementById("BingoLogSpan1");
	
	elemText1 = elem1.innerHTML;
	elem1.innerHTML = "<span>" + str1 + "</span> <br>" + elemText1
	
}

function AddTableBonusOnlyOneCell(){

	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL; j++){
			if(isFishingBiteIdx(g_TableArray1[i][j])){
				MyUser.HavingFishingBites[ getFishingBiteIdxFromTableValue(g_TableArray1[i][j] )] += 1
				
				str2 = TABLE_VALUE_STR_LIST[ g_TableArray1[i][j] ]
				str2 += "を手に入れた"
				addBingoLog(str2);
				
			}else{
				vol1 = getAddCoinVolFromTableValue(g_TableArray1[i][j]);
				
				MyUser.Coin += vol1;
				
				str2 = "コインを " + String(vol1) + " 手に入れた"
				addBingoLog(str2);
				
			}
		}
	}
	
	
}

function getAddCoinVolFromTableValue(idx){
	switch(idx){
		case TABLE_VALUE_C1:
			return 1;
		case TABLE_VALUE_C2:
			return 5;
		case TABLE_VALUE_C3:
			return 10;
	}		
	return 0;
}

function isFishingBiteIdx(idx){

	switch(idx){
		case TABLE_VALUE_V1:
		case TABLE_VALUE_V2:
		case TABLE_VALUE_V3:
		case TABLE_VALUE_V4:
		case TABLE_VALUE_V5:
			return true;
	}		
	return false;
	
}
function getFishingBiteIdxFromTableValue(idx){
	return idx-1
}

function JudgeBingoHits(){
	JudgeLeftDownHit();
	JudgeRightDownHit();
	JudgeVerticalHit();
	JudgeHorizontalHit();
}

function JudgeHorizontalHit(){

	checkedArray = [];
	for(var i=0; i<TABLE_ROW; i++){
	  checkedArray[i] = [];
	  for(var j=0; j<TABLE_COL; j++){
	   checkedArray[i].push(UNCHECKED);
	  }
	}
	
	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL-2; j++){
			if(checkedArray[i][j] == UNCHECKED){
				checkedArray[i][j] = CHECKED;
				pivotVal = g_TableArray1[i][j];
				
				if(pivotVal == g_TableArray1[i][j+1] &&
				   pivotVal == g_TableArray1[i][j+2] ){
				   checkedArray[i][j+1] = CHECKED;
				   checkedArray[i][j+2] = CHECKED;
				   
				   	if(j+3 < TABLE_COL &&
				   	   pivotVal == g_TableArray1[i][j+3]){
				   	   checkedArray[i][j+3] = CHECKED;
				   	   
				   	   if(j+4 < TABLE_COL &&
				   	   	  pivotVal == g_TableArray1[i][j+4]){
				   	   	  	checkedArray[i][j+4] = CHECKED;
				   	   	  	addBonus(i, j, 5);
				   	   	  	
				   	   }else{
				   	   		addBonus(i, j, 4);
				   	   }
				   	   
				   	   
				   	
				   	}else{
				   		addBonus(i, j, 3);
				   	}
				   
				}
			}
		}
	}

}

function JudgeVerticalHit(){


	checkedArray = [];
	for(var i=0; i<TABLE_ROW; i++){
	  checkedArray[i] = [];
	  for(var j=0; j<TABLE_COL; j++){
	   checkedArray[i].push(UNCHECKED);
	  }
	}
	
	for(i=0; i<TABLE_ROW-2; i++){
		for(j=0; j<TABLE_COL; j++){
			if(checkedArray[i][j] == UNCHECKED){
				checkedArray[i][j] = CHECKED;
				pivotVal = g_TableArray1[i][j];
				
				if(pivotVal == g_TableArray1[i+1][j] &&
				   pivotVal == g_TableArray1[i+2][j] ){
				   checkedArray[i+1][j] = CHECKED;
				   checkedArray[i+2][j] = CHECKED;
				   
				   	if(i+3 < TABLE_ROW &&
				   	   pivotVal == g_TableArray1[i+3][j]){
				   	   checkedArray[i+3][j] = CHECKED;
				   	   
				   	   if(i+4 < TABLE_ROW &&
				   	   	  pivotVal == g_TableArray1[i+4][j]){
				   	   	  	checkedArray[i+4][j] = CHECKED;
				   	   	  	addBonus(i, j, 5);
				   	   	  	
				   	   }else{
				   	   		addBonus(i, j, 4);
				   	   }
				   	   
				   	   
				   	
				   	}else{
				   		addBonus(i, j, 3);
				   	}
				   
				}
			}
		}
	}

}

function JudgeRightDownHit(){

	checkedArray = [];
	for(var i=0; i<TABLE_ROW; i++){
	  checkedArray[i] = [];
	  for(var j=0; j<TABLE_COL; j++){
	   checkedArray[i].push(UNCHECKED);
	  }
	}
	
	for(i=0; i<TABLE_ROW-2; i++){
		for(j=0; j<TABLE_COL-2; j++){
			if(checkedArray[i][j] == UNCHECKED){
				checkedArray[i][j] = CHECKED;
				pivotVal = g_TableArray1[i][j];
				
				if(pivotVal == g_TableArray1[i+1][j+1] &&
				   pivotVal == g_TableArray1[i+2][j+2] ){
				   checkedArray[i+1][j+1] = CHECKED;
				   checkedArray[i+2][j+2] = CHECKED;
				   
				   	if(i+3 < TABLE_ROW &&
				   	   pivotVal == g_TableArray1[i+3][j+3]){
				   	   checkedArray[i+3][j+3] = CHECKED;
				   	   
				   	   if(i+4 < TABLE_ROW &&
				   	   	  pivotVal == g_TableArray1[i+4][j+4]){
				   	   	  	checkedArray[i+4][j+4] = CHECKED;
				   	   	  	addBonus(i, j, 5);
				   	   	  	
				   	   }else{
				   	   		addBonus(i, j, 4);
				   	   }
				   	   
				   	   
				   	
				   	}else{
				   		addBonus(i, j, 3);
				   	}
				   
				}
			}
		}
	}
	

}

function JudgeLeftDownHit(){
	
	checkedArray = [];
	for(var i=0; i<TABLE_ROW; i++){
	  checkedArray[i] = [];
	  for(var j=0; j<TABLE_COL; j++){
	   checkedArray[i].push(UNCHECKED);
	  }
	}


	for(i=0; i<TABLE_ROW-2; i++){
		for(j=2; j<TABLE_COL; j++){
			if(checkedArray[i][j] == UNCHECKED){
				checkedArray[i][j] = CHECKED;
				pivotVal = g_TableArray1[i][j];
				
				if(pivotVal == g_TableArray1[i+1][j-1] &&
				   pivotVal == g_TableArray1[i+2][j-2] ){
				   checkedArray[i+1][j-1] = CHECKED;
				   checkedArray[i+2][j-2] = CHECKED;
				   
				   	if(i+3 < TABLE_ROW &&
				   	   pivotVal == g_TableArray1[i+3][j-3]){
				   	   checkedArray[i+3][j-3] = CHECKED;
				   	   
				   	   if(i+4 < TABLE_ROW &&
				   	   	  pivotVal == g_TableArray1[i+4][j-4]){
				   	   	  	checkedArray[i+4][j-4] = CHECKED;
				   	   	  	addBonus(i, j, 5);
				   	   	  	
				   	   }else{
				   	   		addBonus(i, j, 4);
				   	   }
				   	   
				   	   
				   	
				   	}else{
				   		addBonus(i, j, 3);
				   	}
				   
				}
			}
		}
	}
}


function addBonus(row, col, level){
	str2 = String(level) + "ヒット!"
	addBingoLog(str2);
	
	str2 =  "ヒット位置:: 行:" + String(row) + ", 列:" + String(col);
	addBingoLog(str2);
	
	
	pt1 = 0;
	

	
	if(isFishingBiteIdx(g_TableArray1[row][col])){
		if(level == 3){
			pt1 = 5;
			MyUser.HavingFishingBites[ getFishingBiteIdxFromTableValue(g_TableArray1[row][col] )] += 5
		}else if(level == 4){
			pt1 = 10;
			MyUser.HavingFishingBites[ getFishingBiteIdxFromTableValue(g_TableArray1[row][col] )] += 10
		}else if(level == 5){
			pt1 = 20;
			MyUser.HavingFishingBites[ getFishingBiteIdxFromTableValue(g_TableArray1[row][col] )] += 20
		}
		
	}else{
		if(level == 3){
			pt1 = 5;
			MyUser.Coin += 5;
		}else if(level == 4){
			pt1 = 10;
			MyUser.Coin += 10;
		}else if(level == 5){
			pt1 = 20;
			MyUser.Coin += 20;
		}
	}
	
	str2 = "ボーナスポイント" + String(pt1) + "をゲット!"
	addBingoLog(str2);
	
	
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
	elem1.innerHTML= "<span>" + headStr1 + TABLE_VALUE_STR_LIST[ g_TableArray1[row1][col1] ] + "</span><br>"

	if(headStr1 != ""){
		elem1.innerHTML +=  makeRouletteBtnTagStr();
	}
	
	
	
	elem1.style.backgroundColor = TABLE_VALUE_COLOR_LIST[ g_TableArray1[row1][col1] ]
	
	
	showUserCoinSpan1()
	
	return
}

function showUserCoinSpan1(){
	elem1=document.getElementById("UserCoinSpan1");
	elem1.innerHTML = MyUser.Coin;
}

function showUserHavingFishBiteSpans(){

	for(i=TABLE_VALUE_V1; i<=TABLE_VALUE_V5; i++){
		str1 = "HavingFishBite"+String(i) + "Span";
		elem1=document.getElementById(str1);
		elem1.innerHTML = MyUser.HavingFishingBites[(i-TABLE_VALUE_V1)];
	}
}

function showUserHavingFishSpans(){

	for(i=FISH_TYPE1; i<=FISH_TYPE_LIST.length; i++){
		str1 = "HavingFish"+String(i) + "Span";
		elem1=document.getElementById(str1);
		elem1.innerHTML = MyUser.HavingFish[(i-FISH_TYPE1)];
	}
}

function showInitSquare(){

	ResetBingoTable();
	
	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL; j++){
			elemStr1 = "BingoTableSquare" + String((i+1))+ "_" + String((j+1));
			elem1 = document.getElementById(elemStr1);
			
			if(g_ConfirmedSquare[i][j] == TABLE_VALUE_MITEI){
				elem1.innerHTML= "<span>未定</span>"
				
				elem1.style.backgroundColor = "#ffffff"
			}else{
			
				
				str1 = "確定マス<br>";
				str1 += TABLE_VALUE_STR_LIST[ g_TableArray1[i][j] ]
				str1 =  "<span>" + str1 + "</span><br>"
				elem1.innerHTML = str1;
				
				str2 = makeRouletteBtnTagStr();
				elem1.innerHTML += str2
				
				
				elem1.style.backgroundColor = TABLE_VALUE_COLOR_LIST[ g_TableArray1[i][j] ]
				
			}
			
			
			
		}
	}	
}

function makeRouletteArray(percentArray){
	sum_total = 0;
	percentSumArray = [];
	
	for(i=0; i<percentArray.length; i++){
		sum_total += percentArray[i];
		percentSumArray.push(sum_total);
	}
	return percentSumArray;
}

function Roulette2(percentSumArray){
	sum_total1 = percentSumArray[percentSumArray.length-1];
	min1 = 0;
	
	randNum = getRandom(min1, sum_total1);
	idx = 0;
	
	for(j=0; j<percentSumArray.length; j++){
		if(randNum <= percentSumArray[j]){
			idx = j;
			return idx;
		}
	}
	
	idx = j;
	return idx
	
}

function InitConfirmedSquare(){
	g_ConfirmedSquareCount = getRandom(CONFIRM_SQ_MIN, CONFIRM_SQ_MAX);
	
	idxArray = [];
	for(i=0; i<CONFIRM_SQ_NUMBER; i++){
		idxArray.push(i)
	}
	
	for(k2=0; k2<TABLE_ROW; k2++){
		for(k3=0; k3<TABLE_COL; k3++){
			g_ConfirmedSquare[k2][k3] = TABLE_VALUE_MITEI;
		}
	}
	
	
	retValArray = PickUpArray(idxArray, g_ConfirmedSquareCount);
	
	for(j=0; j<retValArray.length; j++){
		row1 = getRow(retValArray[j]);
		col1 = getCol(retValArray[j]);
		rVal = getRandom(TABLE_VALUE_V1, TABLE_VALUE_C3)
		g_ConfirmedSquare[row1][col1] = rVal
		

		
	}
}

function InitRouletteBtnOfConfirmedSquare(){

	RouletteValueBtnIdx = 1;
	
	for(i=0; i<TABLE_ROW; i++){
		for(j=0; j<TABLE_COL; j++){
			if(g_ConfirmedSquare[i][j] != TABLE_VALUE_MITEI){
				parentElemIdStr1 = "BingoTableSquare" + String((i+1))+ "_" + String((j+1));
				parentElem1 = document.getElementById(parentElemIdStr1);

				RouletteValueBtnIdx += 1;
				
			}
		}
	}
}


function PickUpArray(Array1, pickUpNum){

	for(i=0; i<pickUpNum; i++){
		rIdx = getRandom(i, Array1.length-1);
		
		temp1 = Array1[i];
		Array1[i] = Array1[rIdx];
		Array1[rIdx] = temp1
	}
	
	resultValue = [];
	
	for(j=0; j<pickUpNum; j++){
		resultValue.push(Array1[j]);
	}
	
	return resultValue
}


function getRow(sqIdx){
	return parseInt(sqIdx / TABLE_COL);
}

function getCol(sqIdx){
	return (sqIdx % TABLE_ROW)
}


//エサのタイプIdxからルーレット用パーセント配列と対応する魚タイプリストを作成して返す
function MakeMaltipleFishingRouletteListForBiteType(biteIdx){
	enableCatchFishList = [];
	retFishRouletteList = [];
	
	for(i=0; i<FISH_TYPE_NUM; i++){
		fr = g_FishRouletteList[biteIdx][i]
		if(fr > 0){
			enableCatchFishList.push(FISH_TYPE_LIST[i]);
			retFishRouletteList.push(fr);
		}
	}
	
	return {fishnameList:enableCatchFishList, roulettePercentArray:retFishRouletteList}
}

function FishingByOneKindBite(biteIdx, fishnameList, roulettePercentArray, vol,catchFishList){
	
	
	percentSumArray1 = makeRouletteArray(roulettePercentArray);
	
	for(i3 = 0; i3 < vol; i3++){
		rIdx = Roulette2(percentSumArray1);
		
		MyUser.HavingFishingBites[biteIdx] -= 1;
		MyUser.HavingFish[(fishnameList[rIdx]-1)] += 1;
		catchFishList[(fishnameList[rIdx]-1)] += 1;


	}
	
}


function showConfirmedSquare(row1, col1){
	
	
	elemStr1 = "BingoTableSquare" + String((row1+1))+ "_" + String((col1+1));
	elem1 = document.getElementById(elemStr1);
	
	if(g_ConfirmedSquare[row1][col1] == TABLE_VALUE_MITEI){
		elem1.innerHTML= "<span>未定</span>"
	}else{
	
			
		str1 = "確定マス<br>";
		str1 += TABLE_VALUE_STR_LIST[ g_ConfirmedSquare[row1][col1] ]
		str1 =  "<span>" + str1 + "</span><br>"
		elem1.innerHTML = str1;
		
	}
			

}

function makeRouletteBtnTagStr(){
	str2 = "<button onclick=\"RouletteConfirmedSquare(event)\">Roulette(5Coin)</button>"
    return str2;
}

function RouletteConfirmedSquare(event){
	  const button = event.target;
	  const cell = button.parentNode;
	  const row = cell.parentNode;
	  const table = row.parentNode.parentNode; // テーブル要素にアクセス

	  const rowIndex = row.rowIndex;
	  const cellIndex = cell.cellIndex;

	  console.log("行インデックス:", rowIndex);
	  console.log("列インデックス:", cellIndex);

		if(MyUser.Coin < NEED_COIN_VOL_FOR_ROURLETTE){
			str1 = "ルーレットを回すには"+String(NEED_COIN_VOL_FOR_ROURLETTE) +"コイン必要です"
			alert(str1);
			return
		}else{
			MyUser.Coin -= NEED_COIN_VOL_FOR_ROURLETTE;
		}

		
		rVal = getRandom(TABLE_VALUE_V1, TABLE_VALUE_C3)
		g_ConfirmedSquare[rowIndex][cellIndex] = rVal
		g_TableArray1[rowIndex][cellIndex] = rVal
		
		FlipOneSquare( (rowIndex*TABLE_COL+cellIndex) )
		
		
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
        
        if(index == TAB_IDX_HAVING_ITEM){
        	showUserHavingFishBiteSpans();
        }else if(index == TAB_IDX_CURRENT_RESULT){
        	showUserHavingFishSpans()
        }
        
        document.getElementsByClassName('content')[index].classList.add('is-display');
    };
}, false);

function getRandom( min, max ) {
    var random = Math.floor( Math.random() * (max + 1 - min) ) + min;
  
    return random;
}

main();

function main(){
	showUserCoinSpan1()
	 g_PrevStepTime = new Date()

	 InitConfirmedSquare()
	 showInitSquare()
	 
}

function InitBingoTable(){

	if(MyUser.Coin < NEED_COIN_VOL_FOR_INIT_BINGO_TABLE){
		str1 = "ビンゴテーブルを初期化するには"+String(NEED_COIN_VOL_FOR_INIT_BINGO_TABLE)+"コイン必要です"
		alert(str1);
		return
	}else{
		MyUser.Coin -= NEED_COIN_VOL_FOR_INIT_BINGO_TABLE;
	}

	
	g_PrevStepTime = new Date()

	InitConfirmedSquare()
	showInitSquare()
	 
	BingoStop();
}

function BingoStart(){
	 g_PrevStepTime = new Date()
	 
	 g_FlipIdx = 0;
	 StartStepExecuteInAdvanceOneStepTab();
}

function BingoStop(){

	 g_StepExecuteFlg = false
	 g_PrevStepTime = new Date()
	 
	 g_FlipIdx = 0;
}