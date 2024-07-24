$(function () {
    $('.js-btn').on('click', function () { // js-btnクラスをクリックすると、
        $('.menu').toggleClass('open'); // メニューにopenクラスをつけ外しする
        $('.btn-line').toggleClass('open'); // バーガーの線にopenクラスをつけ外しする
        $('.overlay').toggleClass('show'); // グレイレイヤーにshowクラスをつけ外しする
    });
});