window.onload = function () {
    resize();
    add_onclick("move1", "move2");
    add_onclick("move2", "move3");
    add_onclick("move3", "move4");
}
window.onresize = resize;

function resize() {
    document.getElementsByClassName("question")[0].style.height = (document.documentElement.clientHeight - 135) + "px";
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
    divs.forEach(div => div.style.top = "100%");
}