function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imagePreview = document.getElementById('image-preview');
            imagePreview.src = e.target.result;
            imagePreview.classList.add('uploaded'); // アップロードされた画像のクラスを追加
            imagePreview.classList.add('object-contain'); // アップロードされた画像のクラスを追加
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}

function removeUpload() {
    var imagePreview = document.getElementById('image-preview');
    imagePreview.src = '/frontend/images/add_image.png';
    imagePreview.classList.remove('uploaded'); // アップロードされた画像のクラスを削除
    imagePreview.classList.remove('object-contain'); // アップロードされた画像のクラスを削除
    document.querySelector('.file-upload input[type="file"]').value = '';
}
document.querySelector('.file-upload').addEventListener('click', function(e) {
    if (e.target.classList.contains('file-upload')) {
        this.querySelector('input[type="file"]').click();
    }
});
// タスクの残り時間表示の処理
function secToDayTime(seconds) {
    const day = Math.floor(seconds / 86400);
    const hour = Math.floor(seconds % 86400 / 3600);
    const min = Math.floor(seconds % 3600 / 60);
    const sec = seconds % 60;
    let time = '';
    // day が 0 の場合は「日」は出力しない（hour や min も同様）
    if (day !== 0) {
        time = `${day}日${hour}時間${min}分${sec}秒`;
    } else if (hour !== 0) {
        time = `${hour}時間${min}分${sec}秒`;
    } else if (min !== 0) {
        time = `${min}分${sec}秒`;
    } else {
        time = `${sec}秒`;
    }
    return time;
}

//カウントダウンエリア
const task_countdown = document.getElementById('countdown');
function Show_CountDown(deadline_unix) {

    // カウントダウンの終了日時を設定
    let countdownDate = new Date(deadline_unix * 1000);

    console.log(countdownDate.getTime());

    let interval = setInterval(function () {
        // 現在の日時を取得
        let now = new Date();

        //日本時間に変更
        now = new Date(now.getTime() + 9 * 60 * 60 * 1000);

        // カウントダウンまでの残り時間を計算
        let distance = Math.floor((countdownDate - now) / 1000);

        // カウントダウンが終了した場合はメッセージを表示してタイマーを停止
        if (distance < 0) {
            clearInterval(interval);
            $("#countdown").html("<span>カウントダウン終了</span>");
        } else {
            // 残り時間を表示
            // $("#days").text(days + ":");
            // $("#hours").text(hours + ":");
            // $("#minutes").text(minutes + ":");
            // $("#seconds").text(seconds + " ");

            $("#countdown_time").text(secToDayTime(distance));
        }
    }, 500); // 500ミリ秒ごとに更新
}
function Convert_Status(status) {
    switch (status) {
        case "In_Progress":
            return "着手中";
        case "Reported":
            return "報告済";
        default:
            return "不明";
    }
}

//パラメーターから取得
let url = new URL(window.location.href);
// URLSearchParamsオブジェクトを取得
let params = url.searchParams;
const taskid = params.get("taskid");

//メインコード
const back_button = document.getElementById("back_button");
back_button.addEventListener("click", async function () {
    //戻る
    window.location.href = "/statics/app/html/user/tasks/task_info.html?taskid=" + taskid;
})

//送信ボタン取得
const submit_button = document.getElementById("submit_button");

//フォーム取得
const task_report_form = document.getElementById('task_report_form');

//イベント抑制
task_report_form.addEventListener('submit',async (evt) => {
    evt.preventDefault();
    //タスクを報告
    await ReportTask();
})

async function ReportTask() {
    try {
        //ロード画面
        setLoadText("報告中");
        showLoading();

        //アクセストークン取得
        const access_token = await GetToken();

        //タスク報告
        const req = await fetch("/app/task/report", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + access_token,
            },
            body: JSON.stringify({
                "taskid": taskid,
                "comment": task_report_form.report_message.value
            })
        });

        //成功したか
        if (req.status != 200) {
            //json にする
            const res = await req.json();
            console.error(res);

            alert("報告に失敗しました");
            return;
        }

        //ファイルが選択されている場合
        if (task_report_form.report_image.files[0] != undefined) {
            setLoadText("ファイルアップロード中");

            //報告ID取得
            const res = await req.json();
            const reportid = res["reportid"];

            //ファイルアップロード
            const imgfile = task_report_form.report_image.files[0];
            const imgData = new FormData();
            imgData.append("img", imgfile);

            //ファイルアップロード
            const sendImg = await fetch("/app/task/report/image", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "reportid": reportid
                },
                body: imgData
            });

            //成功したか
            if (sendImg.status != 200) {
                //json にする
                const res = await sendImg.json();
                console.error(res);
                alert("アップロードに失敗しました");
            }
        }

        //戻る
        window.location.href = "/statics/app/html/user/tasks/task_info.html?taskid=" + taskid;
    } catch (err) {
        console.error(err);
    }

    //ロード画面隠す
    hideLoading();
}

async function main() {
    try {
        //アクセストークン取得
        const access_token = await GetToken();

        //タスク情報取得
        const task_info = await GetTask(taskid);

        console.log(task_info);

        //タスク情報表示
        document.getElementById('status-message').textContent = Convert_Status(task_info["Status"]);
        document.querySelector('h1').textContent = task_info["TaskName"];

        //自分の情報取得
        const req = await fetch("/app/account/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + access_token,
            }
        })

        //自信のID
        const res_json = await req.json();
        const my_id = res_json["memberid"];
        const my_role = res_json["role"];

        //タスクの宛先取得
        const member_id = task_info["MemberID"];

        //自分向けのタスクか
        if (member_id != my_id) {
            //自分向けではない場合
            back_button.click();
            return;
        }

        console.log(task_info["Status"]);

        //タスクが進行中か報告済みか
        if (task_info["Status"] != "In_Progress" && task_info["Status"] != "Reported") {
            //進行中か報告済みではない場合 戻る
            back_button.click();
            return;
        }

        //報告済みの場合
        if (task_info["Status"] == "Reported") {
            //報告済みの場合
            submit_button.textContent = "更新";
        }
    } catch (error) {

        console.error(error);
    }

    //ロード削除
    hideLoading();
}

//ロード生成
setLoadText("情報取得中");
showLoading();

//メイン
main();
            