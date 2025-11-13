/**
 * Main application logic for BYD EV Subsidy Calculator
 */

// Models data embedded to avoid CORS issues
// Updated with current 2024/2025 Thailand pricing
const modelsData = [
    {
        "name": "BYD Dolphin Standard Range",
        "price": 449900,
        "battery_capacity_kwh": 50.25,
        "fuel_type": "BEV",
        "export_model": false,
        "eligible_rebate": true,
        "eligible_excise": true,
        "image": "Dolphin.jpg"
    },
    {
        "name": "BYD Dolphin Extended Range",
        "price": 569900,
        "battery_capacity_kwh": 60.5,
        "fuel_type": "BEV",
        "export_model": false,
        "eligible_rebate": true,
        "eligible_excise": true,
        "image": "Dolphin Extended Range. .webp"
    },
    {
        "name": "BYD Seal AWD Performance",
        "price": 1174900,
        "battery_capacity_kwh": 82.5,
        "fuel_type": "BEV",
        "export_model": false,
        "eligible_rebate": true,
        "eligible_excise": true,
        "image": "Dolphins seal.jpeg"
    },
    {
        "name": "BYD Atto 3 Extended Range",
        "price": 999900,
        "battery_capacity_kwh": 60.5,
        "fuel_type": "BEV",
        "export_model": false,
        "eligible_rebate": true,
        "eligible_excise": true,
        "image": "BYD Atto.webp"
    },
    {
        "name": "BYD Han",
        "price": 2499000,
        "battery_capacity_kwh": 85.4,
        "fuel_type": "BEV",
        "export_model": false,
        "eligible_rebate": false,
        "eligible_excise": true,
        "image": "Han.jpg",
        "note": "Price unverified - may be special order only"
    }
];

let calculator = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    calculator = new EVSubsidyCalculator();
    populateModelSelect();
    setupCustomSelect();
    
    // Set up event listeners
    document.getElementById('calculateBtn').addEventListener('click', calculate);
    document.getElementById('modelSelect').addEventListener('change', () => {
        // Keep in sync with custom select
    });
});

/**
 * Populate the model dropdown with available BYD models
 */
function populateModelSelect() {
    const select = document.getElementById('modelSelect');
    const customOptions = document.getElementById('customSelectOptions');
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    customOptions.innerHTML = '';
    
    modelsData.forEach((model, index) => {
        // Add to hidden select for form compatibility
        const option = document.createElement('option');
        option.value = index;
        const formattedPriceTHB = calculator.formatCurrency(model.price);
        const formattedPriceCAD = calculator.formatCAD(calculator.convertToCAD(model.price));
        option.textContent = `${model.name} - ${formattedPriceTHB} (${formattedPriceCAD})`;
        select.appendChild(option);
        
        // Add to custom select with image
        const customOption = document.createElement('div');
        customOption.className = 'custom-select-option';
        customOption.dataset.value = index;
        customOption.innerHTML = `
            <img src="${model.image}" alt="${model.name}" class="option-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'150\'%3E%3Crect fill=\'%23ddd\' width=\'200\' height=\'150\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3ECar Image%3C/text%3E%3C/svg%3E'">
            <div class="option-content">
                <div class="option-name">${model.name}</div>
                <div class="option-price">
                    <span class="price-thb">${formattedPriceTHB}</span>
                    <span class="price-cad">${formattedPriceCAD}</span>
                </div>
            </div>
        `;
        customOptions.appendChild(customOption);
    });
}

/**
 * Setup custom select dropdown functionality
 */
function setupCustomSelect() {
    const customSelect = document.getElementById('customSelect');
    const customTrigger = customSelect.querySelector('.custom-select-trigger');
    const customOptions = document.getElementById('customSelectOptions');
    const select = document.getElementById('modelSelect');
    const placeholder = customTrigger.querySelector('.select-placeholder');
    
    // Toggle dropdown
    customTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelect.classList.toggle('open');
    });
    
    // Handle option selection
    customOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-select-option');
        if (option) {
            const value = option.dataset.value;
            select.value = value;
            
            // Update trigger display
            const model = modelsData[parseInt(value)];
            const formattedPriceTHB = calculator.formatCurrency(model.price);
            const formattedPriceCAD = calculator.formatCAD(calculator.convertToCAD(model.price));
            
            placeholder.innerHTML = `
                <img src="${model.image}" alt="${model.name}" class="trigger-image" onerror="this.style.display='none'">
                <span class="trigger-text">
                    <span class="trigger-name">${model.name}</span>
                    <span class="trigger-price">${formattedPriceTHB} (${formattedPriceCAD})</span>
                </span>
            `;
            
            customSelect.classList.remove('open');
            
            // Trigger change event
            select.dispatchEvent(new Event('change'));
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });
}

/**
 * Main calculation function
 */
function calculate() {
    const modelSelect = document.getElementById('modelSelect');
    const selectedIndex = modelSelect.value;
    
    if (selectedIndex === '') {
        document.getElementById('resultsPanel').style.display = 'none';
        return;
    }

    const model = modelsData[parseInt(selectedIndex)];
    const year = parseInt(document.getElementById('yearSelect').value);
    const priceOverrideInput = document.getElementById('priceOverride').value;
    const priceOverride = priceOverrideInput ? parseFloat(priceOverrideInput) : null;
    const isExportModel = document.getElementById('exportModel').checked;

    // Update model export status
    const modelWithExport = { ...model, export_model: isExportModel };

    // Perform calculation
    const result = calculator.calculate(modelWithExport, year, priceOverride);

    // Display results
    displayResults(result);
}

/**
 * Display calculation results in the UI
 */
function displayResults(result) {
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.style.display = 'block';

    // Convert to CAD
    const finalPriceCAD = calculator.convertToCAD(result.finalPrice);
    const totalSavingsCAD = calculator.convertToCAD(result.totalSavings);
    const basePriceCAD = calculator.convertToCAD(result.basePrice);
    const consumerRebateCAD = calculator.convertToCAD(result.consumerRebate);
    const priceAfterSubsidyCAD = calculator.convertToCAD(result.priceAfterSubsidy);
    const exciseDiscountCAD = calculator.convertToCAD(result.exciseDiscount);

    // Update price display with dual currency
    document.getElementById('finalPrice').innerHTML = `
        <div class="price-thb">${calculator.formatCurrency(result.finalPrice)}</div>
        <div class="price-cad">${calculator.formatCAD(finalPriceCAD)}</div>
    `;
    document.getElementById('totalSavings').innerHTML = `
        <span class="price-thb">${calculator.formatCurrency(result.totalSavings)}</span>
        <span class="price-cad">${calculator.formatCAD(totalSavingsCAD)}</span>
    `;

    // Update breakdown with dual currency
    document.getElementById('basePrice').innerHTML = `
        <div class="price-thb">${calculator.formatCurrency(result.basePrice)}</div>
        <div class="price-cad">${calculator.formatCAD(basePriceCAD)}</div>
    `;
    document.getElementById('consumerRebate').innerHTML = `
        <div class="price-thb negative">-${calculator.formatCurrency(result.consumerRebate)}</div>
        <div class="price-cad negative">-${calculator.formatCAD(consumerRebateCAD)}</div>
    `;
    document.getElementById('priceAfterSubsidy').innerHTML = `
        <div class="price-thb">${calculator.formatCurrency(result.priceAfterSubsidy)}</div>
        <div class="price-cad">${calculator.formatCAD(priceAfterSubsidyCAD)}</div>
    `;
    document.getElementById('exciseDiscount').innerHTML = `
        <div class="price-thb negative">-${calculator.formatCurrency(result.exciseDiscount)}</div>
        <div class="price-cad negative">-${calculator.formatCAD(exciseDiscountCAD)}</div>
    `;

    // Update rebate badge
    const rebateBadge = document.getElementById('rebateBadge');
    if (result.consumerRebate > 0) {
        rebateBadge.textContent = 'Applied';
        rebateBadge.style.display = 'inline-block';
        rebateBadge.className = 'badge badge-success';
    } else {
        rebateBadge.textContent = 'Not Eligible';
        rebateBadge.style.display = 'inline-block';
        rebateBadge.className = 'badge badge-inactive';
    }

    // Update excise badge
    const exciseBadge = document.getElementById('exciseBadge');
    if (result.eligibleExcise && result.exciseDiscount > 0) {
        exciseBadge.textContent = 'Applied';
        exciseBadge.style.display = 'inline-block';
        exciseBadge.className = 'badge badge-success';
    } else {
        exciseBadge.style.display = 'none';
    }

    // Update model info
    document.getElementById('batteryCapacity').textContent = `${result.batteryCapacity} kWh`;
    document.getElementById('fuelType').textContent = result.fuelType;

    // Update subsidies section
    displaySubsidies(result);

    // Update incentives
    displayIncentives(result);
}

/**
 * Display subsidies in a prominent section
 */
function displaySubsidies(result) {
    const subsidiesSection = document.getElementById('subsidiesSection');
    const consumerRebateCAD = calculator.convertToCAD(result.consumerRebate);
    const exciseDiscountCAD = calculator.convertToCAD(result.exciseDiscount);
    
    subsidiesSection.innerHTML = `
        <div class="subsidy-card ${result.consumerRebate > 0 ? 'active' : 'inactive'}">
            <div class="subsidy-icon">💰</div>
            <div class="subsidy-content">
                <h4>Consumer Rebate</h4>
                <div class="subsidy-amount">
                    <div class="price-thb">${calculator.formatCurrency(result.consumerRebate)}</div>
                    <div class="price-cad">${calculator.formatCAD(consumerRebateCAD)}</div>
                </div>
                <p class="subsidy-desc">${result.consumerRebate > 0 ? 'Eligible based on price and battery capacity' : 'Not eligible (price exceeds 2M THB or model not eligible)'}</p>
            </div>
        </div>
        <div class="subsidy-card ${result.exciseDiscount > 0 ? 'active' : 'inactive'}">
            <div class="subsidy-icon">📉</div>
            <div class="subsidy-content">
                <h4>Excise Tax Discount (2%)</h4>
                <div class="subsidy-amount">
                    <div class="price-thb">${calculator.formatCurrency(result.exciseDiscount)}</div>
                    <div class="price-cad">${calculator.formatCAD(exciseDiscountCAD)}</div>
                </div>
                <p class="subsidy-desc">${result.eligibleExcise ? 'Applied to eligible BEVs' : 'Not eligible'}</p>
            </div>
        </div>
    `;
}

/**
 * Display incentive badges
 */
function displayIncentives(result) {
    const incentivesGrid = document.getElementById('incentivesGrid');
    incentivesGrid.innerHTML = '';

    // Import Duty Cap
    const importDutyBadge = createIncentiveBadge(
        '🚢',
        'Import Duty Cap: 40% (2024-2025)',
        true
    );
    incentivesGrid.appendChild(importDutyBadge);

    // Corporate Tax Incentive
    const corporateTaxBadge = createIncentiveBadge(
        '🏢',
        'Corporate Tax Exemption: 8 years + 5 years at 50%',
        true
    );
    incentivesGrid.appendChild(corporateTaxBadge);

    // Export Credit
    if (result.exportModel) {
        const exportBadge = createIncentiveBadge(
            '🌍',
            'Export Credit: 1.5 units',
            true
        );
        incentivesGrid.appendChild(exportBadge);
    }
}

/**
 * Create an incentive badge element
 */
function createIncentiveBadge(icon, text, isActive) {
    const badge = document.createElement('div');
    badge.className = `incentive-badge ${isActive ? 'active' : 'inactive'}`;
    badge.innerHTML = `
        <span class="incentive-icon">${icon}</span>
        <span>${text}</span>
    `;
    return badge;
}

