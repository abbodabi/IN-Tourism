// Accordion toggle (Existing function, minor adjustment)
function toggleAccordion(id) {
  const content = document.getElementById(id);
  const arrow = content.previousElementSibling.querySelector('.arrow');
  content.classList.toggle("open");
  arrow.classList.toggle("rotated");

  // Close other accordions
  document.querySelectorAll('.accordion-content').forEach(item => {
    if (item.id !== id) {
      item.classList.remove("open");
      // The arrow element needs to be found within the sibling's header if using custom code, 
      // but with Bootstrap, we rely on Bootstrap's internal collapse logic.
      // Keeping this original structure for compatibility with older parts:
      const siblingArrow = item.previousElementSibling.querySelector('.arrow');
      if (siblingArrow) {
          siblingArrow.classList.remove("rotated");
      }
    }
  });
}

// --- New: Currency Converter Function ---
function convertCurrency() {
    const amountPHP = parseFloat(document.getElementById('phpAmount').value);
    const targetCurrency = document.getElementById('targetCurrency').value;
    const resultElement = document.getElementById('conversionResult');
    
    // NOTE: Approximate rate for demonstration (1 USD = 58.5 PHP)
    const USD_PHP_RATE = 58.5; 

    if (isNaN(amountPHP) || amountPHP <= 0) {
        resultElement.textContent = 'Please enter a valid amount.';
        return;
    }

    let convertedAmount;
    let symbol;
    
    switch (targetCurrency) {
        case 'USD':
            convertedAmount = amountPHP / USD_PHP_RATE;
            symbol = '$';
            break;
        case 'EUR':
            // Approximate, based on current USD/EUR exchange
            convertedAmount = amountPHP / (USD_PHP_RATE * 0.92); 
            symbol = '€';
            break;
        case 'JPY':
            // Approximate, based on current USD/JPY exchange
            convertedAmount = amountPHP / (USD_PHP_RATE / 150); 
            symbol = '¥';
            break;
        default:
            convertedAmount = amountPHP;
            symbol = '₱';
    }

    resultElement.textContent = `${amountPHP.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })} is approximately ${symbol}${convertedAmount.toFixed(2)} (${targetCurrency}).`;
}


// --- New: Save Itinerary Functionality ---
function saveItinerary(title, sites) {
    const itineraryText = `Ilocos Norte Trip Itinerary: ${title}\n\nKey Destinations:\n${sites.replace(/<li>/g, '\n- ').replace(/<\/li>/g, '').trim()}\n\n--- End of Itinerary ---\n\n(Generated on ${new Date().toLocaleDateString()})`;
    
    const blob = new Blob([itineraryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ilocos_Norte_Itinerary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert('Itinerary saved as Ilocos_Norte_Itinerary.txt!');
}

// AI Rule-Based Expert System with Budget Estimator (Modified)
function recommendItinerary() {
  const duration = document.getElementById("duration").value;
  const budget = document.getElementById("budget").value;
  const interest = document.getElementById("interest").value;
  const resultBox = document.getElementById("aiResult");

  resultBox.innerHTML = "<p>⏳ Analyzing your preferences...</p>";
  resultBox.style.display = 'block'; // Ensure the box is visible

  setTimeout(() => {
    let suggestion = "";
    let focusSites = []; // For map generation

    // --- Fully Rule-Based Logic ---
    if (duration === "3") {
      if (interest === "heritage") {
        suggestion = "✨ <strong>3-Day Heritage Explorer:</strong> Focus on Paoay Church and cultural sites in Laoag.";
        focusSites = ['Paoay Church', 'Malacañang of the North', 'Sinking Bell Tower'];
      } else if (interest === "adventure") {
        suggestion = "🚀 <strong>3-Day Thrill Seeker:</strong> Include Paoay Sand Dunes 4x4 ride and Kapurpurawan Rock Formation.";
        focusSites = ['Paoay Sand Dunes', 'Kapurpurawan Rock Formation', 'Bangui Windmills'];
      } else if (interest === "beach") {
        suggestion = "🏖️ <strong>3-Day Coastal Escape:</strong> Enjoy Pagudpud’s Saud Beach and Blue Lagoon.";
        focusSites = ['Saud Beach, Pagudpud', 'Blue Lagoon, Pagudpud', 'Patapat Viaduct'];
      } else if (interest === "food") {
        suggestion = "🥟 <strong>3-Day Culinary Tour:</strong> Prioritize Batac Empanadaan, Bagnet, and visit local markets.";
        focusSites = ['Batac Empanadaan', 'Laoag City Public Market', 'Paoay Church'];
      } else {
        suggestion = "We recommend the <strong>3D/2N Heritage & Nature Highlights</strong>.";
        focusSites = ['Paoay Church', 'Paoay Sand Dunes', 'Bangui Windmills'];
      }
    } else if (duration === "4") {
      suggestion = "Try the <strong>4D/3N Complete Ilocos Experience</strong> — includes Laoag, Pagudpud, and Vigan (Ilocos Sur).";
      focusSites = ['Paoay Church', 'Paoay Sand Dunes', 'Bangui Windmills', 'Calle Crisologo, Vigan']; 
    } else if (duration === "5" && budget === "luxury") {
      suggestion = "👑 <strong>Custom 5+ Day Luxury Itinerary</strong> — Extended Ilocos Norte stay with boutique hotels and a side trip to Vigan.";
      focusSites = ['Pagudpud', 'Paoay', 'Laoag', 'Vigan'];
    } else {
      suggestion = "We recommend the <strong>3D/2N Heritage & Nature Highlights</strong> — explore Paoay Church, Sand Dunes, and Pagudpud’s scenic coast!";
      focusSites = ['Paoay Church', 'Paoay Sand Dunes', 'Bangui Windmills'];
    }
    // --- End of Rule-Based Logic ---

    // --- Budget Estimation ---
    let baseCost = parseInt(duration) * 1500; // base per day (Budget)
    if (budget === "midrange") baseCost = parseInt(duration) * 3500; // Mid-range per day
    if (budget === "luxury") baseCost = parseInt(duration) * 7500; // Luxury per day

    const USD_PHP_RATE = 58.5; // Approximate rate
    const estimatedUSD = (baseCost / USD_PHP_RATE).toFixed(0);

    const formattedPHP = baseCost.toLocaleString('en-PH');

    // Add cost to suggestion
    suggestion += `<p>💰 Estimated Trip Cost (Excluding Flights): ₱${formattedPHP} (approx. $${estimatedUSD} USD)</p>`;

    // Reasoning explanation
    let reason = "";
    if (interest === "heritage") reason = "because you prefer cultural and historical attractions.";
    if (interest === "beach") reason = "since you enjoy beaches and scenic coastlines.";
    if (interest === "adventure") reason = "to include adventure activities like 4x4 rides.";
    if (interest === "food") reason = "to prioritize culinary experiences.";
    if (budget === "luxury") reason += " Your budget allows premium experiences.";
    suggestion += `<p class="mt-3" style="font-size:0.9em; color:#777;">*This suggestion is based on your preference for <strong>${interest}</strong> and a <strong>${budget}</strong> budget, ${reason.toLowerCase().trim() || "based on a balanced approach."}</p>`;

    // Generate the Map URL (Uses a placeholder Google Maps query)
    function generateMapUrl(sites) {
        if (!sites || sites.length === 0) return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115995.10118320496!2d120.4578768!3d18.1729015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x338dd8916327b871%3A0x8e83b27b3d36b701!2sIlocos%20Norte!5e0!3m2!1sen!2sph!4v1678891234567!5m2!1sen!2sph";
        const query = sites.join('+to+').replace(/\s/g, '+');
        // NOTE: This URL uses a placeholder key and is for visualization. A real API key is needed for live route finding.
        return `https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=$`;
    }
    
    const mapUrl = generateMapUrl(focusSites);
    
    // Generate the list of key sites
    const sitesList = focusSites
        .filter(site => !site.toLowerCase().includes('vigan'))
        .map(site => `<li>${site}</li>`).join('');

    // Update the results box with itinerary and map
    resultBox.innerHTML = `
        <h4 class="text-danger">${suggestion.split(':')[0]}</h4>
        <p class="mb-3">${suggestion.split(':')[1] || suggestion}</p>
        
        <h5 class="mt-3">Key Destinations:</h5>
        <ul>${sitesList}</ul>
        
        <p class="mt-3" style="font-size:0.9em; color:#555;">*This suggestion is based on our Rule-Based Expert System.</p>

        <h5 class="mt-4">📍 Suggested Route Map (Ilocos Norte Focus):</h5>
        <div class="map-container" style="height: 400px; width: 100%; overflow: hidden; border: 1px solid #ddd; border-radius: 4px;">
            <iframe
                width="100%"
                height="400"
                frameborder="0" style="border:0"
                src="${mapUrl}"
                allowfullscreen>
            </iframe>
            <p style="font-size:0.8em; margin-top:5px; text-align:center;">(NOTE: Map requires a Google Maps API Key to render the specific route.)</p>
        </div>
        
        <button class="btn btn-danger mt-3" onclick="saveItinerary('${suggestion.split(':')[0].replace(/<[^>]*>/g, '').trim()}', \`${sitesList}\`)">Save Itinerary</button>
    `;

  }, 1000); // 1 second delay to simulate "thinking"
}

// Add event listener for currency conversion on load
document.addEventListener('DOMContentLoaded', () => {
    const phpAmountInput = document.getElementById('phpAmount');
    const targetCurrencySelect = document.getElementById('targetCurrency');
    
    if (phpAmountInput && targetCurrencySelect) {
        phpAmountInput.addEventListener('input', convertCurrency);
        targetCurrencySelect.addEventListener('change', convertCurrency);
        
        // Initial call to set default result
        convertCurrency();
    }
});