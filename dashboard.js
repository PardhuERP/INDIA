alert("Dashboard JS Loaded");
const API = "https://script.google.com/macros/s/AKfycbxPzr5LGD7tHjmSlkMZfb6JqoQcJMh15Ly-tkp2lkFKbm4gGBJlCIppTQYaiS-5MaLmfA/exec";

const searchBox = document.getElementById("searchGP");
const searchResults = document.getElementById("searchResults");

const currentGP = document.getElementById("currentGP");
const currentLocation = document.getElementById("currentLocation");

// ---------------- API ----------------

async function api(action, params = "") {

    const res = await fetch(API + "?action=" + action + params);

    return await res.json();

}

// ---------------- Search ----------------

searchBox.addEventListener("input", async function () {

    const keyword = this.value.trim();

    searchResults.innerHTML = "";

    if (keyword.length < 2) return;

    const json = await api(
        "searchGP",
        "&keyword=" + encodeURIComponent(keyword)
    );

    if (!json.status) return;

    json.data.forEach(gp => {

        searchResults.innerHTML += `
        <div class="search-item"
            onclick="selectGP(${gp.gpCode})">

            <b>${gp.gpName}</b><br>

            <small>
            ${gp.subDistrictName},
            ${gp.districtName}
            </small>

        </div>
        `;

    });

});

// ---------------- Select GP ----------------

async function selectGP(gpCode){

    const json = await api(
        "getGPDetails",
        "&gp=" + gpCode
    );

    if(!json.status) return;

    const gp = json.data;

    currentGP.innerText = gp.gpName;

    currentLocation.innerHTML =
        gp.subDistrictName +
        " • " +
        gp.districtName;

    searchBox.value = gp.gpName;

    searchResults.innerHTML = "";

    localStorage.setItem(
        "currentGP",
        JSON.stringify(gp)
    );

}

// ---------------- Load Last GP ----------------

window.onload = function(){

    const gp =
        JSON.parse(
            localStorage.getItem("currentGP")
        );

    if(!gp) return;

    currentGP.innerText = gp.gpName;

    currentLocation.innerHTML =
        gp.subDistrictName +
        " • " +
        gp.districtName;

    searchBox.value = gp.gpName;

};
