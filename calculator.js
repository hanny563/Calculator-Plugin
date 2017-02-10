var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', 'x', '/', '%', 'Xy'];
var decimalAdded = false;

function calculate(select) {

    var symbol = {
        sum: '+',
        minus: '-',
        div: '/',
        mul: '*',
        mod: '%',
        power: '^'
    };

    symbol.ooo = [[[symbol.sum], [symbol.minus], [symbol.div], [symbol.mul]], [[symbol.mod], [symbol.power]]];

    select = select.replace(/[^0-9%^*\/()\-+.]/g, '');

    var output;
    for (var i = 0, n = symbol.ooo.length; i < n; i++) {

        var re = new RegExp('(\\d+\\.?\\d*)([\\' + symbol.ooo[i].join('\\') + '])(\\d+\\.?\\d*)');
        re.lastIndex = 0;

        while (re.test(select)) {
            output = calc_internal(RegExp.$1, RegExp.$2, RegExp.$3);
            if (isNaN(output) || !isFinite(output)) return output;
            select = select.replace(re, output);
        }
    }

    return output;

    function calc_internal(a, op, b) {
        a = a * 1; b = b * 1;

        if (op == symbol.sum) {
            return a + b;
        }
        else if (op == symbol.minus) {
            return a - b;
        }
        else if (op == symbol.div) {
            return a / b;
        }
        else if (op == symbol.mul) {
            return a * b;
        }
        else if (op == symbol.mod) {
            return a % b
        }
        else if (op == symbol.power) {
            return Math.pow(a, b);
        }
        else {
            return null;
        }
    }
}

for (var i = 0; i < keys.length; i++) {
    keys[i].onclick = function (e) {
        var input = document.querySelector('.screen');
        var inputVal = input.textContent;
        var button = this.textContent;

        if (button == 'copy') {
            var copy = function (nmbr, mimetype) {
                document.oncopy = function (event) {
                    event.clipboardData.setData(mimetype, nmbr);
                    event.preventDefault();
                };
                document.execCommand('Copy', false, null);
            }
            copy(inputVal, 'text/plain');
            button = '';
        }
        if (button == 'clear') {
            input.textContent = '';
            decimalAdded = false;
        }

        else if (button == '=') {
            var equation = inputVal;
            var lastChar = equation[equation.length - 1];

            equation = equation.replace(/x/g, '*');

            if (lastChar == '%') {
                var operate = new RegExp("[-+*x]");
                equation = equation.replace(/%/g, '/100');
                var prefix = '';
                for (var f = 0; f < inputVal.length; f++) {
                    if (prefix.match(operate)) {
                        break;
                    } else if (inputVal.charAt(f) == '%') {
                        prefix = '';
                        break;
                    }
                    prefix += inputVal.charAt(f);
                }
                equation = equation + '*' + prefix;
            } else if (lastChar != '%' && inputVal.indexOf('%') > -1) {
                equation = equation.replace(/%/, '/100*');
            }

            if (operators.indexOf(lastChar) > -1 || lastChar == '.' || lastChar == '^')
                equation = equation.replace(/(^)|.$/, '');

            if (equation)
                input.textContent = calculate(equation);

            if (input.textContent.length > 14) {
                var n;
                var divs = document.getElementsByClassName('screen');
                for (n = 0; n < divs.length; n++) {
                    if (divs[n].className == 'screen') {
                        divs[n].textContent = divs[n].textContent.substring(0, 15);
                    }
                }

                if (!decimalAdded) {
                    input.textContent = calculate(equation).toPrecision(14);
                }
            }

            decimalAdded = false;
        }

        else if (operators.indexOf(button) > -1) {
            var lastChar = inputVal[inputVal.length - 1];

            if (inputVal != '' && operators.indexOf(lastChar) == -1)
                input.textContent += button;

            else if (inputVal == '' && button == '-')
                input.textContent += button;

            if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
                input.textContent = inputVal.replace(/.$/, button);
            }

            if (inputVal != '' && button == 'Xy') {
                input.textContent = inputVal.replace(/Xy/, '');
                var supTag = document.createElement('SUP');
                var expNode = document.createTextNode('^');
                supTag.setAttribute("id", "powerid");
                input.appendChild(supTag);
                supTag.appendChild(expNode);
            }

            if (inputVal.indexOf('^') > -1) {
                input.textContent = inputVal.replace(/^$/, '');
            }

            if (inputVal.indexOf('/') > -1 && button == '%') {
                input.textContent = inputVal.replace(/%/, '');
            }

            decimalAdded = false;
        }

        else if (inputVal == Number.POSITIVE_INFINITY || inputVal == Number.NEGATIVE_INFINITY) {
            input.textContent = inputVal.replace(/Infinity/ig, '');
        }
        else if (inputVal === 'NaN') {
            input.textContent = inputVal.replace(/NaN/ig, '');
        }

        else if (button == '.') {
            if (!decimalAdded && inputVal != '') {
                input.textContent += button;
                decimalAdded = true;
            }
        }

        else {
            input.textContent += button;
        }

        e.preventDefault();
    }
}