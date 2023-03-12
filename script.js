const simpleNums = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

class RSA {
    p = 0;
    q = 0;
    n = 0;
    e = 3;
    d = -1;
    msg = '';

    encode(msg) {
        let char;
        let result = [];
        this.generateKeys();
        let codes = msg.split('').map(x => x = x.charCodeAt(0));
        for (let j = 0; j < msg.length; j++) {
            char = 1;
            for (let i = 0; i < this.e; i++) {
                char = (char * codes[j]) % this.n;
            }
            result.push(char);
        }
        return result.join(' ');
    }

    decode(code, d, n) {
        let char;
        let result = '';
        this.d = d;
        this.n = n;        
        code = code.split(" ");
        for (let k = 0; k < code.length; k++) {
            char = 1;
            for (let i = 0; i < this.d; i++) {
                char = (char * code[k]) % this.n;
            }
            result += String.fromCharCode(char);
        }
        return result;
    }

    generateKeys() {
        let size = simpleNums.length;
        while (this.q == this.p) {
            this.q = simpleNums[Math.floor(Math.random() * size)];
            this.p = simpleNums[Math.floor(Math.random() * size)];
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
    if (!b) return a;
    return gcd(b, a % b);
}

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

