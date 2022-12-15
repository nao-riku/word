let answer, judge, point2, keys = [];

let dbName = 'sampleDB';
let storeName = 'counts';
let db;

window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("service-worker.js")
            .then(function (registration) {
                console.log("serviceWorker_registed.");
            }).catch(function (error) {
                console.warn("serviceWorker_error.", error);
            });
    }
    point2 = document.getElementsByClassName("point")[0];
    setupDB(point2);
    function listener(e) {
        e.clipboardData.setData("text/plain", "str");
        alert("リンクをコピーしました");
        e.preventDefault();
        document.removeEventListener("copy", listener);
    }
    document.addEventListener("copy", listener);
    add_onclick("move1", "move2");
    add_onclick("move2", "move3");
    add_onclick("move3", "move4");
    answer = document.getElementsByClassName("input-text")[0];
    judge = document.getElementById("judge");
    for (let i = 0; i < 3; i++) keys[i] = document.getElementsByClassName("input-btn")[i];
    change_btn(true);
    let eventname = ('ontouchstart' in window || navigator.msPointerEnabled) ? 'touchstart' : 'click';
    document.getElementById("judge").addEventListener(eventname, function (e) {
        e.preventDefault();
        this.style = "";
    });
    for (let i = 0; i < 3; i++) {
        document.getElementsByClassName("w-input-btn")[i].addEventListener(eventname, function (e) {
            e.preventDefault();
            check(this);
        });
    }
    let alert = document.getElementById("alert");
    alert.addEventListener('transitionend', (e) => { if (e.target.style.transform === "") e.target.style = "" });

    function loop() {
        setTimeout(function () {
            if (point !== undefined) mapinit3(true);
            else loop();
        }, 100);
    }
    loop();
}

let kana = ['あ', 'い', 'う', 'え', 'お', 'か', 'く', 'け', 'こ', 'さ', 'す', 'せ', 'そ', 'た', 'つ', 'て', 'と', 'な', 'ぬ', 'ね', 'の', 'は', 'ふ', 'へ', 'ほ', 'ま', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'る', 'れ', 'ろ', 'わ', 'が', 'ぐ', 'げ', 'ご', 'ざ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぷ', 'ぺ', 'ぽ'];
let kana2 = ['き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'び', 'ぴ']
let mini = ['ゃ', 'ゅ', 'ょ']

function check(btn) {
    answer.innerText = answer.innerText + btn.children[0].innerText;
    if (answer.innerText.length <= 2) {
        change_btn();
    } else {
        point2.classList.remove("zoom-in");
        change_btn();
        judge.style = "visibility: visible;";
        answer.innerText = "";
        let add = 0.3;
        point2.innerText = ((Number(point2.innerText) * 10 + add * 10) / 10).toFixed(1);
        point2.classList.add("zoom-in");
        process(add);
    }
}

function change_btn() {
    let list = kana.concat(kana2);
    if (answer.innerText.length >= 1) {
        if (answer.innerText[answer.innerText.length - 1] !== 'っ') list.concat(['っ']);
        if (answer.innerText[answer.innerText.length - 1] !== 'ん') list.concat(['ん']);
        if (kana2.includes(answer.innerText[answer.innerText.length - 1])) list.concat(mini);
    }
    for (let i = 0; i < 3; i++) {
        let num = Math.floor(Math.random() * list.length)
        let cha = list[num];
        keys[i].innerText = cha;
        list.splice(num, 1);
    }
}

window.onresize = function () {
    let size = document.documentElement.clientWidth + "px";
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
    if (document.getElementById("loading") != null) document.getElementById("loading").style.visibility = "visible";
    mapinit();
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


function shareClick() {
    if (document.execCommand("copy")) {
        document.execCommand("copy");
    } else {
        if (navigator.share) {
            navigator.share({
                title: '市区町村Wordle',
                text: '日本の市区町村名を当てるゲーム「市区町村Wordle」で遊ぼう！',
                url: 'https://wordle-jp.webflow.io',
            });
        } else {
            alert("リンクコピーに対応していません");
        }
    }
}



/*let request = indexedDB.deleteDatabase(dbName); // データベース名(testDB)に接続
request.onsuccess = function (event) { console.log('DBの削除に成功しました'); }
request.onerror = function () { console.log('DBの削除に失敗しました'); }*/

//　DB名を指定して接続

function setupDB(point2) {
    let openReq = indexedDB.open(dbName, '1');
    openReq.onerror = function (event) { console.log('接続失敗'); }

    //DBのバージョン更新(DBの新規作成も含む)時のみ実行
    openReq.onupgradeneeded = function (event) {
        let db = event.target.result;
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id' })
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("cnt", "cnt", { unique: false });
        console.log('DB更新');
    }

    //onupgradeneededの後に実行。更新がない場合はこれだけ実行
    openReq.onsuccess = function (event) {

        db = event.target.result;
        let trans_g = db.transaction(storeName, 'readonly');
        let store_g = trans_g.objectStore(storeName);
        let getReq_g = store_g.get("point");

        getReq_g.onsuccess = function (event) {
            if (typeof event.target.result === 'undefined') {
                point = 70000;
                point2.innerText = (point / 10).toFixed(1);
            } else {
                point = event.target.result.cnt;
                point2.innerText = (point / 10).toFixed(1);
            }

        }
    }
}

/*
    let trans = db.transaction(storeName, "readwrite");
    store = trans.objectStore(storeName);
    let putReq = store.put({
        id: "point",
        cnt: ""
    });

    putReq.onsuccess = function (event) {
        console.log('更新成功');
        for (let i = 2; i < 3000; i++) {
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

function updatePt(pt) {
    let putReq = updateDb(pt);

    putReq.onsuccess = function (event) {
        console.log('更新成功');
    }
    putReq.onerror = function (event) {
        console.log('更新失敗');
    }
}

function updateDb(cnt) {
    let trans = db.transaction(storeName, "readwrite");
    let store = trans.objectStore(storeName);
    return store.put({
        id: "point",
        cnt: cnt
    });
}




