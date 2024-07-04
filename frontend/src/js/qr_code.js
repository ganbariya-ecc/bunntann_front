const video = document.getElementById('video');
let contentWidth;
let contentHeight;

const constraints = {
    audio: false,
    video: {
        width: 640,
        height: 480,
        deviceId: null  // ここで物理カメラのdeviceIdを指定
    }
};

// デバイスを列挙して物理カメラを選択
navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        console.log('Devices:', devices);
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
            // videoの幅と高さが取得できるまで待機
            setTimeout(() => {
                contentWidth = video.videoWidth;
                contentHeight = video.videoHeight;
                cvs.width = contentWidth;
                cvs.height = contentHeight;
                canvasUpdate();
                checkImage();
            }, 1000);  // 1秒待機してから処理開始
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

const cvs = document.getElementById('camera-canvas');
const ctx = cvs.getContext('2d');
const canvasUpdate = () => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
        ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
    }
    requestAnimationFrame(canvasUpdate);
}

const rectCvs = document.getElementById('rect-canvas');
const rectCtx = rectCvs.getContext('2d');
const checkImage = () => {
    if (contentWidth > 0 && contentHeight > 0) {
        const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
        const code = jsQR(imageData.data, contentWidth, contentHeight);

        if (code) {
            console.log("QRcodeが見つかりました", code);
            drawRect(code.location);
            document.getElementById('qr-msg').textContent = `QRコード：${code.data}`;
        } else {
            console.log("QRcodeが見つかりません…", code);
            rectCtx.clearRect(0, 0, contentWidth, contentHeight);
            document.getElementById('qr-msg').textContent = `QRコード: 見つかりません`;
        }
        setTimeout(() => { checkImage() }, 500);
    }
}

const drawRect = (location) => {
    rectCvs.width = contentWidth;
    rectCvs.height = contentHeight;
    drawLine(location.topLeftCorner, location.topRightCorner);
    drawLine(location.topRightCorner, location.bottomRightCorner);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner);
    drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

const drawLine = (begin, end) => {
    rectCtx.lineWidth = 4;
    rectCtx.strokeStyle = "#F00";
    rectCtx.beginPath();
    rectCtx.moveTo(begin.x, begin.y);
    rectCtx.lineTo(end.x, end.y);
    rectCtx.stroke();
}
