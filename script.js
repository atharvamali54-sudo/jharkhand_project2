let problems = JSON.parse(localStorage.getItem('jharkhand_adv_problems')) || [];
let uniSolutions = JSON.parse(localStorage.getItem('jharkhand_adv_sols')) || [];
let currentUser = JSON.parse(localStorage.getItem('jharkhand_adv_user')) || null;

window.onload = function() {
    if (currentUser) {
        showDashboard(currentUser);
    }
};

// नोटिफिकेशन दाखवण्याचे फंक्शन
function showNotification(message) {
    const banner = document.getElementById('notificationBanner');
    banner.innerText = message;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 4000);
}

// लॉगिन फंक्शन
function handleLogin() {
    const role = document.getElementById('loginRole').value;
    const username = document.getElementById('loginUsername').value.trim();
    if (!username) { alert('नाव प्रविष्ट करा!'); return; }

    currentUser = { username, role };
    localStorage.setItem('jharkhand_adv_user', JSON.stringify(currentUser));
    showDashboard(currentUser);
    showNotification(`यशोशी रित्या लॉगिन झाले: ${username}`);
}

function showDashboard(user) {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('mainHeader').classList.remove('hidden');
    document.getElementById('welcomeUser.innerText` = ''; // clear
    document.getElementById('userRoleDisplay').innerText = `रोल: ${user.role.toUpperCase()}`;
    document.getElementById('welcomeUser').innerText = user.username;

    document.querySelectorAll('.form-section').forEach(el => el.classList.add('hidden'));

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

function logout() {
    localStorage.removeItem('jharkhand_adv_user');
    location.reload();
}

// नागरिक समस्या सबमिट करणे
document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const domain = document.getElementById('domain').value;
    const district = document.getElementById('district').value;
    const description = document.getElementById('description').value;

    let assignedUni = domain === "Agriculture" ? "बिरसा कृषी विद्यापीठ" : "राँची युनिव्हर्सिटी / बीआईटी सिंदरी";

    const newProb = {
        id: Date.now(),
        citizenName: currentUser.username,
        domain, district, description,
        university: assignedUni,
        status: "नवीन (New)"
    };

    problems.push(newProb);
    localStorage.setItem('jharkhand_adv_problems', JSON.stringify(problems));
    renderCitizenData(currentUser.username);
    showNotification('समस्या यशस्वीपणे नोंदवली गेली व विद्यापीठाकडे वर्ग केली!');
    document.getElementById('problemForm').reset();
});

function renderCitizenData(username) {
    const list = document.getElementById('myCitizenProblems');
    const myProbs = problems.filter(p => p.citizenName === username);
    if (myProbs.length === 0) { list.innerHTML = `<p style="font-size:13px; color:#777;">कोणतीही समस्या नाही.</p>`; return; }
    
    let html = "";
    myProbs.forEach((p, idx) => {
        html += `<div style="background:rgba(0,0,0,0.02); padding:6px; margin-bottom:5px; border-radius:4px; font-size:13px;">
            <b>${idx+1}. विभाग: ${p.domain} (${p.district})</b><br>स्थिती: <span style="color:#2e7d32; font-weight:bold;">${p.status}</span>
        </div>`;
    });
    list.innerHTML = html;
}

// विद्यापीठ उपाय सबमिट
document.getElementById('uniForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const solTitle = document.getElementById('solTitle').value;
    const solDesc = document.getElementById('solDesc').value;

    uniSolutions.push({ uniName: currentUser.username, solTitle, solDesc });
    localStorage.setItem('jharkhand_adv_sols', JSON.stringify(uniSolutions));
    renderUniversityData();
    showNotification('उपाय यशस्वीरित्या प्रकाशित झाला!');
    document.getElementById('uniForm').reset();
});

function renderUniversityData() {
    const assignedList = document.getElementById('uniAssignedList');
    assignedList.innerHTML = problems.length === 0 ? "कोणतीही समस्या नाही." : problems.map(p => `<div style="font-size:12px; margin-bottom:4px;">📍 <b>${p.district}</b> (${p.domain}): ${p.description}</div>`).join('');
    
    const pubList = document.getElementById('uniPublishedList');
    const mySols = uniSolutions.filter(s => s.uniName === currentUser.username);
    pubList.innerHTML = "<h4 style='font-size:14px; margin:5px 0;'>प्रकाशित उपाय:</h4>" + (mySols.length === 0 ? "<p style='font-size:12px; color:#777;'>काहीही नाही</p>" : mySols.map(s => `<div style="font-size:12px; background:rgba(21,101,192,0.1); padding:4px; border-radius:3px; margin-bottom:3px;"><b>${s.solTitle}</b>: ${s.solDesc}</div>`).join(''));
}

// शासन एडमिन डेटा
function renderAdminData() {
    const adminList = document.getElementById('adminManagementList');
    let resolved = 0;
    if (problems.length === 0) { adminList.innerHTML = "डेटा उपलब्ध नाही."; return; }

    let html = "";
    problems.forEach(p => {
        if(p.status.includes("Resolved")) resolved++;
        html += `<div style="padding:6px; margin-bottom:5px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; font-size:13px;">
            <span><b>${p.domain}</b> (${p.district}) - [<b>${p.status}</b>]</span>
            <select onchange="updateStatus(${p.id}, this.value)" style="width:130px; padding:3px; margin:0;">
                <option value="">स्टेटस बदला</option>
                <option value="मान्यता प्राप्त">Approved</option>
                <option value="संशोधनाधीन">Under Research</option>
                <option value="पूर्ण झाले (Resolved)">Resolved</option>
            </select>
        </div>`;
    });
    adminList.innerHTML = html;
    document.getElementById('adminTotalProblems').innerText = problems.length;
    document.getElementById('adminResolvedCount').innerText = resolved;
}

function updateStatus(id, newStatus) {
    let p = problems.find(item => item.id === id);
    if(p && newStatus) {
        p.status = newStatus;
        localStorage.setItem('jharkhand_adv_problems', JSON.stringify(problems));
        renderAdminData();
        showNotification('समस्येचे स्टेटस अपडेट केले!');
    }
}

// १. डेटा एक्सपोर्ट फिचर (CSV Format)
function exportUniversityData() {
    let csv = "University,Solution Title,Description\n";
    uniSolutions.forEach(s => { csv += `"${s.uniName}","${s.solTitle}","${s.solDesc}"\n`; });
    downloadCSV(csv, "university_solutions.csv");
}

function exportAdminData() {
    let csv = "ID,Citizen,Domain,District,University,Status\n";
    problems.forEach(p => { csv += `${p.id},"${p.citizenName}","${p.domain}","${p.district}","${p.university}","${p.status}"\n`; });
    downloadCSV(csv, "government_problems_report.csv");
}

function downloadCSV(csv, filename) {
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showNotification('डेटा यशस्वीरित्या डाऊनलोड झाला!');
}

// २. डार्क मोड टॉगल
function toggleDarkMode() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
    }
}

// ३. AI चॅटबॉट लॉजिक
function toggleChatbot() {
    const content = document.getElementById('chatbot-content');
    content.classList.toggle('hidden');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    const body = document.getElementById('chatbot-body');
    body.innerHTML += `<p style="margin:5px 0;"><b>तुम्ही:</b> ${text}</p>`;

    let reply = "मला समजले नाही. कृपया 'समस्या कशी टाकावी' किंवा 'स्टेटस' असे विचारू शकता.";
    const lower = text.toLowerCase();
    if(lower.includes('समस्या') || lower.includes('problem')) {
        reply = "नागरिक डॅशबोर्डवर जाऊन विभाग, जिल्हा आणि वर्णन भरून 'समस्या सबमिट करा' दाबावी.";
    } else if(lower.includes('status') || lower.includes('स्थिती')) {
        reply = "तुम्ही तुमच्या डॅशबोर्डवरच नोंदवलेल्या समस्यांचे लाईव्ह स्टेटस पाहू शकता.";
    } else if(lower.includes('hello') || lower.includes('नमस्कार')) {
        reply = "नमस्कार! झारखंड नाविन्यता पोर्टलवर आपले स्वागत आहे.";
    }

    setTimeout(() => {
        body.innerHTML += `<p style="margin:5px 0; color:#1b5e20;"><b>AI:</b> ${reply}</p>`;
        body.scrollTop = body.scrollHeight;
    }, 500);

    input.value = '';
}