let tsState;
let tsDistrict;
let tsSubDistrict;
let tsGramPanchayat;
let tsReport;

// ======================================
// CONFIG
// ======================================

const API = "https://script.google.com/macros/s/AKfycbxPzr5LGD7tHjmSlkMZfb6JqoQcJMh15Ly-tkp2lkFKbm4gGBJlCIppTQYaiS-5MaLmfA/exec";

// ======================================
// ELEMENTS
// ======================================

const year = document.getElementById("year");
const state = document.getElementById("state");
const district = document.getElementById("district");
const subdistrict = document.getElementById("subdistrict");
const gramPanchayat = document.getElementById("gramPanchayat");
const report = document.getElementById("report");

const generatedUrl = document.getElementById("generatedUrl");
const reportStatus = document.getElementById("reportStatus");

let reportTemplates = [];

// ======================================
// API CALL
// ======================================

async function api(action, params = "") {

    try {

        const res = await fetch(
            API + "?action=" + action + params
        );

        return await res.json();

    } catch (err) {

        console.error(err);

        return {
            status: false,
            data: []
        };

    }

}

// ======================================
// RESET DROPDOWNS
// ======================================

function resetDistrict() {

    district.innerHTML =
        "<option value=''>Select District</option>";

}

function resetSubDistrict() {

    subdistrict.innerHTML =
        "<option value=''>Select Sub District</option>";

}

function resetGramPanchayat() {

    gramPanchayat.innerHTML =
        "<option value=''>Select Gram Panchayat</option>";

}

// ======================================
// UPDATE SELECTED DETAILS
// ======================================

function updateSelection() {

    document.getElementById("selectedYear").innerText =
        year.value || "-";

    document.getElementById("selectedState").innerText =
        state.selectedIndex > 0
            ? state.options[state.selectedIndex].text
            : "-";

    document.getElementById("selectedDistrict").innerText =
        district.selectedIndex > 0
            ? district.options[district.selectedIndex].text
            : "-";

    document.getElementById("selectedSubDistrict").innerText =
        subdistrict.selectedIndex > 0
            ? subdistrict.options[subdistrict.selectedIndex].text
            : "-";

    document.getElementById("selectedGramPanchayat").innerText =
        gramPanchayat.selectedIndex > 0
            ? gramPanchayat.options[gramPanchayat.selectedIndex].text
            : "-";

}

// ======================================
// LOAD STATES
// ======================================

async function loadStates() {

    const json = await api("getStates");

    if (!json.status) return;

    // Destroy TomSelect if already exists
    if (tsState) {
        tsState.destroy();
    }

    state.innerHTML =
        "<option value=''>Select State</option>";

    json.data.forEach(s => {

        state.innerHTML +=
            `<option value="${s.code}">${s.name}</option>`;

    });

    // Recreate TomSelect
    tsState = new TomSelect("#state", {
        create: false,
        sortField: {
            field: "text",
            direction: "asc"
        },
        placeholder: "Search State..."
    });

}

// ======================================
// LOAD DISTRICTS
// ======================================

async function loadDistricts() {

    const json = await api("getDistricts");

    if (!json.status) return;

    district.innerHTML =
        "<option value=''>Select District</option>";

    json.data.forEach(d => {

        district.innerHTML +=
            `<option value="${d.code}">${d.name}</option>`;

    });

}

// ======================================
// LOAD SUB DISTRICTS
// ======================================

async function loadSubDistricts(districtCode) {

    const json = await api(
        "getSubDistricts",
        "&district=" + encodeURIComponent(districtCode)
    );

    if (!json.status) return;

    subdistrict.innerHTML =
        "<option value=''>Select Sub District</option>";

    json.data.forEach(s => {

        subdistrict.innerHTML +=
            `<option value="${s.code}">${s.name}</option>`;

    });

}

// ======================================
// LOAD GRAM PANCHAYATS
// ======================================

async function loadGramPanchayats(districtCode, subDistrictCode) {

    const json = await api(
        "getGramPanchayats",
        "&district=" + encodeURIComponent(districtCode) +
        "&subdistrict=" + encodeURIComponent(subDistrictCode)
    );

    if (!json.status) return;

    gramPanchayat.innerHTML =
        "<option value=''>Select Gram Panchayat</option>";

    json.data.forEach(g => {

        gramPanchayat.innerHTML +=
            `<option value="${g.code}">${g.name}</option>`;

    });

                      }

// ======================================
// LOAD REPORT TYPES
// ======================================

async function loadReportTypes() {

    const json = await api("getReportTypes");

    if (!json.status) return;

    reportTemplates = json.data;

    report.innerHTML =
        "<option value=''>Select Report</option>";

    json.data.forEach(r => {

        report.innerHTML +=
            `<option value="${r.id}">${r.name}</option>`;

    });

}

// ======================================
// GENERATE URL
// ======================================

function generateUrl() {

    if (
        !year.value ||
        !state.value ||
        !district.value ||
        !subdistrict.value ||
        !gramPanchayat.value ||
        !report.value
    ) {

        generatedUrl.value = "";

        reportStatus.innerHTML =
            "🔴 Complete all selections";

        return;

    }

    const template =
        reportTemplates.find(
            x => String(x.id) === String(report.value)
        );

    if (!template) return;

    let url = template.url;

    url = url.replace("{YEAR}", year.value);
    url = url.replace("{STATE}", state.value);
    url = url.replace("{DISTRICT}", district.value);
    url = url.replace("{SUBDISTRICT}", subdistrict.value);
    url = url.replace("{GP_CODE}", gramPanchayat.value);

    generatedUrl.value = url;

    reportStatus.innerHTML =
        "🟢 Report Ready";

}

// ======================================
// COPY URL
// ======================================

function copyUrl() {

    if (!generatedUrl.value) return;

    navigator.clipboard.writeText(
        generatedUrl.value
    );

    alert("URL Copied");

}

// ======================================
// OPEN REPORT
// ======================================

function openReport() {

    if (!generatedUrl.value) return;

    window.open(
        generatedUrl.value,
        "_blank"
    );

}

// ======================================
// EVENTS
// ======================================

state.addEventListener("change", async function () {

    resetDistrict();
    resetSubDistrict();
    resetGramPanchayat();

    await loadDistricts();

    updateSelection();

    generateUrl();

});

district.addEventListener("change", async function () {

    resetSubDistrict();
    resetGramPanchayat();

    if (!this.value) return;

    await loadSubDistricts(this.value);

    updateSelection();

    generateUrl();

});

subdistrict.addEventListener("change", async function () {

    resetGramPanchayat();

    if (!this.value) return;

    await loadGramPanchayats(
        district.value,
        this.value
    );

    updateSelection();

    generateUrl();

});

gramPanchayat.addEventListener("change", function () {

    updateSelection();

    generateUrl();

});

report.addEventListener("change", generateUrl);

year.addEventListener("change", function () {

    updateSelection();

    generateUrl();

});

// ======================================
// START
// ======================================

let tsState;
let tsDistrict;
let tsSubDistrict;
let tsGramPanchayat;
let tsReport;

window.onload = async function () {

    await loadStates();

    await loadDistricts();

    await loadReportTypes();

    tsState = new TomSelect("#state");
    tsDistrict = new TomSelect("#district");
    tsSubDistrict = new TomSelect("#subdistrict");
    tsGramPanchayat = new TomSelect("#gramPanchayat");
    tsReport = new TomSelect("#report");

    updateSelection();

};

async function selectGP(gpCode){

    const json = await api(
        "getGPDetails",
        "&gp=" + gpCode
    );

    if(!json.status) return;

    const gp = json.data;

    // Select State
    state.value = gp.stateCode;

    // Reload Districts
    await loadDistricts();
    district.value = gp.districtCode;

    // Reload Sub Districts
    await loadSubDistricts(gp.districtCode);
    subdistrict.value = gp.subDistrictCode;

    // Reload Gram Panchayats
    await loadGramPanchayats(
        gp.districtCode,
        gp.subDistrictCode
    );

    gramPanchayat.value = gp.gpCode;

    // Clear search
    searchBox.value = gp.gpName;
    searchResults.innerHTML = "";

    // Update UI
    updateSelection();

    // Auto select first report
if (report.options.length > 1) {
    report.selectedIndex = 1;
}

    // Generate report URL
    generateUrl();

document.getElementById("gpCard").style.display = "block";

document.getElementById("cardState").innerText = gp.stateName;
document.getElementById("cardDistrict").innerText = gp.districtName;
document.getElementById("cardSubDistrict").innerText = gp.subDistrictName;
document.getElementById("cardVillage").innerText = gp.villageName;
document.getElementById("cardGPCode").innerText = gp.gpCode;
document.getElementById("cardGPName").innerText = gp.gpName;

}

// ===============================
// Dashboard Cards
// ===============================

document.querySelectorAll(".menu-card").forEach(card => {

    card.addEventListener("click", function () {

        const gp = JSON.parse(localStorage.getItem("currentGP"));

        if (!gp) {

            alert("Please select a Gram Panchayat first.");

            return;

        }

        const report = this.dataset.report;

        if (!report) {

            alert("This module is under development.");

            return;

        }

        localStorage.setItem("selectedReport", report);

        window.location.href = "report.html";

    });

});

async function loadDashboardSelection() {

    const gp = JSON.parse(localStorage.getItem("currentGP"));
    const reportName = localStorage.getItem("selectedReport");

    if (!gp) return;

    state.value = gp.stateCode;

    await loadDistricts();

    district.value = gp.districtCode;

    await loadSubDistricts(gp.districtCode);

    subdistrict.value = gp.subDistrictCode;

    await loadGramPanchayats(
        gp.districtCode,
        gp.subDistrictCode
    );

    gramPanchayat.value = gp.gpCode;

    if (reportName) {

        for (let i = 0; i < report.options.length; i++) {

            if (report.options[i].text === reportName) {

                report.selectedIndex = i;
                break;

            }

        }

    }

    updateSelection();
    generateUrl();

}
