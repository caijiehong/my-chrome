console.log('JS Begin')

var pre = document.body.getElementsByTagName('Pre')[0];
var ar = pre.innerHTML.split('\n');
var commemtFlag = false;
for (var i = 0; i < ar.length; i++) {
    var text = ar[i].trim();
    var leftPad = ar[i].substring(0, ar[i].indexOf(text));

    if (commemtFlag) {
        if (text.lastIndexOf('*/') + 2 == text.length) {
            commemtFlag = false;
        }
        text = '<span style="color:rgb(0, 128, 0)">' + text + '</span>';
    } else {
        if (text.indexOf('/*') == 0) {
            commemtFlag = true;
            text = '<span style="color:rgb(0, 128, 0)">' + text + '</span>';
        } else if (text.indexOf('//') == 0) {
            text = '<span style="color:rgb(0, 128, 0)">' + text + '</span>';
        } else {
            var r1 = new RegExp("'([^']*)'", 'g');
            text = text.replace(r1, "<span style='color:#a31515'>'$1'</span>");
            var r1 = new RegExp('"([^"]*)"', 'g');
            text = text.replace(r1, '<span style="color:#a31515">"$1"</span>');

            var keyword = ['var', 'function', 'for', 'default', 'true', 'false', 'break', 'switch', 'if', 'this', 'return', 'new', 'else'];
            for (var j = 0; j < keyword.length; j++) {
                var r = new RegExp('\\b' + keyword[j] + '\\b', 'g');
                text = text.replace(r, '<span style="color:blue">' + keyword[j] + '</span>');
            }
        }
    }
    ar[i] = leftPad + text;
}
pre.innerHTML = ar.join('\n');

console.log('JS Done')
