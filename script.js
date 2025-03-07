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

    // === FIXED: STOP JUMPING TO HOME PAGE ON LOCATION CLICKS ===
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener("click", function (event) {
            event.preventDefault(); // Stops jumping
            openGraph(this.id);
        });
    });

    // === BACKDOOR SYSTEM: "ABG FINDER" TEXT AS SECRET BUTTON ===
    let clickCount = 0;
    let clickTimer;

    const abgFinderLogo = document.querySelector(".navbar .logo, .navbar h1, .abg-finder-text");

    if (abgFinderLogo) {
        console.log("🟢 ABG FINDER text detected as backdoor trigger.");
        abgFinderLogo.style.cursor = "pointer";

        abgFinderLogo.addEventListener("click", function (event) {
            event.preventDefault();
            clickCount++;
            console.log(`🔎 Click detected: ${clickCount}`);

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
    } else {
        console.warn("⚠️ ABG FINDER text not found.");
    }

    function openKeypad() {
        const keypadOverlay = document.getElementById("keypadOverlay");
        if (keypadOverlay) {
            keypadOverlay.style.display = "flex";
            document.getElementById("pinInput").value = "";
            console.log("🔓 Keypad displayed.");
        } else {
            console.error("❌ Keypad overlay element not found.");
        }
    }

    function closeKeypad() {
        document.getElementById("keypadOverlay").style.display = "none";
    }

    // === FIXED: KEYPAD FUNCTIONALITY ===
    const pinInput = document.getElementById("pinInput");
    const submitPin = document.getElementById("submitPin");
    const backspace = document.getElementById("backspace");
    const errorMsg = document.getElementById("errorMsg");
    const correctPin = "2122";

    document.querySelectorAll(".key-btn").forEach(button => {
        button.addEventListener("click", function () {
            if (pinInput.value.length < 4) {
                pinInput.value += this.dataset.value;
            }
        });
    });

    backspace.addEventListener("click", function () {
        pinInput.value = pinInput.value.slice(0, -1);
    });

    submitPin.addEventListener("click", function () {
        if (pinInput.value === correctPin) {
            console.log("✅ Correct PIN entered. Redirecting...");
            window.location.href = "admin.html";
        } else {
            errorMsg.textContent = "Incorrect PIN";
            setTimeout(() => { errorMsg.textContent = ""; }, 2000);
            pinInput.value = "";
        }
    });

    // === ADDITION: GET TIME FROM USER (INCLUDING SECONDS) ===
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

    // Function to parse user input time
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

    // === UPDATED: UPDATE HOTSPOTS BASED ON TIME ===
    function updateHotspots() {
        console.log("🔄 Updating hotspots...");

        const currentTime = getUserTime();

        const hotspots = {
            "cafeteria": document.getElementById("cafeteria"),
            "upper-grind": document.getElementById("upper-grind"),
            "swimming-pool": document.getElementById("swimming-pool"),
            "tennis-court": document.getElementById("tennis-court"),
            "breeze-way": document.getElementById("breeze-way"),
            "rajendra": document.getElementById("rajendra")
        };

        // Reset all to yellow (low)
        Object.values(hotspots).forEach(el => el.style.backgroundColor = "yellow");

        if ((currentTime >= 435 * 60 && currentTime <= 465 * 60) || (currentTime >= 680 * 60 && currentTime <= 720 * 60)) {
            hotspots["cafeteria"].style.backgroundColor = "red";
        }
        if (currentTime >= 680 * 60 && currentTime <= 720 * 60) {
            hotspots["upper-grind"].style.backgroundColor = "red";
        }
        if (currentTime >= 890 * 60 && currentTime <= 1020 * 60) {
            hotspots["swimming-pool"].style.backgroundColor = "red";
            hotspots["tennis-court"].style.backgroundColor = "red";
            hotspots["rajendra"].style.backgroundColor = "red";
        }

        const timestamp = document.getElementById("timestamp");
        if (timestamp) {
            let now = new Date();
            timestamp.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        } else {
            console.warn("⚠️ Timestamp element not found.");
        }

        console.log("✅ Hotspots updated.");
    }

    setInterval(updateHotspots, 1000);
    updateHotspots();
});