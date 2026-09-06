let problems = JSON.parse(localStorage.getItem('jharkhand_problems_multi')) || [];
let uniSolutions = JSON.parse(localStorage.getItem('jharkhand_uni_sols_multi')) || [];
let partnersCount = parseInt(localStorage.getItem('jharkhand_partners_multi')) || 0;

window.onload = function() {
    refreshAllDashboards();
};

// 1. Citizen Module: Submit Problem
document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const district = document.getElementById('district').value;
    const domain = document.getElementById('domain').value;
    const description = document.getElementById('description').value;

    let assignedUni = "राँची युनिव्हर्सिटी (Ranchi University)";
    if (domain === "Agriculture") assignedUni = "बिरसा कृषी विद्यापीठ (Birsa Agricultural Univ)";
    if (domain === "Water") assignedUni = "बीआईटी सिंदरी, धनबाद (BIT Sindri)";

    const newProb = {
        id: Date.now(),
        name, district, domain, description,
        university: assignedUni,
        status: "नवीन (New)"
    };

    problems.push(newProb);
    localStorage.setItem('jharkhand_problems_multi', JSON.stringify(problems));

    refreshAllDashboards();

    const msg = document.getElementById('successMessage');
    msg.style.display = 'block';
    msg.textContent = `धन्यवाद ${name}! तुमची समस्या नोंदवली व '${assignedUni}' कडे पाठवली.`;
    document.getElementById('problemForm').reset();
});

// 2. University Module: Publish Solutions
document.getElementById('uniForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const uniName = document.getElementById('uniName').value;
    const solTitle = document.getElementById('solTitle').value;
    const solDesc = document.getElementById('solDesc').value;

    const newSol = { uniName, solTitle, solDesc };
    uniSolutions.push(newSol);
    localStorage.setItem('jharkhand_uni_sols_multi', JSON.stringify(uniSolutions));

    refreshAllDashboards();
    alert('विद्यापीठाचा उपाय यशस्वीपणे प्रकाशित झाला!');
    document.getElementById('uniForm').reset();
});

// 3. Industry Module
document.getElementById('industryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const comp = document.getElementById('compName').value;
    partnersCount++;
    localStorage.setItem('jharkhand_partners_multi', partnersCount);
    
    const msg = document.getElementById('industryMsg');
    msg.style.display = 'block';
    msg.textContent = `धन्यवाद ${comp}! तुमची उद्योग भागिदारी नोंदवली गेली.`;
    document.getElementById('industryForm').reset();
});

// Admin Status Update
function updateStatus(id, newStatus) {
    let p = problems.find(item => item.id === id);
    if (p) {
        p.status = newStatus;
        localStorage.setItem('jharkhand_problems_multi', JSON.stringify(problems));
        refreshAllDashboards();
    }
}

// Refresh all dashboards simultaneously
function refreshAllDashboards() {
    // Citizen List
    const citizenList = document.getElementById('citizenProblemList');
    if (problems.length === 0) {
        citizenList.innerHTML = `<p style="color:#777; font-size:13px; text-align:center;">अद्याप कोणतीही समस्या नोंदवलेली नाही.</p>`;
    } else {
        let html = "";
        problems.forEach((p, idx) => {
            html += `<div style="background:white; padding:8px; margin-bottom:5px; border-radius:4px; font-size:13px;">
                <b>क्र. ${idx+1} [विभाग: ${p.domain}]</b> - जिल्हा: ${p.district}<br>
                <span>स्थिती: <span style="color:#1b5e20; font-weight:bold;">${p.status}</span> | नेमलेले विद्यापीठ: ${p.university}</span>
            </div>`;
        });
        citizenList.innerHTML = html;
    }

    // University Assigned List
    const uniAssigned = document.getElementById('uniAssignedList');
    if (problems.length === 0) {
        uniAssigned.innerHTML = `<p style="color:#555; font-size:13px; text-align:center;">कोणतीही समस्या वर्ग केलेली नाही.</p>`;
    } else {
        let html = "";
        problems.forEach(p => {
            html += `<div style="background:white; padding:6px; margin-bottom:4px; border-radius:4px; font-size:12px;">
                📍 <b>${p.district} (${p.domain})</b>: ${p.description.substring(0, 50)}... [<b>${p.status}</b>]
            </div>`;
        });
        uniAssigned.innerHTML = html;
    }

    // University Published Solutions
    const uniPub = document.getElementById('uniPublishedList');
    let pubHtml = "<h4 style='color:#1565c0; margin:10px 0 5px;'>प्रसिद्ध केलेले उपाय:</h4>";
    if (uniSolutions.length === 0) {
        pubHtml += `<p style="color:#777; font-size:12px;">अद्याप कोणतेही उपाय प्रकाशित नाहीत.</p>`;
    } else {
        uniSolutions.forEach(s => {
            pubHtml += `<div style="background:#e3f2fd; padding:6px; margin-bottom:4px; border-radius:4px; font-size:12px;">
                <b>🏫 ${s.uniName}</b>: <em>${s.solTitle}</em> - ${s.solDesc}
            </div>`;
        });
    }
    uniPub.innerHTML = pubHtml;

    // Admin Panel & Metrics
    const adminList = document.getElementById('adminManagementList');
    let resolvedCount = 0;
    if (problems.length === 0) {
        adminList.innerHTML = `<p style="color:#777; font-size:13px; text-align:center;">तपासण्यासाठी कोणतीही समस्या नाही.</p>`;
    } else {
        let adminHtml = "";
        problems.forEach(p => {
            if (p.status.includes("Resolved")) resolvedCount++;
            adminHtml += `<div style="background:#fff; padding:8px; margin-bottom:5px; border-radius:5px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                <span><b>${p.domain}</b> (${p.district}) - [<b>${p.status}</b>]</span>
                <select onchange="updateStatus(${p.id}, this.value)" style="padding:3px;">
                    <option value="">स्टेटस बदला</option>
                    <option value="मान्यता प्राप्त (Approved)">Approved</option>
                    <option value="संशोधनाधीन (Under Research)">Under Research</option>
                    <option value="पूर्ण झाले (Resolved)">Resolved</option>
                </select>
            </div>`;
        });
        adminList.innerHTML = adminHtml;
    }

    document.getElementById('adminTotalProblems').innerText = problems.length;
    document.getElementById('adminResolvedCount').innerText = resolvedCount;
}

// Language Toggle
let currentLang = 'mr';
function toggleLanguage() {
    currentLang = currentLang === 'mr' ? 'en' : 'mr';
    document.getElementById('langBtn').innerText = currentLang === 'mr' ? 'English' : 'मराठी';
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
}