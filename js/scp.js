// Fetches the JSON data and populates the nav menu with the scp names

function loadJsonData() {
    fetch("json/scp_file.json")
    .then(response => response.json())
    .then(data => {
        const navCon = document.getElementById('scp-nav'); // Get the existing nav element

        // Add 'home' link
        const home = document.createElement('a');
        home.href = 'index.html';
        home.textContent = 'Home';
        navCon.appendChild(home);

        // Iterate through each subject in the JSON file and create links
        data.forEach(item => {
            const link = document.createElement('a');
            link.href = `#${encodeURIComponent(item.subject)}`; // Ensures special characters are handled
            link.textContent = item.subject;
            link.onclick = function(event) {
                event.preventDefault();
                loadScp(item);
            };
            navCon.appendChild(link);
        });
    })
    .catch(error => console.error("Error loading data: ", error));
}

function loadScp(item) { // function that loads data to <main> area html.
    const displayDiv = document.getElementById('display')
    const containmentList = typeof item.containment == "object"
        ? Object.values(item.containment).map(detail => `<li>${detail}</li>`).join("")
        : `<li>${item.containment}</li>`

    const content = `
    <div class='subject'>
        <h2 class='id'>${item.subject}</h2>
        <h3 class='grade'><strong>Class: </strong>${item.class}</h3>
    </div>

    <div class='description'>        
        <h3>Description: <button id='read-name-btn'class="read">Read Me</button></h3>
        <div class="desc-container">
            <p>${item.description}</p>
        </div>
    </div>

    <div class='containment'>
        <h3><strong>Containment Procedures: <br></strong></h3>
        <div class="cont-container">
            <ul>
                ${containmentList}
            </ul>
        </div>
    </div>

        
    `    
    displayDiv.innerHTML = content

// adds event listner to the button to read the subject name and description
document.getElementById(`read-name-btn`).onclick = function() {
    readDescription(item.description)
}
}
let voices = [];

// Function to read the scp with a word limit
function readDescription(description) {
    const maxWords = 40; // Set the word limit
    const words = description.split(' ');
    const limitedDescription = words.slice(0, maxWords).join(' ');

    const speech = new SpeechSynthesisUtterance();
    speech.text = limitedDescription + (words.length > maxWords ? '...' : '');
    speech.voice = speechSynthesis.getVoices()[1];

    if (voices.length > 0) {
        speech.voice = voices[1] || voices[0];
    }
    speechSynthesis.speak(speech);
}