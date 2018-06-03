(function (params) {
    window.QRCODE = {
        add: function (left, top, color, width) {
            ppo.loadjs('../lib/qrcode.min.js', function (params) {
                if (!ppo.isMobile()) {
                    var qrcode = document.createElement('div');
                    qrcode.style.position = 'absolute';
                    qrcode.style.left = left ? left + 'px' : '10px';
                    qrcode.style.top = top ? top + 'px' : '10px';
                    qrcode.style.zIndex = 20;
                    document.body.appendChild(qrcode);

                    var qrcode = new QRCode(qrcode, {
                        text: window.location.href,
                        width: width || 128,
                        height: width || 128,
                        colorDark: color || "#107dc0",
                        colorLight: "#fff",
                        correctLevel: QRCode.CorrectLevel.L
                    });
                }
            });
        }
    }
})();