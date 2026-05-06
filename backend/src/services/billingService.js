// Tarifs ENEO Cameroun (tarif résidentiel)
const TARIFFS = [
  { min: 0, max: 110, rate: 110 },      // 110 FCFA/kWh
  { min: 111, max: 220, rate: 115 },    // 115 FCFA/kWh
  { min: 221, max: Infinity, rate: 120 } // 120 FCFA/kWh
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
    let appliedRate = TARIFFS[0].rate;

    for (const tier of TARIFFS) {
      if (remaining <= 0) break;
      
      const tierMax = tier.max;
      const tierMin = tier.min;
      const tierRange = tierMax - tierMin + 1;
      const consumptionInTier = Math.min(remaining, tierRange);
      
      total += consumptionInTier * tier.rate;
      remaining -= consumptionInTier;
      appliedRate = tier.rate;
    }

    return {
      total: Math.round(total),
      averageRate: Math.round(total / consumption),
      appliedRate: appliedRate
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
        prix_unitaire_moyen: price.averageRate,
        montant_HT: price.total,
        TVA: withTax.tax,
        montant_TTC: withTax.total
      }
    };
  }
}

module.exports = new BillingService();