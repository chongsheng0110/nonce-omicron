// credentialsCheck.js
function checkCredentials() {
    var cryptoObj = window.crypto.subtle;

    var username = document.getElementById('username').value;
    var surname = document.getElementById('surname').value;
    var password = document.getElementById('password').value;

    cryptoObj.digest('SHA-256', new TextEncoder().encode(username)).then((hashed) => {
        var usernameHash = bufferToHex(hashed);
        cryptoObj.digest('SHA-256', new TextEncoder().encode(surname)).then((hashed) => {
            var surnameHash = bufferToHex(hashed);
            cryptoObj.digest('SHA-256', new TextEncoder().encode(password)).then((hashed) => {
                var passwordHash = bufferToHex(hashed);

                if (usernameHash === 'b35711f3f896189ca28453bc8031cb1bcb4f71295d052b132618e992b82e0874' && surnameHash === '8c169dc34d5c70ad61af81211376c27bc4e438c2b4a0207f4fb72f330b42902f' && passwordHash === '3c54eea70ebabbfb577d27a968ba8ce41d8616519319cc1ee1050e1dc125a3c4') {
                    window.location.href = 'success.html';
                } else {
                    window.location.href = 'entry.html';
                }
            });
        });
    });

    return false;
}

function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
