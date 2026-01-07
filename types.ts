
export interface QuoteData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface CalculationResult {
  nights: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  savingsIfTwoNights?: number;
}
