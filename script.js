document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Page loaded. Running scripts...");

    // === OLD FUNCTIONALITY (KEPT INTACT) ===
    const loadingScreen = document.getElementById("loading-screen");
    const smoothWrapper = document.getElementById("smooth-wrapper");

    if (loadingScreen) {
        gsap.to(".loading-bar", { 
            width: "100%", 
            duration: 2, 
            ease: "power2.out"
        });

        gsap.to("#loading-screen", { 
            opacity: 0, 
            duration: 1.5, 
            delay: 2, 
            onComplete: () => {
                console.log("✅ Loading screen animation complete.");
                loadingScreen.style.display = "none";
            }
        });
    } else {
        console.warn("⚠️ Loading screen not found.");
    }

    if (smoothWrapper) {
        gsap.to("#smooth-wrapper", { opacity: 1, duration: 1.5, delay: 2.5 });
    } else {
        console.warn("⚠️ Smooth wrapper not found.");
    }

    // === STOP JUMPING TO HOME PAGE ON LOCATION CLICKS ===
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener("click", function (event) {
            event.preventDefault();
            openGraph(this.id);
        });
    });

    // === BACKDOOR SYSTEM ===
    let clickCount = 0;
    let clickTimer;
    const abgFinderLogo = document.getElementById("backdoor");

    if (abgFinderLogo) {
        console.log("🟢 ABG FINDER text detected as backdoor trigger.");
        abgFinderLogo.style.cursor = "pointer";

        abgFinderLogo.addEventListener("click", function (event) {
            event.preventDefault();
            clickCount++;

            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                    console.log("🔄 Redirecting to home page.");
                    window.location.href = "index.html";
                }, 1000);
            }

            if (clickCount >= 4) {
                clearTimeout(clickTimer);
                clickCount = 0;
                console.log("🔑 Backdoor activated!");
                openKeypad();
            }
        });
    }

    function openKeypad() {
        document.getElementById("adminModal").style.display = "flex";
        document.getElementById("pinInput").value = "";
    }

    function closeKeypad() {
        document.getElementById("adminModal").style.display = "none";
    }

    // === KEYPAD FUNCTIONALITY ===
    const pinInput = document.getElementById("pinInput");
    const submitPin = document.getElementById("submitPin");
    const closeAdmin = document.getElementById("closeAdmin");
    const errorMsg = document.getElementById("errorMsg");
    const correctPin = "2122";

    submitPin.addEventListener("click", function () {
        if (pinInput.value === correctPin) {
            console.log("✅ Correct PIN entered. Redirecting...");
            window.location.href = "admin.html";
        } else {
            alert("Incorrect PIN");
            pinInput.value = "";
        }
    });

    closeAdmin.addEventListener("click", closeKeypad);

    // === GET TIME FROM USER OR SYSTEM ===
    let currentTimeInSeconds = getUserTime();

    function getUserTime() {
        let userTimeInput = prompt("Enter time (HH:MM:SS AM/PM) or press Cancel to use current time:");

        if (userTimeInput) {
            let parsedTime = parseUserTime(userTimeInput);
            if (parsedTime !== null) {
                return parsedTime.hours * 3600 + parsedTime.minutes * 60 + parsedTime.seconds;
            } else {
                alert("Invalid time format. Using current system time.");
            }
        }

        let now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    }

    function parseUserTime(userInput) {
        let match = userInput.match(/(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)/i);
        if (!match) return null;

        let hours = parseInt(match[1]);
        let minutes = parseInt(match[2]);
        let seconds = parseInt(match[3]);
        let period = match[4].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return { hours, minutes, seconds };
    }

    // === UPDATE HOTSPOTS BASED ON TIME ===
    function updateHotspots() {
        console.log("🔄 Updating hotspots...");
        currentTimeInSeconds++;

        const hotspots = {
            "Band Room": document.getElementById("Band Room"),
            "Strings Room": document.getElementById("Strings Room"),
            "Piano Room": document.getElementById("Piano Room"),
            "Choir Room": document.getElementById("Choir Room"),
            "Hall Way": document.getElementById("Hall Way"),
            "Cafateria": document.getElementById("Cafateria")
        };

        // Reset all to yellow (low)
        Object.values(hotspots).forEach(el => el.style.backgroundColor = "yellow");

        if (currentTimeInSeconds >= 435 * 60 && currentTimeInSeconds <= 465 * 60) {
            hotspots["Band Room"].style.backgroundColor = "red";
        }
        if (currentTimeInSeconds >= 680 * 60 && currentTimeInSeconds <= 720 * 60) {
            hotspots["Strings Room"].style.backgroundColor = "red";
        }
        if (currentTimeInSeconds >= 890 * 60 && currentTimeInSeconds <= 1020 * 60) {
            hotspots["Piano Room"].style.backgroundColor = "red";
            hotspots["Choir Room"].style.backgroundColor = "red";
            hotspots["Cafateria"].style.backgroundColor = "red";
        }

        const timestamp = document.getElementById("timestamp");
        if (timestamp) {
            let now = new Date(currentTimeInSeconds * 1000);
            timestamp.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        }
    }

    setInterval(updateHotspots, 1000);
    updateHotspots();

    // === GRAPH FUNCTION ===
    function openGraph(location) {
        const modal = document.getElementById("graphModal");
        const modalTitle = document.getElementById("modalTitle");
        const detailGraphCanvas = document.getElementById("detailGraph");

        modal.style.display = "flex";
        modalTitle.textContent = location.toUpperCase();

        if (window.detailChart) {
            window.detailChart.destroy();
        }

        window.detailChart = new Chart(detailGraphCanvas, {
            type: "line",
            data: {
                labels: ["7:00", "9:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
                datasets: [{
                    label: `${location} ABG Density`,
                    data: [1, 3, 5, 7, 9, 6, 4],
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Time", color: "white" }, grid: { color: "gray" } },
                    y: { title: { display: true, text: "ABG Density", color: "white" }, grid: { color: "gray" } }
                }
            }
        });
    }

    document.getElementById("closeGraph").addEventListener("click", function () {
        document.getElementById("graphModal").style.display = "none";
    });

});
