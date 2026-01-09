export interface PricingSegmentDto {
  total: number;
  baseFare?: number;
  taxes?: number;
}
export interface ApiResponse<T> {
  succeeded: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PricingResponseDto {
  isRoundTrip: boolean;

  departure: PricingSegmentDto;
  return?: PricingSegmentDto | null;

  baseFare: number;
  taxes: number;
  total: number;

  currency: string;
  airline: string;
  origin: string;
  destination: string;
}
