export const AIRLINE_DOMAINS: Record<string, string> = {
  MS: 'egyptair.com',
  RJ: 'rj.com',
  ME: 'mea.com.lb',
  KU: 'kuwaitairways.com',
  SV: 'saudia.com',
  WY: 'omanair.com',
  GF: 'gulfair.com',
  EY: 'etihad.com',
  EK: 'emirates.com',
  QR: 'qatarairways.com',
  G9: 'airarabia.com',
  FZ: 'flydubai.com',
  J9: 'jazeeraairways.com',
  XY: 'flynas.com',
  AT: 'royalairmaroc.com',
  TU: 'tunisair.com',
  AH: 'airalgerie.dz',
  TK: 'thy.com',
  PC: 'flypgs.com',
  LH: 'lufthansa.com',
  AF: 'airfrance.com',
  BA: 'britishairways.com',
  IB: 'iberia.com',
  KL: 'klm.com',
  W6: 'wizzair.com',
  FR: 'ryanair.com',
  U2: 'easyjet.com',
  NE: 'nesmaairlines.com'

   

};
export function getAirlineLogo(code: string): string {
  //const domain = AIRLINE_DOMAINS[code?.toUpperCase()];

 // if (!domain) {
    return 'assets/d2.jpg';  // fallback الحقيقي
  //}

 // const url = `https://logo.clearbit.com/${domain}`;
 // return url;
}
