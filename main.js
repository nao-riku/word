window.onload = function () {
    resize();
    add_onclick("move1", "move2");
    add_onclick("move2", "move3");
    add_onclick("move3", "move4");
}
window.onresize = resize;

function resize() {
    document.getElementsByClassName("question")[0].style.height = (document.documentElement.clientHeight - 200) + "px";
    document.getElementsByClassName("eng")[1].innerHTML = "2 now width is " + document.documentElement.clientWidth;
    document.getElementsByClassName("wrap")[0].style.width = document.documentElement.clientWidth + "px";
}

function add_onclick(a, b) {
    let items = document.getElementsByClassName("select " + a)[0].children[0].children;
    for (let i = 0; i < items.length; i++) {
        items[i].setAttribute('onclick', "show_up_2('." + a + "', '." + b + "')");
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
    divs.forEach(div => div.style.top = "101%");
}






var dbName = 'sampleDB';
var dbVersion = '1';
var storeName  = 'counts';
var count = 0;
  
var request = indexedDB.deleteDatabase(dbName); // データベース名(testDB)に接続

request.onsuccess = function(event){
    console.log('DBの削除に成功しました'); 
}
request.onerror = function(){
    console.log('DBの削除に失敗しました');
}

//　DB名を指定して接続
var openReq  = indexedDB.open(dbName, dbVersion);
// 接続に失敗
openReq.onerror = function (event) {
    console.log('接続失敗');
}

//DBのバージョン更新(DBの新規作成も含む)時のみ実行
openReq.onupgradeneeded = function (event) {
    var db = event.target.result;
    const objectStore = db.createObjectStore(storeName, {keyPath : 'id'})
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
    });
    
    
    function change (btn, count) {
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

function updateDb (db, store_name, cnt) {
    var trans = db.transaction(store_name, "readwrite");
    var store = trans.objectStore(store_name);
    return store.put({
        id: 1,
        cnt: cnt
    });
}
