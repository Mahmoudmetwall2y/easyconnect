import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private airlines: Record<string, string> = {
    'KU': 'الخطوط الجوية الكويتية',
    'SV': 'الخطوط الجوية السعودية',
    'EK': 'طيران الإمارات',
    'QR': 'الخطوط الجوية القطرية',
    'WY': 'الطيران العُماني',
    'GF': 'طيران الخليج (البحرين)',
    'EY': 'طيران الاتحاد',
    'G9': 'العربية للطيران',
    'FZ': 'فلاي دبي',
    'J9': 'طيران جازيرا',
    'XY': 'طيران ناس',
    'NP': 'الطيران الوطنية',

    'MS': 'مصر للطيران',
    'TU': 'الخطوط التونسية',
    'AT': 'الخطوط الملكية المغربية',
    'AH': 'الخطوط الجوية الجزائرية',
    'LN': 'الخطوط الجوية الليبية',

    'RJ': 'الملكية الأردنية',
    'ME': 'طيران الشرق الأوسط',
    'TK': 'الخطوط الجوية التركية',
    'PC': 'طيران بيجاسوس',

    'BA': 'الخطوط البريطانية',
    'LH': 'لوفتهانزا',
    'AF': 'الخطوط الفرنسية',
    'KL': 'KLM',
    'AZ': 'ITA Airways',
    'LX': 'سويس إير',
    'OS': 'النمساوية',
    'AY': 'Finnair',
    'SK': 'SAS',
    'IB': 'Iberia',

    'AA': 'American Airlines',
    'DL': 'Delta Airlines',
    'UA': 'United Airlines',

    'CX': 'Cathay Pacific',
    'SQ': 'Singapore Airlines',
    'NH': 'ANA',
    'JL': 'JAL',
    'KE': 'Korean Air',
    'CA': 'Air China',
    'MH': 'Malaysia Airlines',
    'TG': 'Thai Airways',

    'QF': 'Qantas',
    'NZ': 'Air New Zealand',
  };

  private airports: Record<string, string> = {
    'KWI': 'الكويت',
    'DOH': 'الدوحة',
    'BAH': 'المنامة',
    'RUH': 'الرياض',
    'JED': 'جدة',
    'DMM': 'الدمام',
    'AUH': 'أبوظبي',
    'SHJ': 'الشارقة',
    'DXB': 'دبي',
    'MCT': 'مسقط',

    'CAI': 'القاهرة',
    'HBE': 'برج العرب',
    'HRG': 'الغردقة',
    'LXR': 'الأقصر',
    'SSH': 'شرم الشيخ',
    'ASW': 'أسوان',
    'TUN': 'تونس',
    'CMN': 'الدار البيضاء',
    'ALG': 'الجزائر',
    'TIP': 'طرابلس',

    'BEY': 'بيروت',
    'AMM': 'عمّان',
    'DAM': 'دمشق',
    'ALE': 'حلب',

    'IST': 'إسطنبول',
    'SAW': 'صبيحة كوكجن',
    'ESB': 'أنقرة',
    'ADB': 'إزمير',

    'LHR': 'لندن (هيثرو)',
    'LGW': 'لندن (غاتويك)',
    'CDG': 'باريس (شارل ديغول)',
    'ORY': 'باريس (أورلي)',
    'FRA': 'فرانكفورت',
    'MUC': 'ميونخ',
    'AMS': 'أمستردام',
    'MAD': 'مدريد',
    'BCN': 'برشلونة',
    'VIE': 'فيينا',
    'ZRH': 'زيورخ',
    'FCO': 'روما',
    'MXP': 'ميلانو',
    'ATH': 'أثينا',
    'BRU': 'بروكسل',
    'CPH': 'كوبنهاغن',
    'OSL': 'أوسلو',
    'ARN': 'ستوكهولم',

    'JFK': 'نيويورك',
    'EWR': 'نيوآرك',
    'ORD': 'شيكاغو',
    'LAX': 'لوس أنجلوس',
    'MIA': 'ميامي',
    'BOS': 'بوسطن',
    'DFW': 'دالاس',
    'IAD': 'واشنطن',

    'BKK': 'بانكوك',
    'KUL': 'كوالالمبور',
    'SIN': 'سنغافورة',
    'NRT': 'طوكيو',
    'HND': 'هانيدا',
    'ICN': 'سيول',
    'HKG': 'هونغ كونغ',
    'DEL': 'نيودلهي',
    'BOM': 'مومباي',
    'CGK': 'جاكرتا',
    'PEK': 'بكين',
    'PVG': 'شنغهاي',

    'SYD': 'سيدني',
    'MEL': 'ملبورن',
    'AKL': 'أوكلاند',

    'JNB': 'جوهانسبرغ',
    'CPT': 'كيب تاون',

    'SVO': 'موسكو (شيريميتيفو)',
    'DME': 'موسكو (دوموديدوفو)',
    'LED': 'سانت بطرسبرغ',
  };

  translateAirline(code?: string): string {
    return code ? this.airlines[code] || code : '';
  }

  translateAirport(code?: string): string {
    return code ? this.airports[code.toUpperCase()] || code : '';
  }

  formatTime(dateString?: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'مساءً' : 'صباحاً';
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}



 formatDuration(duration?: string): string {
  if (!duration) return '';
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = match?.[1] ? match[1].replace('H', '') : '';
  const minutes = match?.[2] ? match[2].replace('M', '') : '';

  if (!hours && !minutes) return '';

  return `${hours ? hours + ' س' : ''}${minutes ? (hours ? ' ' : '') + minutes + ' د' : ''}`.trim();
}

}
