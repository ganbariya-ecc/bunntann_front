# ふろんとえんどフォルダ

## 環境構築コマンド
```
//フォルダ移動
cd frontend

//インストール
npm install .   
```

## tailwindcss の設定
```
//user/output.css の名前は適宜かえる
npx tailwindcss -i ./src/main/resources/static/input.css -o ./src/main/resources/static/user/output.css --watch
```
```
// 画面いっぱいに表示する
// <head>タグの中に入れる
// %はその都度調整
<style>
    body {
        height: 100vh;
        overflow-y: hidden;
    }
    header {
        height: 20%;
    }
    main{
        height: 50%;
    }: 30%;
    }
</style>
```
