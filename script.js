let problems = JSON.parse(localStorage.getItem('jharkhand_secure_problems')) || [];
let uniSolutions = JSON.parse(localStorage.getItem('jharkhand_secure_sols')) || [];

let currentUser = JSON.parse(localStorage.getItem('jharkhand_current_user')) || null;

// पेज लोड झाल्यावर चेक करणे की युजर आधीच लॉगिन आहे का
window.onload = function() {
    if (currentUser) {
        showDashboard(currentUser);
    }
};

// लॉगिन प्रक्रिया (Login Handler)
function handleLogin() {
    const role = document.getElementById('loginRole').value;
    const username = document.getElementById('loginUsername').value.trim();

    if (!username) {
        alert('कृपया तुमचे नाव प्रविष्ट करा!');
        return;
    }

    currentUser = { username, role };
    localStorage.setItem('jharkhand_current_user', JSON.stringify(currentUser));

    showDashboard(currentUser);
}

// युजरच्या रोलनुसार डॅशबोर्ड दाखवणे (Privacy Guard)
function showDashboard(user) {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('mainHeader').classList.remove('hidden');

    document.getElementById('welcomeUser').innerText = `स्वागत आहे, ${user.username} (${user.role.toUpperCase()})`;

    // सर्व डॅशबोर्ड लपवणे
    document.getElementById('citizen-dashboard').classList.add('hidden');
    document.getElementById('university-dashboard').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');

    // संबंधित युजरचाच डॅशबोर्ड ओपन करणे
    if (user.role === 'citizen') {
        document.getElementById('citizen-dashboard').classList.remove('hidden');
        renderCitizenData(user.username);
    } else if (user.role === 'university') {
        document.getElementById('university-dashboard').classList.remove('hidden');
        renderUniversityData();
    } else if (user.role === 'admin') {
        document.getElementById('admin-dashboard').classList.remove('hidden');
        renderAdminData();
    }
}

// लॉग आउट (Logout)
function logout() {
    localStorage.removeItem('jharkhand_current_user');
    currentUser = null;
    document.getElementById('mainHeader').classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');
    
    // डॅशबोर्ड लपवणे
    document.querySelectorAll('.form-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

// 1. नागरिक डॅशबोर्ड डेटा (फक्त स्वतःच्या समस्या दिसतील)
document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const domain = document.getElementById('domain').value;
    const district = document.getElementById('district').value;
    const description = document.getElementById('description').value;

    let assignedUni = "राँची युनिव्हर्सिटी (Ranchi University)";
    if (domain === "Agriculture") assignedUni = "बिरसा कृषी विद्यापीठ (Birsa Agricultural Univ)";
    if (domain === "Water") assignedUni = "बीआईटी सिंदरी, धनबाद (BIT Sindri)";

    const newProb = {
        id: Date.now(),
        citizenName: currentUser.username, // कोण इन्व्हेस्ट करतंय त्याची प्रायव्हसी
        domain, district, description,
        university: assignedUni,
        status: "नवीन (New)"
    };

    problems.push(newProb);
    localStorage.setItem('jharkhand_secure_problems', JSON.stringify(problems));

    renderCitizenData(currentUser.username);
    alert('तुमची समस्या यशस्वीपणे सबमिट झाली!');
    document.getElementById('problemForm').reset();
});

function renderCitizenData(username) {
    const list = document.getElementById('myCitizenProblems');
    const myProbs = problems.filter(p => p.citizenName === username); // प्रायव्हसी फिल्टर

    if (myProbs.length === 0) {
        list.innerHTML = `<p style="color:#777; font-size:13px; text-align:center;">तुम्ही अजून कोणतीही समस्या नोंदवलेली नाही.</p>`;
        return;
    }

    let html = "";
    myProbs.forEach((p, idx) => {
        html += `<div style="background:white; padding:8px; margin-bottom:5px; border-radius:4px; font-size:13px;">
            <b>${idx+1}. विभाग: ${p.domain} (${p.district})</b><br>
            <span>स्थिती: <b style="color:#1b5e20;">${p.status}</b> | विद्यापीठ: ${p.university}</span>
        </div>`;
    });
    list.innerHTML = html;
}

// 2. विद्यापीठ डॅशबोर्ड डेटा
document.getElementById('uniForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const solTitle = document.getElementById('solTitle').value;
    const solDesc = document.getElementById('solDesc').value;

    const newSol = { uniName: currentUser.username, solTitle, solDesc };
    uniSolutions.push(newSol);
    localStorage.setItem('jharkhand_secure_sols', JSON.stringify(uniSolutions));

    renderUniversityData();
    alert('उपाय यशस्वीपणे प्रकाशित झाला!');
    document.getElementById('uniForm').reset();
});

function renderUniversityData() {
    const assignedList = document.getElementById('uniAssignedList');
    if (problems.length === 0) {
        assignedList.innerHTML = `<p style="color:#555; font-size:13px; text-align:center;">कोणतीही समस्या नाही.</p>`;
    } else {
        let html = "";
        problems.forEach(p => {
            html += `<div style="background:white; padding:6px; margin-bottom:4px; border-radius:4px; font-size:12px;">
                📍 <b>${p.district} (${p.domain})</b>: ${p.description} [<b>${p.status}</b>]
            </div>`;
        });
        assignedList.innerHTML = html;
    }

    const pubList = document.getElementById('uniPublishedList');
    let pubHtml = "<h4 style='color:#1565c0; margin:10px 0 5px;'>तुम्ही प्रकाशित केलेले उपाय:</h4>";
    const mySols = uniSolutions.filter(s => s.uniName === currentUser.username);
    if (mySols.length === 0) {
        pubHtml += `<p style="color:#777; font-size:12px;">अद्याप कोणतेही उपाय प्रकाशित नाहीत.</p>`;
    } else {
        mySols.forEach(s => {
            pubHtml += `<div style="background:#e3f2fd; padding:6px; margin-bottom:4px; border-radius:4px; font-size:12px;">
                <em>${s.solTitle}</em> - ${s.solDesc}
            </div>`;
        });
    }
    pubList.innerHTML = pubHtml;
}

// 3. शासन/प्रशासन (Govt Admin) डॅशबोर्ड डेटा
function renderAdminData() {
    const adminList = document.getElementById('adminManagementList');
    let resolvedCount = 0;

    if (problems.length === 0) {
        adminList.innerHTML = `<p style="color:#777; font-size:13px; text-align:center;">तपासण्यासाठी कोणतीही समस्या नाही.</p>`;
    } else {
        let html = "";
        problems.forEach(p => {
            if (p.status.includes("Resolved")) resolvedCount++;
            html += `<div style="background:#fff; padding:8px; margin-bottom:5px; border-radius:5px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                <span><b>${p.domain}</b> (${p.district}) - [नागरिक: ${p.citizenName}] - <b>${p.status}</b></span>
                <select onchange="updateStatus(${p.id}, this.value)" style="padding:3px;">
                    <option value="">स्टेटस बदला</option>
                    <option value="मान्यता प्राप्त (Approved)">Approved</option>
                    <option value="संशोधनाधीन (Under Research)">Under Research</option>
                    <option value="पूर्ण झाले (Resolved)">Resolved</option>
                </select>
            </div>`;
        });
        adminList.innerHTML = html;
    }

    document.getElementById('adminTotalProblems').innerText = problems.length;
    document.getElementById('adminResolvedCount').innerText = resolvedCount;
}

function updateStatus(id, newStatus) {
    let p = problems.find(item => item.id === id);
    if (p) {
        p.status = newStatus;
        localStorage.setItem('jharkhand_secure_problems', JSON.stringify(problems));
        renderAdminData();
    }
}