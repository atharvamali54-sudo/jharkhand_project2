// सर्व समस्या साठवण्यासाठी ॲरे
let problems = [];

document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault(); // फॉर्म रीलोड रोखणे

    // युजरने इनपुट केलेली माहिती घेणे
    const name = document.getElementById('name').value;
    const district = document.getElementById('district').value;
    const domain = document.getElementById('domain').value;
    const photoInput = document.getElementById('problemPhoto');
    
    let photoName = "फोटो नाही";
    if (photoInput.files.length > 0) {
        photoName = photoInput.files[0].name;
    }

    // AI द्वारे विद्यापीठ ठरवण्याची लॉजिक (Automated Routing)
    let assignedUniversity = "रांची युनिव्हर्सिटी (Ranchi University)";
    if (domain === "Education") {
        assignedUniversity = "झारखंड केंद्रीय विद्यापीठ (Central University of Jharkhand)";
    } else if (domain === "Agriculture") {
        assignedUniversity = "बिरसा कृषी विद्यापीठ (Birsa Agricultural University)";
    } else if (domain === "Water" || domain === "Sanitation") {
        assignedUniversity = "बीआईटी सिंदरी, धनबाद (BIT Sindri)";
    }

    // नवीन समस्येचा ऑब्जेक्ट तयार करणे
    const newProblem = {
        name: name,
        district: district,
        domain: domain,
        photo: photoName,
        university: assignedUniversity
    };

    // लिस्टमार्फत समस्येचा डेटा ऍड करणे
    problems.push(newProblem);
    displayProblems(problems);

    // यशस्वी संदेश दाखवणे
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    successMsg.textContent = `धन्यवाद ${name}! समस्या यशस्वीपणे नोंदवली गेली आहे व ती AI द्वारे '${assignedUniversity}' कडे वर्ग केली आहे.`;

    // फॉर्म रिसेट करणे
    document.getElementById('problemForm').reset();
});

// डॅशबोर्डवर समस्या दाखवण्याचे फंक्शन
function displayProblems(probArray) {
    const listContainer = document.getElementById('problemList');
    
    if (probArray.length === 0) {
        listContainer.innerHTML = `<p style="color: #777; text-align: center;">अद्याप कोणतीही समस्या नोंदवली गेलेली नाही.</p>`;
        return;
    }

    let htmlContent = "";
    probArray.forEach((prob, index) => {
        htmlContent += `
            <div style="border-bottom: 1px solid #ddd; padding: 10px; margin-bottom: 5px; background: white;">
                <strong>क्र. ${index + 1} | विभाग: ${prob.domain}</strong><br>
                <span>👤 नागरिक: ${prob.name} | जिल्हा: ${prob.district}</span><br>
                <span>📎 फाईल: ${prob.photo}</span><br>
                <span style="color: #1b5e20; font-weight: bold;">🏛️ नेमलेले विद्यापीठ: ${prob.university}</span>
            </div>
        `;
    });
    listContainer.innerHTML = htmlContent;
}

// सर्च करण्यासाठी फंक्शन
function filterProblems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = problems.filter(p => 
        p.district.toLowerCase().includes(query) || p.domain.toLowerCase().includes(query)
    );
    displayProblems(filtered);
}