document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault(); // फॉर्म रीलोड होण्यापासून रोखणे

    // युजरने इनपुट केलेली माहिती घेणे
    const name = document.getElementById('name').value;
    const district = document.getElementById('district').value;
    const domain = document.getElementById('domain').value;
    const photoInput = document.getElementById('problemPhoto');
    
    // फाईल अपलोड झाली का ते तपासणे
    let photoName = "";
    if (photoInput.files.length > 0) {
        photoName = photoInput.files[0].name;
    }

    // यशस्वी संदेश दाखवणे
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    successMsg.textContent = `धन्यवाद ${name}! तुमच्या ${district} जिल्ह्यातील (${domain}) विभागातील समस्या आणि अपलोड केलेली फाईल (${photoName}) यशस्वीपणे नोंदवली गेली आहे. AI मॉडेलद्वारे ती योग्य विद्यापीठाकडे पाठवली जात आहे.`;

    // फॉर्म रिसेट करणे
    document.getElementById('problemForm').reset();
});
