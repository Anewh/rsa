class RSA {
    p = 0;
    q = 0;
    n = 0;
    e = 3;
    d = -1;
    eiler = 0;
    simpleNums = [11, 13, 17, 19, 23, 29, 31, 37];
    msg = '';

    encode(msg, e, n) {
        if (!n || !e) {
            this.generateKeys();
        } else {
            this.e = e;
            this.n = n;
        }
        let b;
        let tmp;
        let result = [];
        for (let j = 0; j < msg.length; j++) {
            b = msg.charCodeAt(j);
            tmp = 1;
            for (let i = 0; i < this.e; i++) {
                tmp = (tmp * b) % this.n;
            }
            result.push(tmp);
        }
        return result.join(' ');
    }

    decode(code, d, n) {
        this.d = d;
        this.n = n;        
        code = code.split(" ");
        let b;
        let tmp;
        let result = '';
        for (let k = 0; k < code.length; k++) {
            b = code[k];
            tmp = 1;
            for (let i = 0; i < this.d; i++) {
                tmp = (tmp * b) % this.n;
            }
            result += String.fromCharCode(tmp);
        }
        return result;
    }

    generateKeys() {
        let size = this.simpleNums.length;
        while (this.q == this.p) {
            this.q = this.simpleNums[Math.floor(Math.random() * size)];
            this.p = this.simpleNums[Math.floor(Math.random() * size)];
        }
        this.n = this.q * this.p;
        this.eiler = (this.p - 1) * (this.q - 1);
        while (gcd(this.e, this.eiler) != 1) {
            this.e += 2;
        }
        while ((this.e * this.d) % this.eiler != 1) {
            this.d++;
        }
        while (this.e >= this.eiler || this.d >= this.eiler) {
            this.generateKeys();
        }
        this.msg = " d: "+this.d + "<br>" + "n: "+ this.n + "<br>";// + " e: " + this.e + "<br>";
        console.log("e: " + this.e + '\n');
    }

}

var gcd = function (a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

// let text = "text for console example";
// let rsa = new RSA();
// code = rsa.encode(text);
// console.log(rsa.decode(code));


document.getElementById('encode').addEventListener("click", function (e) {
    document.getElementById("resultEncode").innerHTML = "";
    let rsa = new RSA();
    let result = rsa.encode(document.getElementById('text').value);
    document.getElementById("resultEncode").innerHTML = rsa.msg + result; 
});

document.getElementById('decode').addEventListener("click", function (e) {
    document.getElementById("initialDataError").innerHTML = '';
    if(document.getElementById('n-decode').value == '' ||  document.getElementById('d').value == ''){
        document.getElementById("initialDataError").innerHTML = 'Значения n и d не могут быть пустыми при декодировании';       
        document.getElementById("initialDataError").style.display = 'block';
        console.log("пустые ключи");
        return;
    }
    document.getElementById("resultDecode").innerHTML = "";
    let rsa = new RSA();
    let result = rsa.decode(document.getElementById('code').value, document.getElementById('d').value, document.getElementById('n-decode').value);
    document.getElementById("resultDecode").innerHTML = result;
    
});


function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

document.getElementById('dataLoad').addEventListener("change", function(e){ 
    var reader = new FileReader();
	reader.readAsText(e.target.files[0], "UTF-8");
	reader.onload = (function (e) {
        document.getElementById('text').value = e.target.result;
        console.log( e.target.result);
	});
});

document.getElementById('dataSave').addEventListener('click', function (event) { 
	download(document.getElementById('text').value, 'inputData.txt', 'text/plain');
});

document.getElementById('resultSave').addEventListener('click', function (event) {
	download(document.getElementById('resultDecode').value, 'result.txt', 'text/plain');
});
