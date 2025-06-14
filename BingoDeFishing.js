const TAB_IDX_BINGO = 0
const TAB_IDX_FISHING = 1
const TAB_IDX_SELL_FISH = 2
const TAB_IDX_BUY_ITEM = 3
const TAB_IDX_TODAY_RESULT = 4
const TAB_IDX_SAVE_LOAD =5
const TAB_IDX_HAVING_ITEM = 6

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