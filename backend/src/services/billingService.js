// backend/src/services/billingService.js

// Tarifs ENEO Cameroun (Tranches réelles)
const TARIFFS = [
  { min: 0, max: 110, rate: 50 },      // 50 FCFA/kWh
  { min: 111, max: 220, rate: 79 },    // 79 FCFA/kWh
  { min: 221, max: 400, rate: 94 },    // 94 FCFA/kWh
  { min: 401, max: Infinity, rate: 99 } // 99 FCFA/kWh
];

const TVA_RATE = 0.1925; // 19.25%

class BillingService {
  
  calculateConsumption(previousIndex, currentIndex) {
    if (currentIndex < previousIndex) {
      throw new Error('L\'index actuel ne peut pas être inférieur à l\'index précédent');
    }
    if (currentIndex === previousIndex) {
      throw new Error('La consommation ne peut pas être nulle');
    }
    return currentIndex - previousIndex;
  }

  calculatePrice(consumption) {
    let total = 0;
    let remaining = consumption;
    let details = [];
    
    for (const tier of TARIFFS) {
      if (remaining <= 0) break;
      
      const tierMax = tier.max === Infinity ? remaining : tier.max;
      const tierMin = tier.min;
      const tierRange = Math.min(remaining, tierMax - tierMin + 1);
      
      if (tierRange > 0) {
        const amount = tierRange * tier.rate;
        total += amount;
        details.push({
          range: `${tier.min} - ${tier.max === Infinity ? '+' : tier.max}`,
          rate: tier.rate,
          kwh: tierRange,
          amount: amount
        });
        remaining -= tierRange;
      }
    }
    
    return {
      total: Math.round(total),
      averageRate: Math.round(total / consumption),
      details: details
    };
  }

  calculateWithTax(amount) {
    return {
      beforeTax: amount,
      tax: Math.round(amount * TVA_RATE),
      total: Math.round(amount * (1 + TVA_RATE))
    };
  }

  calculateBill(previousIndex, currentIndex) {
    const consumption = this.calculateConsumption(previousIndex, currentIndex);
    const price = this.calculatePrice(consumption);
    const withTax = this.calculateWithTax(price.total);
    
    return {
      consumption,
      priceHT: price.total,
      averageRate: price.averageRate,
      tva: withTax.tax,
      totalTTC: withTax.total,
      breakdown: {
        consommation_kWh: consumption,
        details: price.details,
        prix_unitaire_moyen: price.averageRate,
        montant_HT: price.total,
        TVA: withTax.tax,
        montant_TTC: withTax.total
      }
    };
  }
}

module.exports = new BillingService();