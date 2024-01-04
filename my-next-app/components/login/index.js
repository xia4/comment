function displayFileName() {
    const imageInput = document.getElementById('imageInput');
    const selectedFileName = document.getElementById('selectedFileName');

    if (imageInput.files.length > 0) {
        selectedFileName.textContent = 'Selected File: ' + imageInput.files[0].name;
    } else {
        selectedFileName.textContent = '';
    }
}

function saveUserInfo() {
    const nicknameInput = document.getElementById('nicknameInput').value;
    const imageInput = document.getElementById('imageInput');

    if (nicknameInput.trim() === '' ) {
        alert('닉네임을 기입해주세요.');
        return;
    } else if (imageInput.files.length === 0) {
        alert('이미지를 첨부해주세요.')
        return;
    }

    const selectedFile = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const userImg = e.target.result;

        localStorage.setItem('userId', nicknameInput);
        localStorage.setItem('userImg', userImg);

        window.location.href = '../form/index.html';
    }
    
    reader.readAsDataURL(selectedFile);
}

