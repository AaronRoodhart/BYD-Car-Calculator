/**
 * EV Subsidy Calculator for Thailand EV 3.5 Policy
 * Calculation engine for BYD car pricing with subsidies
 */

class EVSubsidyCalculator {
  constructor() {
    this.SUBSIDY_THRESHOLD = 2000000; // 2 million THB
    this.EXCISE_TAX_RATE = 0.02; // 2% for BEVs
    this.IMPORT_DUTY_CAP = 0.40; // 40% cap for CBU imports 2024-2025
  }

  /**
   * Calculate consumer rebate based on price, battery capacity, and year
   * @param {number} price - Base price in THB
   * @param {number} batteryCapacity - Battery capacity in kWh
   * @param {number} year - Year (2024, 2025, 2026, or 2027)
   * @param {boolean} eligibleRebate - Whether model is eligible for rebate
   * @returns {number} Subsidy amount in THB
   */
  calculateConsumerRebate(price, batteryCapacity, year, eligibleRebate) {
    if (!eligibleRebate || price > this.SUBSIDY_THRESHOLD) {
      return 0;
    }

    const isHighCapacity = batteryCapacity >= 50;
    let subsidy = 0;

    if (isHighCapacity) {
      // Battery ≥ 50 kWh
      if (year === 2024) {
        subsidy = 100000;
      } else if (year === 2025) {
        subsidy = 75000;
      } else if (year === 2026 || year === 2027) {
        subsidy = 50000;
      }
    } else if (batteryCapacity >= 10) {
      // Battery 10 kWh to < 50 kWh
      if (year === 2024) {
        subsidy = 50000;
      } else if (year === 2025) {
        subsidy = 35000;
      } else if (year === 2026 || year === 2027) {
        subsidy = 25000;
      }
    }

    return subsidy;
  }

  /**
   * Calculate excise tax discount
   * @param {number} priceAfterSubsidy - Price after consumer rebate
   * @param {boolean} eligibleExcise - Whether model is eligible for excise reduction
   * @returns {number} Excise discount amount in THB
   */
  calculateExciseDiscount(priceAfterSubsidy, eligibleExcise) {
    if (!eligibleExcise) {
      return 0;
    }
    return priceAfterSubsidy * this.EXCISE_TAX_RATE;
  }

  /**
   * Calculate final price with all subsidies applied
   * @param {Object} model - Model object with price, battery_capacity_kwh, etc.
   * @param {number} year - Year for subsidy calculation
   * @param {number|null} overridePrice - Optional price override
   * @returns {Object} Calculation results
   */
  calculate(model, year = 2024, overridePrice = null) {
    const basePrice = overridePrice !== null ? overridePrice : model.price;
    const batteryCapacity = model.battery_capacity_kwh || 0;
    
    // Consumer rebate
    const consumerRebate = this.calculateConsumerRebate(
      basePrice,
      batteryCapacity,
      year,
      model.eligible_rebate
    );

    // Price after consumer rebate
    const priceAfterSubsidy = basePrice - consumerRebate;

    // Excise tax discount
    const exciseDiscount = this.calculateExciseDiscount(
      priceAfterSubsidy,
      model.eligible_excise
    );

    // Final price
    const finalPrice = Math.round(priceAfterSubsidy - exciseDiscount);

    // Total savings
    const totalSavings = consumerRebate + exciseDiscount;

    return {
      basePrice,
      consumerRebate,
      exciseDiscount,
      priceAfterSubsidy,
      finalPrice,
      totalSavings,
      year,
      model: model.name,
      batteryCapacity,
      fuelType: model.fuel_type,
      exportModel: model.export_model || false,
      eligibleRebate: model.eligible_rebate,
      eligibleExcise: model.eligible_excise
    };
  }

  /**
   * Format number as Thai Baht currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format number with thousand separators
   * @param {number} amount - Amount to format
   * @returns {string} Formatted number string
   */
  formatNumber(amount) {
    return new Intl.NumberFormat('th-TH').format(amount);
  }

  /**
   * Convert THB to CAD (approximate exchange rate: 1 THB = 0.037 CAD)
   * @param {number} thbAmount - Amount in THB
   * @returns {number} Amount in CAD
   */
  convertToCAD(thbAmount) {
    // Exchange rate: approximately 1 THB = 0.037 CAD (27 THB = 1 CAD)
    return thbAmount / 27;
  }

  /**
   * Format number as Canadian Dollar currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCAD(amount) {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EVSubsidyCalculator;
}

