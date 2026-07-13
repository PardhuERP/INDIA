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
