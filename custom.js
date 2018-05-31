/*
* created by Una 2018-05-31
*/ 

// 左图
var i = 0;

// 左边小图的宽高     
var widthL = $('.canvas_left').width();
var heightL = $('.canvas_left').height();

var colors = ['black', 'red', 'green', 'blue', 'pink', 'aquamarine', 'olivedrab', 'blueviolet', 'maroon', 'chartreuse',
    'dodgerblue', 'magenta', 'lightseagreen', 'darkorchid', 'darkgoldenrod', 'lavender', 'midnightblue', 'darkgoldenrod', 'slategray', 'yellow']

var arrForDeleteLeft = [];
function drawLeft(e) {
    if(imgObj == null){return;}
    // 小图上面的点
    var topL = e["offsetY"];
    var leftL = e["offsetX"];
    
    // 大图的宽高
    var widthU = $('.up_left').width();
    var heightU = $('.up_left').height();
    
    // 大图的点
    var leftU = leftL * widthU / widthL;
    var topU = topL * heightU / heightL;

    var pointForLeft = $('<div class="pointForLeft"></div>').appendTo($('.left'));
    pointForLeft.css({ "top": topL - 5, "left": leftL - 5, "background-color": colors[i] });

    pointForLeft.attr('data-index-left', i);

    var pointForUp = $('<div class="pointForUp"></div>').appendTo($('.up_left'));
    pointForUp.css({ "top": topU - 5, "left": leftU - 5, "background-color": colors[i] });
    pointForUp.attr('data-index-up', i);

    i++;

    $('.up_left').nextAll().remove();
    $('.up_left').clone().appendTo('.up');

    arrForDeleteLeft[i - 1] = [($(pointForLeft)[0]), ($(pointForUp)[0])];
    
}

$('.draw_left').on('click', function () {
    if (this.innerHTML !== '画点左图start') {
        this.innerHTML = '画点左图start';
        $('.left').off('click');
    } else {
        this.innerHTML = '画点左图end';
        $('.left').on('click', function (e) {
            drawLeft(e);

        });
    }
});
$('.left').delegate('.pointForLeft', 'click', function () { return false; });

// 撤销 --> 左右图公用
$(document).on('keyup', function (event) {
    var e = window.event ? event : e;
    if (event.keyCode == 76) {
        $(arrForDeleteLeft[arrForDeleteLeft.length - 1]).remove();
        arrForDeleteLeft.pop();
    }
    if (event.keyCode == 82) {
        $(arrForDeleteRight[arrForDeleteRight.length - 1]).remove();
        arrForDeleteRight.pop();
    }
})

// 左图旋转+
$('#rotateBtnPlusLeft').on('click', function () {
    if (getTransformValue($('.left')).angle >= 360) return;
    $('.left').css('transform', 'scale(' + (getTransformValue($('.left')).scale) + ') rotate(' + (getTransformValue($('.left')).angle += 5) + 'deg)');
    $('.up_left').nextAll().remove();
    $('.up_left').clone().appendTo('.up');
    if ($('.up').offset().left >= 0) {
        $('.up').css({ "left": -$('.up_left').width() });
    }
    $('.up').css({ "left": -$('.up_left').width() + (getTransformValue($('.left')).angle * $('.up_left').width() / 360) });
    if ($('.up').offset().left <= -$('.up_left').width()) {
        $('.up').css({ "left": 0 + (getTransformValue($('.left')).angle * $('.up_left').width() / 360) })
    }
})

// 左图旋转-
$('#rotateBtnReduLeft').on('click', function () {
    if (getTransformValue($('.left')).angle <= -360) return;
    $('.left').css('transform', 'scale(' + (getTransformValue($('.left')).scale) + ') rotate(' + (getTransformValue($('.left')).angle -= 5) + 'deg)');
    $('.up_left').nextAll().remove();
    $('.up_left').clone().appendTo('.up');
    if ($('.up').offset().left >= 0) {
        $('.up').css({ "left": -$('.up_left').width() });
    }
    $('.up').css({ "left": -$('.up_left').width() + (getTransformValue($('.left')).angle * $('.up_left').width() / 360) })
    if ($('.up').offset().left <= -$('.up_left').width()) {
        $('.up').css({ "left": 0 + (getTransformValue($('.left')).angle * $('.up_left').width() / 360) })
    }
})

// 左图放大
$('#scaleBtnPlusLeft').on('click', function () {
    $('.left').css('transform', 'scale(' + (getTransformValue($('.left')).scale += 0.1) + ') rotate(' + getTransformValue($('.left')).angle + 'deg)');
})

// 左图缩小
$('#scaleBtnReduLeft').on('click', function () {
    $('.left').css('transform', 'scale(' + (getTransformValue($('.left')).scale -= 0.1) + ') rotate(' + getTransformValue($('.left')).angle + 'deg)');
})

// 左图保存
$('.save_left').on('click', function () {
    $('.left')[0].style.transform = 'rotate(0deg) scale(1)';
    $('.up').css({ "left": 0 });
    html2canvas($('.left')[0], {
        onrendered: function (canvas) {
            $('.image').remove();
            //添加属性
            canvas.setAttribute('id', 'thecanvas');
            //读取属性值
            $('#images').append('<div class="image"></div>');
            $('.image').append(canvas);
        }
    });
})

// 左图下载
$('.download_left')[0].onclick = function () {
    var oCanvas = document.getElementById("thecanvas");
    var img_data1 = Canvas2Image.saveAsPNG(oCanvas, true).getAttribute('src');
    saveFile(img_data1, 'imageA');
};

// 获取旋转角度  --> 左右图公用
function getTransformValue(element) {
    var tr = window.getComputedStyle(element[0], null).getPropertyValue("transform") || 'Fail';
    if (tr == 'none') {
        element.css('transform', 'rotate(0deg) scale(1)');
        tr = window.getComputedStyle(element[0], null).getPropertyValue("transform");
    }
    var values = tr.split('(')[1].split(')')[0].split(',');
    var a = values[0],
        b = values[1],
        c = values[2],
        d = values[3];
    var scale = Math.sqrt(a * a + b * b);
    var sin = b / scale;
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return {
        scale: scale,
        angle: angle
    }
}

$('.greyscaleLeft').on('click', function () {
    Caman(".canvas_left", function () {
        this.greyscale().render();
    });
});

var imgObj = null;
function loadImageLeft(elem) {
    imgObj = new Chobi(elem);
    imgObj.ready(function () {
        this.canvas = $(".canvas_left")[0];
        this.canvas.style.width = 500 + 'px';
        this.canvas.style.height = 400 + 'px';
        this.loadImageToCanvas();
        $('.left').css({"transform": "scale(1) rotate(0deg)", "left": 0, "top": 0});
        $('.pointForLeft').remove();
        $('.up').css({ "left": 0 });
        $('.pointForUp').remove();
        $(".up_leftPic").attr("src", this.canvas.toDataURL("image/png"))
    });
}

// 图片过滤色的函数
function filterLeft(id) {
    if (imgObj == null) {
        alert("Choose an image first!");
        return;
    }    
    switch (id) {
        case 0:
            imgObj.blackAndWhite();
            break;
        case 1:
            imgObj.negative();
            break;
        case 2:
            imgObj.brightness(1);
            break;
        case 3:
            imgObj.brightness(-1);
            break;
        case 4:
            imgObj.contrast(1);
            break;
        case 5:
            imgObj.contrast(-1);
            break;
    }
    imgObj.loadImageToCanvas();
}

// 移动
function moveLeft(e) {
    if(imgObj == null){return;}
    $('.left').off("mousedown").mousedown(function (e) {
        var self = this;
        var event = event || window.event;
        var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
        var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
        var boxX = pageX - self.offsetLeft;
        var boxY = pageY - self.offsetTop;        
        document.onmousemove = function (e) {            
            var event = event || window.event;
            var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
            var X = pageX - boxX;
            var Y = pageY - boxY;
            if(e['clientX'] <=0 || e['clientY'] <= 0 || e['clientX'] >= 500 || e['clientY'] >= 400){
                document.onmousemove = function () { };
            }
            self.style.top = Y + "px";
            self.style.left = X + "px";
        };
    }).off("mouseup").mouseup(function () {
        document.onmousemove = function () { };
    });
};
$('.move_left').on('click', function () {
    if (this.innerHTML !== '移动左图start') {
        this.innerHTML = '移动左图start';
        (function moveLeft() {
            $('.left').off('mousedown');
            $('.left').off('mousemove');
            $('.left').off('mouseup');
        })()
    } else {
        this.innerHTML = '移动左图end';
        moveLeft();
    }
});


// ----------------------------------------------------------------------------
// 右图

var j = 0;
// 右边小图的宽高
var widthR = $('.right').width();
var heightR = $('.right').height();

var arrForDeleteRight = [];
function drawRight(e){
    if(imgObjRight == null){return;}
    // 小图上面的点
    var topR = e["offsetY"];
    var leftR = e["offsetX"];

    // 大图的宽高
    var widthD = $('.down_right').width();
    var heightD = $('.down_right').height();
    // 大图的点
    var leftD = leftR * widthD / widthR;
    var topD = topR * heightD / heightR;

    var pointForRight = $('<div class="pointForRight"></div>').appendTo($('.right'));
    pointForRight.css({ "top": topR - 5, "left": leftR - 5, "background-color": colors[j] });
    pointForRight.attr('data-index-left', j);

    var pointForDown = $('<div class="pointForDown"></div>').appendTo($('.down_right'));
    pointForDown.css({ "top": topD - 5, "left": leftD - 5, "background-color": colors[j] });
    pointForDown.attr('data-index-up', j);

    j++;

    $('.down_right').nextAll().remove();
    $('.down_right').clone().appendTo('.down');

    arrForDeleteRight[j - 1] = [($(pointForRight)[0]), ($(pointForDown)[0])];
}

// 右图画点
$('.draw_right').on('click', function () {
    if (this.innerHTML !== '画点右图start') {
        this.innerHTML = '画点右图start';
        $('.right').off('click');
    } else {
        this.innerHTML = '画点右图end';
        $('.right').on('click', function (e) {
            drawRight(e);

        });
    }
});

$('.right').delegate('.pointForRight', 'click', function () { return false; });

// 右图旋转+
$('#rotateBtnPlusRight').on('click', function () {
    if (getTransformValue($('.right')).angle >= 360) return;
    $('.right').css('transform', 'rotate(' + (getTransformValue($('.right')).angle += 5) + 'deg) scale(' + (getTransformValue($('.right')).scale) + ')');
    $('.down_right').nextAll().remove();
    $('.down_right').clone().appendTo('.down');
    if ($('.down').offset().left >= 0) {
        $('.down').css({ "left": -$('.down_right').width() });
    }
    $('.down').css({ "left": -$('.down_right').width() + (getTransformValue($('.right')).angle * $('.down_right').width() / 360) });
    if ($('.down').offset().left <= -$('.down_right').width()) {
        $('.down').css({ "left": 0 + (getTransformValue($('.right')).angle * $('.down_right').width() / 360) })
    }
})

// 右图旋转-
$('#rotateBtnReduRight').on('click', function () {
    if (getTransformValue($('.right')).angle <= -360) return;
    $('.right').css('transform', 'rotate(' + (getTransformValue($('.right')).angle -= 5) + 'deg)  scale(' + (getTransformValue($('.right')).scale) + ')');
    $('.down_right').nextAll().remove();
    $('.down_right').clone().appendTo('.down');
    if ($('.down').offset().left >= 0) {
        $('.down').css({ "left": -$('.down_right').width() });
    }
    $('.down').css({ "left": -$('.down_right').width() + (getTransformValue($('.right')).angle * $('.down_right').width() / 360) })
    if ($('.down').offset().left <= -$('.down_right').width()) {
        $('.down').css({ "left": 0 + (getTransformValue($('.right')).angle * $('.down_right').width() / 360) })
    }
})

// 右图放大
$('#scaleBtnPlusRight').on('click', function () {
    $('.right').css('transform', 'scale(' + (getTransformValue($('.right')).scale += 0.1) + ') rotate(' + getTransformValue($('.right')).angle + 'deg)');
})

// 右图缩小
$('#scaleBtnReduRight').on('click', function () {
    $('.right').css('transform', 'scale(' + (getTransformValue($('.right')).scale -= 0.1) + ') rotate(' + getTransformValue($('.right')).angle + 'deg)');
})

// 右边工具栏的高度
$('.tools').css('height', $('.container').height());

// 右图保存
$('.save_right').on('click', function () {
    $('.right')[0].style.transform = 'rotate(0deg) scale(1)';
    $('.down').css({ "left": 0 });
    html2canvas($('.right')[0], {
        onrendered: function (canvas) {
            $('.image').remove();
            //添加属性
            canvas.setAttribute('id', 'thecanvas');
            //读取属性值
            $('#images').append('<div class="image"></div>');
            $('.image').append(canvas);
        }
    });
});

// 右图下载
$('.download_right')[0].onclick = function () {
    var oCanvas = document.getElementById("thecanvas");
    var img_data1 = Canvas2Image.saveAsPNG(oCanvas, true).getAttribute('src');
    saveFile(img_data1, 'imageB');
}

var saveFile = function (data, filename) {
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};

$('.greyscaleRight').on('click', function () {
    Caman(".canvas_right", function () {
        this.greyscale().render();
    });
});

var imgObjRight = null;
function loadImageRight(elem) {
    imgObjRight = new Chobi(elem);
    imgObjRight.ready(function () {
        this.canvas = $(".canvas_right")[0];
        this.canvas.style.width = 500 + 'px';
        this.canvas.style.height = 400 + 'px';
        this.loadImageToCanvas();
        $('.right').css({"transform": "scale(1) rotate(0deg)", "left": 0, "top": 0});
        $('.pointForRight').remove();
        $('.down').css({ "left": 0 });
        $('.pointForDown').remove();
        $(".down_rightPic").attr("src", this.canvas.toDataURL("image/png"))
    });
}

// 图片过滤色的函数
function filterRight(id) {
    if (imgObjRight == null) {
        alert("Choose an image first!");
        return;
    }
    switch (id) {
        case 0:
            imgObjRight.blackAndWhite();
            break;
        case 1:
            imgObjRight.negative();
            break;
        case 2:
            imgObjRight.brightness(1);
            break;
        case 3:
            imgObjRight.brightness(-1);
            break;
        case 4:
            imgObjRight.contrast(1);
            break;
        case 5:
            imgObjRight.contrast(-1);
            break;
    }
    imgObjRight.loadImageToCanvas();
}



function moveRight(e) {
    if(imgObjRight == null){return;}
    $('.right').off("mousedown").mousedown(function (e) {
        var self = this;
        var event = event || window.event;
        var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
        var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
        var boxX = pageX - self.offsetLeft;
        var boxY = pageY - self.offsetTop;
        document.onmousemove = function (e) {
            var event = event || window.event;
            var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
            var X = pageX - boxX;
            var Y = pageY - boxY;
            if(e['clientX'] <=500 || e['clientY'] <= 0 || e['clientX'] >= 1000 || e['clientY'] >= 400){
                document.onmousemove = function () { };
            }
            self.style.top = Y + "px";
            self.style.left = X + "px";
        };
    }).off("mouseup").mouseup(function () {
        document.onmousemove = function () { };
    });
};
$('.move_right').on('click', function () {
    if (this.innerHTML !== '移动右图start') {
        this.innerHTML = '移动右图start';
        (function moveRight() {
            $('.right').off('mousedown');
            $('.right').off('mousemove');
            $('.right').off('mouseup');
        })()
    } else {
        this.innerHTML = '移动右图end';
        moveRight();
    }
});
