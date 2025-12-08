import { Injectable } from '@angular/core';
import { FlightsService } from '../../core/services/flights.service';
import { ApiResponse } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {



constructor(private flights: FlightsService) {}

getAirportFullInfo(code: string) {
  const c = code?.toUpperCase() || '';

  try {
    const svc = (window as any).ng?.getInjector(document.body)?.get?.(FlightsService);
    if (svc && svc.allAirports && svc.allAirports[c]) {
      const ap = svc.allAirports[c];
      return {
        code: c,
        airportName: ap.airportName || '',
        city: ap.city || '',
        country: ap.country || '',
        fullName: `${ap.city || ''} - ${ap.airportName || ''}`
      };
    }
  } catch {}

  // fallback ولا يمكن أن يرجع null
  const fallback = this.translateAirport(c);
  return {
    code: c,
    airportName: fallback,
    city: fallback,
    country: '',
    fullName: fallback
  };
}



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
    'KL': 'KLM Royal Dutch Airlines (الخطوط الملكية الهولندية)',

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
     'EW': 'Eurowings (يورَو وينجز)',
  'EI': 'Aer Lingus (إير لينجوس)',
   'A3': 'الخطوط الجوية اليونانية',
  'ET': ' الخطوط الجوية الإثيوبية',
  };

//   private airports: Record<string, string> = {
//     'KWI': 'الكويت',
//     'DOH': 'الدوحة',
//     'BAH': 'المنامة',
//     'RUH': 'الرياض',
//     'JED': 'جدة',
//     'DMM': 'الدمام',
//     'AUH': 'أبوظبي',
//     'SHJ': 'الشارقة',
//     'DXB': 'دبي',
//     'MCT': 'مسقط',

//     'CAI': 'القاهرة',
//     'HBE': 'برج العرب',
//     'HRG': 'الغردقة',
//     'LXR': 'الأقصر',
//     'SSH': 'شرم الشيخ',
//     'ASW': 'أسوان',
//     'TUN': 'تونس',
//     'CMN': 'الدار البيضاء',
//     'ALG': 'الجزائر',
//     'TIP': 'طرابلس',

//     'BEY': 'بيروت',
//     'AMM': 'عمّان',
//     'DAM': 'دمشق',
//     'ALE': 'حلب',

//     'IST': 'إسطنبول',
//     'SAW': 'صبيحة كوكجن',
//     'ESB': 'أنقرة',
//     'ADB': 'إزمير',

//     'LHR': 'لندن (هيثرو)',
//     'LGW': 'لندن (غاتويك)',
//     'CDG': 'باريس (شارل ديغول)',
//     'ORY': 'باريس (أورلي)',
//     'FRA': 'فرانكفورت',
//     'MUC': 'ميونخ',
//     'AMS': 'أمستردام',
//     'MAD': 'مدريد',
//     'BCN': 'برشلونة',
//     'VIE': 'فيينا',
//     'ZRH': 'زيورخ',
//     'FCO': 'روما',
//     'MXP': 'ميلانو',
//     'ATH': 'أثينا',
//     'BRU': 'بروكسل',
//     'CPH': 'كوبنهاغن',
//     'OSL': 'أوسلو',
//     'ARN': 'ستوكهولم',

//     'JFK': 'نيويورك',
//     'EWR': 'نيوآرك',
//     'ORD': 'شيكاغو',
//     'LAX': 'لوس أنجلوس',
//     'MIA': 'ميامي',
//     'BOS': 'بوسطن',
//     'DFW': 'دالاس',
//     'IAD': 'واشنطن',

//     'BKK': 'بانكوك',
//     'KUL': 'كوالالمبور',
//     'SIN': 'سنغافورة',
//     'NRT': 'طوكيو',
//     'HND': 'هانيدا',
//     'ICN': 'سيول',
//     'HKG': 'هونغ كونغ',
//     'DEL': 'نيودلهي',
//     'BOM': 'مومباي',
//     'CGK': 'جاكرتا',
//     'PEK': 'بكين',
//     'PVG': 'شنغهاي',

//     'SYD': 'سيدني',
//     'MEL': 'ملبورن',
//     'AKL': 'أوكلاند',

//     'JNB': 'جوهانسبرغ',
//     'CPT': 'كيب تاون',

//     'SVO': 'موسكو (شيريميتيفو)',
//     'DME': 'موسكو (دوموديدوفو)',
//     'LED': 'سانت بطرسبرغ',
//   };

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

  // نحول PT3H10M → مدة حقيقية
  const iso = duration.replace('PT', '');
  const hoursMatch = iso.match(/(\d+)H/);
  const minutesMatch = iso.match(/(\d+)M/);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  let result = '';

  if (hours > 0) result += `${hours} س`;
  if (minutes > 0) result += (hours > 0 ? ' ' : '') + `${minutes} د`;

  return result;
}


async getCountryByAirport(iata: string): Promise<string | null> {
  iata = iata?.toUpperCase();

  // 1) لو موجود في الماب → رجّعه فوراً
  if (this.airportCountryMap[iata]) return this.airportCountryMap[iata];

  // 2) غير كده → روح backend
  const res = await this.flights.getAirportInfo(iata).toPromise();
  return res?.data?.countryCode || null;
}



public readonly airportCountryMap: Record<string, string> = {
  // الكويت
  "KWI": "KW",

  // السعودية
  "JED": "SA",
  "RUH": "SA",
  "DMM": "SA",
  "MED": "SA",
  "TIF": "SA",
  "ELQ": "SA",

  // الإمارات
  "DXB": "AE",
  "AUH": "AE",
  "SHJ": "AE",
  "DWC": "AE",

  // قطر
  "DOH": "QA",

  // البحرين
  "BAH": "BH",

  // عمان
  "MCT": "OM",
  "SLL": "OM",

  // مصر
  "CAI": "EG",
  "HBE": "EG",
  "HRG": "EG",
  "SSH": "EG",
  "ASW": "EG",
  "LXR": "EG",
  "SPX": "EG",

  // الأردن
  "AMM": "JO",
  "AQJ": "JO",

  // لبنان
  "BEY": "LB",

  // تركيا
  "IST": "TR",
  "SAW": "TR",
  "ESB": "TR",
  "ADB": "TR",

  // بريطانيا
  "LHR": "GB",
  "LGW": "GB",
  "MAN": "GB",

  // فرنسا
  "CDG": "FR",
  "ORY": "FR",

  // ألمانيا
  "FRA": "DE",
  "MUC": "DE",
  "DUS": "DE",

  // هولندا
  "AMS": "NL",

  // إيطاليا
  "FCO": "IT",
  "MXP": "IT",

  // إسبانيا
  "MAD": "ES",
  "BCN": "ES",

  // أمريكا
  "JFK": "US",
  "EWR": "US",
  "LAX": "US",
  "ORD": "US",
  "MIA": "US",
  "DFW": "US",
  "IAD": "US"
};

private airports: Record<string, string> = {
  // الكويت
  "KWI": "مطار الكويت الدولي",

  // السعودية
  "JED": "مطار جدة الدولي (الملك عبدالعزيز)",
  "RUH": "مطار الملك خالد – الرياض",
  "DMM": "مطار الملك فهد – الدمام",
  "MED": "مطار الأمير محمد بن عبدالعزيز – المدينة",

  // الإمارات
  "DXB": "مطار دبي الدولي",
  "AUH": "مطار أبوظبي الدولي",
  "SHJ": "مطار الشارقة الدولي",
  "DWC": "مطار آل مكتوم – دبي",

  // قطر
  "DOH": "مطار حمد الدولي – الدوحة",

  // البحرين
  "BAH": "مطار البحرين الدولي",

  // عمان
  "MCT": "مطار مسقط الدولي",
  "SLL": "مطار صلالة",

  // مصر
  "CAI": "مطار القاهرة الدولي",
  "HBE": "مطار برج العرب – الإسكندرية",
  "HRG": "مطار الغردقة الدولي",
  "SSH": "مطار شرم الشيخ الدولي",
  "ASW": "مطار أسوان الدولي",
  "LXR": "مطار الأقصر الدولي",

  // الأردن
  "AMM": "مطار الملكة علياء الدولي – عمان",
  "AQJ": "مطار العقبة",

  // لبنان
  "BEY": "مطار بيروت رفيق الحريري الدولي",

  // تركيا
  "IST": "مطار إسطنبول الجديد",
  "SAW": "مطار صبيحة كوكجن – إسطنبول",
  "ESB": "مطار أنقرة",
  "ADB": "مطار إزمير",

  // بريطانيا
  "LHR": "مطار لندن هيثرو",
  "LGW": "مطار لندن غاتويك",
  "MAN": "مطار مانشستر",

  // فرنسا
  "CDG": "مطار باريس شارل ديغول",
  "ORY": "مطار باريس أورلي",

  // ألمانيا
  "FRA": "مطار فرانكفورت",
  "MUC": "مطار ميونخ",
  "DUS": "مطار دوسلدورف",

  // هولندا
  "AMS": "مطار أمستردام – سخيبول",

  // إيطاليا
  "FCO": "مطار روما – فيوميتشينو",
  "MXP": "مطار ميلانو – مالبينسا",

  // إسبانيا
  "MAD": "مطار مدريد باراخاس",
  "BCN": "مطار برشلونة",

  // أمريكا
  "JFK": "مطار جون إف كينيدي – نيويورك",
  "EWR": "مطار نيوآرك",
  "LAX": "مطار لوس أنجلوس الدولي",
  "ORD": "مطار شيكاغو أوهير",
  "MIA": "مطار ميامي الدولي",
  "DFW": "مطار دالاس",
  "IAD": "مطار واشنطن دالاس"
};








}
