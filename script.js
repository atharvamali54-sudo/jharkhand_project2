// लोकल स्टोरेज मधून डेटा लोड करणे (Local Storage Initialization)
let problems = JSON.parse(localStorage.getItem('jharkhand_problems')) || [];
let uniSolutions = JSON.parse(localStorage.getItem('jharkhand_uni_solutions')) || [];
let industryPartnersCount = parseInt(localStorage.getItem('jharkhand_partners_count')) || 0;

// पेज लोड झाल्यावर डॅशबोर्ड आणि ट्रॅकर अपडेट करणे
window.onload = function() {
    displayProblems(problems);
    displayUniSolutions(uniSolutions);
    updateTrackerStats();
    renderAdminPanel();
};

// समस्या फॉर्म सबमिट करणे
document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const district = document.getElementById('district').value;
    const domain = document.getElementById('domain').value;
    const photoInput = document.getElementById('problemPhoto');
    
    let photoName = "फोटो नाही";
    if (photoInput.files.length > 0) {
        photoName = photoInput.files[0].name;
    }

    let assignedUniversity = "रांची युनिव्हर्सिटी (Ranchi University)";
    if (domain === "Education") {
        assignedUniversity = "झारखंड केंद्रीय विद्यापीठ (Central University of Jharkhand)";
    } else if (domain === "Agriculture") {
        assignedUniversity = "बिरसा कृषी विद्यापीठ (Birsa Agricultural University)";
    } else if (domain === "Water" || domain === "Sanitation") {
        assignedUniversity = "बीआईटी सिंदरी, धनबाद (BIT Sindri)";
    }

    const newProblem = {
        id: Date.now(),
        name: name,
        district: district,
        domain: domain,
        photo: photoName,
        university: assignedUniversity,
        status: "नवीन (New)"
    };

    problems.push(newProblem);
    localStorage.setItem('jharkhand_problems', JSON.stringify(problems));

    displayProblems(problems);
    updateTrackerStats();
    renderAdminPanel();

    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    successMsg.textContent = `धन्यवाद ${name}! समस्या नोंदवली व '${assignedUniversity}' कडे वर्ग केली.`;

    document.getElementById('problemForm').reset();
});

// डॅशबोर्डवर समस्या दाखवणे
function displayProblems(probArray) {
    const listContainer = document.getElementById('problemList');
    if (probArray.length === 0) {
        listContainer.innerHTML = `<p style="color: #777; text-align: center;">अद्याप कोणतीही समस्या नोंदवली गेलेली नाही.</p>`;
        return;
    }

    let htmlContent = "";
    probArray.forEach((prob, index) => {
        htmlContent += `
            <div style="border-bottom: 1px solid #ddd; padding: 10px; margin-bottom: 8px; background: white; border-radius: 6px;">
                <strong>क्र. ${index + 1} | विभाग: ${prob.domain}</strong> | <span style="background:#e8f5e9; padding:2px 6px; border-radius:4px; color:#2e7d32;">${prob.status}</span><br>
                <span>👤 नागरिक: ${prob.name} | जिल्हा: ${prob.district}</span><br>
                <span>🏛️ विद्यापीठ: ${prob.university}</span>
            </div>
        `;
    });
    listContainer.innerHTML = htmlContent;
}

// विद्यापीठ उपाय सबमिट करणे
document.getElementById('uniForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const uniName = document.getElementById('uniName').value;
    const solTitle = document.getElementById('solTitle').value;
    const solDesc = document.getElementById('solDesc').value;

    const newSol = { uniName, solTitle, solDesc };
    uniSolutions.push(newSol);
    localStorage.setItem('jharkhand_uni_solutions', JSON.stringify(uniSolutions));

    displayUniSolutions(uniSolutions);
    alert('विद्यापीठाचा उपाय यशस्वीपणे प्रकाशित झाला!');
    document.getElementById('uniForm').reset();
});

function displayUniSolutions(solArray) {
    const container = document.getElementById('uniSolutionsList');
    if (solArray.length === 0) {
        container.innerHTML = `<p style="color: #777; text-align: center; font-size:13px;">अद्याप कोणतेही संशोधन जोडलेले नाही.</p>`;
        return;
    }
    let html = "";
    solArray.forEach(s => {
        html += `<div style="background:white; padding:10px; margin-bottom:6px; border-radius:6px; border-left:4px solid #1b5e20;">
            <strong>🏫 ${s.uniName}</strong>: <em>${s.solTitle}</em><br><p style="margin:4px 0 0; font-size:13px; color:#555;">${s.solDesc}</p>
        </div>`;
    });
    container.innerHTML = html;
}

// उद्योग फॉर्म
document.getElementById('industryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const compName = document.getElementById('compName').value;
    industryPartnersCount++;
    localStorage.setItem('jharkhand_partners_count', industryPartnersCount);
    updateTrackerStats();

    const msg = document.getElementById('industryMsg');
    msg.style.display = 'block';
    msg.textContent = `धन्यवाद ${compName}! तुमची भागिदारी नोंदवली गेली आहे.`;
    document.getElementById('industryForm').reset();
});

// ॲडमिन पॅनेल (स्टेटस बदलणे)
function renderAdminPanel() {
    const adminContainer = document.getElementById('adminList');
    if (problems.length === 0) {
        adminContainer.innerHTML = `<p style="text-align:center; color:#777;">तपासण्यासाठी कोणतीही समस्या नाही.</p>`;
        return;
    }
    let html = "";
    problems.forEach((p, idx) => {
        html += `<div style="background:white; padding:8px; margin-bottom:5px; border-radius:5px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
            <span><b>${p.domain}</b> (${p.district}) - [सध्या: <b>${p.status}</b>]</span>
            <select onchange="updateStatus(${p.id}, this.value)" style="padding:4px; border-radius:4px;">
                <option value="नवीन (New)">स्टेटस बदला</option>
                <option value="मान्यता प्राप्त (Approved)">Approved</option>
                <option value="संशोधनाधीन (Under Research)">Under Research</option>
                <option value="पूर्ण झाले (Resolved)">Resolved</option>
            </select>
        </div>`;
    });
    adminContainer.innerHTML = html;
}

function updateStatus(id, newStatus) {
    let prob = problems.find(p => p.id === id);
    if (prob) {
        prob.status = newStatus;
        localStorage.setItem('jharkhand_problems', JSON.stringify(problems));
        displayProblems(problems);
        renderAdminPanel();
    }
}

// ट्रॅकर अपडेट्स
function updateTrackerStats() {
    document.getElementById('countReceived').innerText = problems.length;
    document.getElementById('countAssigned').innerText = problems.length;
    document.getElementById('countPartners').innerText = industryPartnersCount;
}

// भाषा बदलण्याचे फंक्शन (Bilingual Toggle - Marathi/English)
let currentLang = 'mr';
function toggleLanguage() {
    currentLang = currentLang === 'mr' ? 'en' : 'mr';
    document.getElementById('langBtn').innerText = currentLang === 'mr' ? 'English' : 'मराठी';
    
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
}

// सर्च फिल्टर
function filterProblems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = problems.filter(p => 
        p.district.toLowerCase().includes(query) || p.domain.toLowerCase().includes(query)
    );
    displayProblems(filtered);
}