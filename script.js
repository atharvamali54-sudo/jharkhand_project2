let problems = JSON.parse(localStorage.getItem('jharkhand_adv_problems')) || [];
let uniSolutions = JSON.parse(localStorage.getItem('jharkhand_adv_sols')) || [];
let currentUser = JSON.parse(localStorage.getItem('jharkhand_adv_user')) || null;

window.onload = function() {
    if (currentUser) {
        showDashboard(currentUser);
    }
};

function showNotification(message) {
    const banner = document.getElementById('notificationBanner');
    banner.innerText = message;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 4000);
}

function handleLogin() {
    const role = document.getElementById('loginRole').value;
    const username = document.getElementById('loginUsername').value.trim();
    if (!username) { alert('Please enter your username!'); return; }

    currentUser = { username, role };
    localStorage.setItem('jharkhand_adv_user', JSON.stringify(currentUser));
    showDashboard(currentUser);
    showNotification(`Successfully logged in as: ${username}`);
}

function showDashboard(user) {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('mainHeader').classList.remove('hidden');
    document.getElementById('userRoleDisplay').innerText = `Role: ${user.role.toUpperCase()}`;
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

// Citizen problem submission with photo support
document.getElementById('problemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const domain = document.getElementById('domain').value;
    const district = document.getElementById('district').value;
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('problemImage');

    let assignedUni = domain === "Agriculture" ? "Birsa Agricultural University" : "Ranchi University / BIT Sindri";

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveProblemWithImage(domain, district, description, assignedUni, event.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveProblemWithImage(domain, district, description, assignedUni, null);
    }
});

function saveProblemWithImage(domain, district, description, assignedUni, imageData) {
    const newProb = {
        id: Date.now(),
        citizenName: currentUser.username,
        domain, district, description,
        university: assignedUni,
        image: imageData,
        status: "New"
    };

    problems.push(newProb);
    localStorage.setItem('jharkhand_adv_problems', JSON.stringify(problems));
    renderCitizenData(currentUser.username);
    showNotification('Problem submitted successfully with photo!');
    document.getElementById('problemForm').reset();
}

function renderCitizenData(username) {
    const list = document.getElementById('myCitizenProblems');
    const myProbs = problems.filter(p => p.citizenName === username);
    if (myProbs.length === 0) { list.innerHTML = `<p style="font-size:13px; color:#777;">No issues reported yet.</p>`; return; }
    
    let html = "";
    myProbs.forEach((p, idx) => {
        let imgHtml = p.image ? `<br><img src="${p.image}" style="max-width:100px; max-height:80px; margin-top:5px; border-radius:4px; border:1px solid #ccc;">` : "";
        html += `<div style="background:rgba(0,0,0,0.02); padding:8px; margin-bottom:6px; border-radius:4px; font-size:13px;">
            <b>${idx+1}. Domain: ${p.domain} (${p.district})</b><br>
            Description: ${p.description}<br>
            Status: <span style="color:#2e7d32; font-weight:bold;">${p.status}</span>
            ${imgHtml}
        </div>`;
    });
    list.innerHTML = html;
}

// University solution submission
document.getElementById('uniForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const solTitle = document.getElementById('solTitle').value;
    const solDesc = document.getElementById('solDesc').value;

    uniSolutions.push({ uniName: currentUser.username, solTitle, solDesc });
    localStorage.setItem('jharkhand_adv_sols', JSON.stringify(uniSolutions));
    renderUniversityData();
    showNotification('Solution published successfully!');
    document.getElementById('uniForm').reset();
});

function renderUniversityData() {
    const assignedList = document.getElementById('uniAssignedList');
    if (problems.length === 0) {
        assignedList.innerHTML = "No assigned issues found.";
    } else {
        let html = "";
        problems.forEach(p => {
            let imgHtml = p.image ? `<br><img src="${p.image}" style="max-width:80px; max-height:60px; margin-top:4px; border-radius:3px;">` : "";
            html += `<div style="font-size:12px; margin-bottom:6px; background:rgba(0,0,0,0.02); padding:6px; border-radius:4px;">
                📍 <b>${p.district}</b> (${p.domain}) [Citizen: ${p.citizenName}]: ${p.description} ${imgHtml}
            </div>`;
        });
        assignedList.innerHTML = html;
    }
    
    const pubList = document.getElementById('uniPublishedList');
    const mySols = uniSolutions.filter(s => s.uniName === currentUser.username);
    pubList.innerHTML = "<h4 style='font-size:14px; margin:5px 0;'>Published Solutions:</h4>" + (mySols.length === 0 ? "<p style='font-size:12px; color:#777;'>None</p>" : mySols.map(s => `<div style="font-size:12px; background:rgba(21,101,192,0.1); padding:4px; border-radius:3px; margin-bottom:3px;"><b>${s.solTitle}</b>: ${s.solDesc}</div>`).join(''));
}

// Admin Panel data management
function renderAdminData() {
    const adminList = document.getElementById('adminManagementList');
    let resolved = 0;
    if (problems.length === 0) { adminList.innerHTML = "No data available."; return; }

    let html = "";
    problems.forEach(p => {
        if(p.status.includes("Resolved")) resolved++;
        let imgHtml = p.image ? `<br><img src="${p.image}" style="max-width:70px; max-height:50px; margin-top:3px; border-radius:3px;">` : "";
        html += `<div style="padding:8px; margin-bottom:5px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; font-size:13px;">
            <div>
                <b>${p.domain}</b> (${p.district}) - [<b>${p.status}</b>]
                ${imgHtml}
            </div>
            <select onchange="updateStatus(${p.id}, this.value)" style="width:130px; padding:3px; margin:0;">
                <option value="">Change Status</option>
                <option value="Approved">Approved</option>
                <option value="Under Research">Under Research</option>
                <option value="Resolved">Resolved</option>
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
        showNotification('Problem status updated!');
    }
}

// CSV Export Features
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
    showNotification('Data downloaded successfully!');
}

// Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
}

// AI Chatbot logic
function toggleChatbot() {
    document.getElementById('chatbot-content').classList.toggle('hidden');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    const body = document.getElementById('chatbot-body');
    body.innerHTML += `<p style="margin:5px 0;"><b>You:</b> ${text}</p>`;

    let reply = "I didn't quite understand. You can ask things like 'how to submit problem' or 'status'.";
    const lower = text.toLowerCase();
    if(lower.includes('problem') || lower.includes('submit') || lower.includes('photo')) {
        reply = "Go to the Citizen Dashboard, fill in your details, select a photo if needed, and click 'Submit Problem'.";
    } else if(lower.includes('status') || lower.includes('track')) {
        reply = "You can track the live status of your issues directly on your dashboard.";
    }

    setTimeout(() => {
        body.innerHTML += `<p style="margin:5px 0; color:#1b5e20;"><b>AI:</b> ${reply}</p>`;
        body.scrollTop = body.scrollHeight;
    }, 500);

    input.value = '';
}