document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('camera-canvas');
    const rectCanvas = document.getElementById('rect-canvas');
    const qrMessage = document.getElementById('qr-msg');
    const ctx = canvas.getContext('2d');
    const rectCtx = rectCanvas.getContext('2d');

    let contentWidth, contentHeight;

    // メディアデバイスへのアクセスの制約
    const constraints = {
        audio: false,
        video: {
            width: 640,
            height: 480,
            deviceId: null
        }
    };

    // メディアデバイスを列挙して物理カメラを選択する
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length === 0) {
                throw new Error('No video devices found');
            }

            // 物理カメラのdeviceIdを取得
            const physicalCamera = videoDevices.find(device => device.label && !device.label.includes('Virtual'));
            if (physicalCamera) {
                constraints.video.deviceId = { exact: physicalCamera.deviceId };
            } else {
                throw new Error('No physical camera found');
            }

            return navigator.mediaDevices.getUserMedia(constraints);
        })
        .then((stream) => {
            video.srcObject = stream;
            video.onloadeddata = () => {
                video.play();
                // ビデオの幅と高さを取得する
                setTimeout(() => {
                    contentWidth = video.videoWidth;
                    contentHeight = video.videoHeight;
                    canvas.width = contentWidth;
                    canvas.height = contentHeight;
                    canvasUpdate();
                    checkImage();
                }, 1000);  // 1秒待ってから処理を開始する
            };
        })
        .catch((error) => {
            console.error('Error accessing media devices.', error);
            let errorMessage = `カメラへのアクセスに失敗しました: ${error.message}`;
            if (error.name === 'NotAllowedError') {
                errorMessage += ' - カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。';
            } else if (error.name === 'NotFoundError') {
                errorMessage += ' - カメラデバイスが見つかりません。接続を確認してください。';
            } else if (error.name === 'OverconstrainedError') {
                errorMessage += ' - 指定された制約に一致するカメラが見つかりません。制約を緩和してください。';
            }
            alert(errorMessage);
        });

    // キャンバスを更新する関数
    const canvasUpdate = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
        }
        requestAnimationFrame(canvasUpdate);
    };

    // 画像を確認する関数
    const checkImage = () => {
        if (contentWidth > 0 && contentHeight > 0) {
            const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
            const code = jsQR(imageData.data, contentWidth, contentHeight);

            if (code) {
                console.log("QRcodeが見つかりました", code);
                drawRect(code.location);
                qrMessage.textContent = `QRコード：${code.data}`;
            } else {
                console.log("QRcodeが見つかりません…");
                rectCtx.clearRect(0, 0, contentWidth, contentHeight);
                qrMessage.textContent = `QRコード: 見つかりません`;
            }
            setTimeout(checkImage, 500);
        }
    };

    // 矩形を描画する関数
    const drawRect = (location) => {
        rectCanvas.width = contentWidth;
        rectCanvas.height = contentHeight;
        drawLine(location.topLeftCorner, location.topRightCorner);
        drawLine(location.topRightCorner, location.bottomRightCorner);
        drawLine(location.bottomRightCorner, location.bottomLeftCorner);
        drawLine(location.bottomLeftCorner, location.topLeftCorner);
    };

    // 線を描画する関数
    const drawLine = (begin, end) => {
        rectCtx.lineWidth = 4;
        rectCtx.strokeStyle = "#F00";
        rectCtx.beginPath();
        rectCtx.moveTo(begin.x, begin.y);
        rectCtx.lineTo(end.x, end.y);
        rectCtx.stroke();
    };
});
