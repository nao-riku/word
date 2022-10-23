var dbName = 'sampleDB';
var dbVersion = '1';
var storeName  = 'counts';
var count = 0;
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
    for (var i = 0; i < 3000; i++) {
           objectStore.createIndex("data" + i, "data" + i, { unique: true });
    }

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

            for (var i = 0; i < 3000; i++) {
                store.put({"data" + i: Math.random()});
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
