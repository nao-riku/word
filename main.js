window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("/word/service-worker.js")
            .then(function (registration) {
                console.log("serviceWorker registed.");
            }).catch(function (error) {
                console.warn("serviceWorker error.", error);
            });
    }
    add_onclick("move1", "move2");
    add_onclick("move2", "move3");
    add_onclick("move3", "move4");

    change_btn(document.getElementsByClassName("input-text")[0]);

    for (let i = 2; i <= 4; i++) {
        document.getElementsByClassName("w-button")[i].addEventListener('click', function () {
            answer(this);
        });
    }
}

let kana = ['あ', 'い', 'う', 'え', 'お', 'か', 'く', 'け', 'こ', 'さ', 'す', 'せ', 'そ', 'た', 'つ', 'て', 'と', 'な', 'ぬ', 'ね', 'の', 'は', 'ふ', 'へ', 'ほ', 'ま', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'る', 'れ', 'ろ', 'わ', 'が', 'ぐ', 'げ', 'ご', 'ざ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぷ', 'ぺ', 'ぽ'];
let kana2 = ['き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'び', 'ぴ']
let mini = ['ゃ', 'ゅ', 'ょ']

function answer(btn) {
    let answer = document.getElementsByClassName("input-text")[0];
    if (answer.innerText.length == 2) {
        answer.innerText = answer.innerText + btn.innerText;
        change_btn(answer);

    } else {
        answer.innerText = answer.innerText + btn.innerText;
        change_btn(answer);
    }
}

function change_btn(answer) {
    let list = kana.concat(kana2);
    if (answer.innerText.length >= 1) {
        if (answer.innerText[answer.innerText.length - 1] !== 'っ') list.concat(['っ']);
        if (answer.innerText[answer.innerText.length - 1] !== 'ん') list.concat(['ん']);
        if (kana2.includes(answer.innerText[answer.innerText.length - 1])) list.concat(mini);
    }
    for (let i = 2; i <= 4; i++) {
        let num = Math.floor(Math.random() * list.length)
        let cha = list[num];
        document.getElementsByClassName("w-button")[i].innerText = cha;
        list.splice(num, 1);
    }
}

window.onresize = function () {
    let size = document.documentElement.clientWidth + "px"
    document.getElementsByClassName("wrap")[0].style.width = size;
    document.querySelectorAll("table").forEach(item => item.style.width = size);
}

function add_onclick(a, b) {
    let items = document.getElementsByClassName("select " + a)[0].children[0].children[0].children;
    for (let i = 0; i < items.length; i++) {
        for (let ii = 0; ii < items[i].children.length; ii++) {
            items[i].children[ii].setAttribute('onclick', "show_up_2('." + a + "', '." + b + "')");
        }
    }
}

function show_up_1() {
    let divs = document.querySelectorAll(".move1");
    divs.forEach(div => div.style.left = "0%");
}

function show_up_2(a, b) {
    let divs = document.querySelectorAll(b);
    divs.forEach(div => div.style.left = "0%");

    divs = document.querySelectorAll(a);
    divs.forEach(div => div.style.left = "-100%");
}

function show_up_3() {
    let divs = document.querySelectorAll(".move5");
    divs.forEach(div => div.style.top = "0%");
}

function go_out_1() {
    let divs = document.querySelectorAll(".move1");
    divs.forEach(div => div.style.left = "100%");
}

function go_out_2(a, b) {
    let divs = document.querySelectorAll(a);
    divs.forEach(div => div.style.left = "0%");

    divs = document.querySelectorAll(b);
    divs.forEach(div => div.style.left = "100%");
}

function go_out_3() {
    let divs = document.querySelectorAll(".move5");
    divs.forEach(div => div.style.top = "100%");
}






var dbName = 'sampleDB';
var dbVersion = '1';
var storeName = 'counts';
var count = 0;

/*var request = indexedDB.deleteDatabase(dbName); // データベース名(testDB)に接続

request.onsuccess = function(event){
    console.log('DBの削除に成功しました'); 
}
request.onerror = function(){
    console.log('DBの削除に失敗しました');
}*/

//　DB名を指定して接続
var openReq = indexedDB.open(dbName, dbVersion);
// 接続に失敗
openReq.onerror = function (event) {
    console.log('接続失敗');
}

//DBのバージョン更新(DBの新規作成も含む)時のみ実行
openReq.onupgradeneeded = function (event) {
    var db = event.target.result;
    const objectStore = db.createObjectStore(storeName, { keyPath: 'id' })
    objectStore.createIndex("id", "id", { unique: true });
    objectStore.createIndex("cnt", "cnt", { unique: false });

    console.log('DB更新');
}

//onupgradeneededの後に実行。更新がない場合はこれだけ実行
openReq.onsuccess = function (event) {

    var db = event.target.result;
    var trans_g = db.transaction(storeName, 'readonly');
    var store_g = trans_g.objectStore(storeName);
    var getReq_g = store_g.get(1);

    getReq_g.onsuccess = function (event) {
        // 取得したデータがundefinedだったら0をセット
        // でーたがあれば++
        if (typeof event.target.result === 'undefined') {
            count = 0;
        } else {
            count = event.target.result.cnt;
        }

        var trans = db.transaction(storeName, "readwrite");
        var store = trans.objectStore(storeName);
        var putReq = store.put({
            id: 1,
            cnt: count
        });

        putReq.onsuccess = function (event) {
            console.log('更新成功');

            for (var i = 2; i < 3000; i++) {
                store.put({
                    id: i,
                    cnt: Math.random()
                });
            }
        }
    }
    /*
    document.getElementsByClassName("w-button")[2].addEventListener('click', function () {
        count++;
        change(this, count);
    });
    
    document.getElementsByClassName("w-button")[3].addEventListener('click', function () {
        count--;
        change(this, count);
    });
    
    document.getElementsByClassName("w-button")[4].addEventListener('click', function () {
        count = 0;
        change(this, count);
    });*/


    function change(btn, count) {
        var putReq = updateDb(db, storeName, count);

        putReq.onsuccess = function (event) {
            console.log('更新成功');
            btn.innerHTML = count;
        }
        putReq.onerror = function (event) {
            console.log('更新失敗');
        }
    }
}

function updateDb(db, store_name, cnt) {
    var trans = db.transaction(store_name, "readwrite");
    var store = trans.objectStore(store_name);
    return store.put({
        id: 1,
        cnt: cnt
    });
}




