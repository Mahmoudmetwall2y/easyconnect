import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchBar } from "../home/flight-search-bar/flight-search-bar";

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FlightSearchBar],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResults  implements OnInit{



  flights: any[] = [];
  originalFlights: any[] = [];

  selectedFrom: any = null;
  selectedTo: any = null;

  selectedDepartureDate: string | null = null;
  selectedReturnDate: string | null = null;

  adults: number = 1;
  children: number = 0;
  infants: number = 0;
  travelClass: string = 'السياحية';

  groupedFlights: any[] = [];

constructor(private router: Router) {
  const nav = this.router.getCurrentNavigation();
  const departures = nav?.extras?.state?.['departures'] || JSON.parse(sessionStorage.getItem('departures') || '[]');
  const returns = nav?.extras?.state?.['returns'] || JSON.parse(sessionStorage.getItem('returns') || '[]');

  this.selectedFrom = JSON.parse(sessionStorage.getItem('selectedFrom') || 'null');
  this.selectedTo = JSON.parse(sessionStorage.getItem('selectedTo') || 'null');

  const grouped = this.groupFlights(departures, returns);

this.groupedFlights = this.groupByAirline(grouped);

// لو ذهاب وعودة
if (sessionStorage.getItem('selectedTripType') === 'ذهاب وعودة') {
  this.groupedFlights = this.groupedFlights.filter(f => f.returnDepartureAt && f.returnArrivalAt);
}
this.selectedFrom = JSON.parse(sessionStorage.getItem('selectedFrom') || 'null');
this.selectedTo = JSON.parse(sessionStorage.getItem('selectedTo') || 'null');

this.selectedDepartureDate = sessionStorage.getItem('depDate');
this.selectedReturnDate = sessionStorage.getItem('retDate');

this.adults = Number(sessionStorage.getItem('adults') || 1);
this.children = Number(sessionStorage.getItem('children') || 0);
this.infants = Number(sessionStorage.getItem('infants') || 0);
this.travelClass = sessionStorage.getItem('travelClass') || 'السياحية';

  console.log("✅ grouped flights:", this.groupedFlights);
}



  ngOnInit() {}

private groupFlights(departures: any[], returns: any[]) {
  if (!departures?.length) return [];

  const results: any[] = [];

  for (const dep of departures) {
    // نجيب كل رحلات العودة المطابقة
    const matchingReturns = returns.filter(r =>
      r.airline === dep.airline &&
      new Date(r.departureAt) > new Date(dep.arrivalAt) &&
      r.origin === dep.destination &&
      r.destination === dep.origin
    );

    // ❌ لو الرحلة مفيش ليها أي Return → تجاهلها
    if (matchingReturns.length === 0) continue;

    // أفضل عودة
    const bestReturn = matchingReturns.sort((a, b) => a.price - b.price)[0];

    results.push({
      ...dep,
      // السعر الإجمالي
      price: dep.price + bestReturn.price,

      // بيانات العودة
      returnDepartureAt: bestReturn.departureAt,
      returnArrivalAt: bestReturn.arrivalAt,
      returnDuration: bestReturn.duration,
      returnStops: bestReturn.stops,
      returnOrigin: bestReturn.origin,
      returnDestination: bestReturn.destination,

      // Variations
      variations: departures.filter(d => d.airline === dep.airline),
      returnVariations: matchingReturns,

      isDepartureExpanded: false,
      isReturnExpanded: false
    });
  }

  return results;
}

  onChangeDeparture(selected: any) {
    this.flights.forEach(f => {
      if (f !== selected) f.isDepartureExpanded = false;
    });
    selected.isDepartureExpanded = !selected.isDepartureExpanded;
    selected.isReturnExpanded = false;
  }

  onChangeReturn(selected: any) {
    this.flights.forEach(f => {
      if (f !== selected) f.isReturnExpanded = false;
    });
    selected.isReturnExpanded = !selected.isReturnExpanded;
    selected.isDepartureExpanded = false;
  }
  // ✅ فتح أو غلق المواعيد البديلة
  toggleOptions(f: any) {
    f.isExpanded = !f.isExpanded;
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

  // ✅ English formatting
  return `${hours ? hours + ' hr' : ''}${minutes ? (hours ? ' ' : '') + minutes + ' min' : ''}`.trim();
}


 translateAirline(code?: string): string {
  if (!code) return '';

  const airlines: Record<string, string> = {
    // 🇴🇲 الخليج العربي
    'KU': 'الخطوط الجوية الكويتية',
    'SV': 'الخطوط الجوية السعودية',
    'EK': 'طيران الإمارات',
    'QR': 'الخطوط الجوية القطرية',
    'WY': 'الطيران العُماني',
    'GF': 'طيران الخليج (البحرين)',
    'EY': 'طيران الاتحاد (الإمارات)',
    'G9': 'العربية للطيران',
    'FZ': 'فلاي دبي',
    'J9': 'طيران جازيرا',
    'XY': 'طيران ناس',
    'NP': 'الطيران الوطنية', // ⭐ تمت الإضافة هنا

    // 🇪🇬 شمال أفريقيا
    'MS': 'مصر للطيران',
    'TU': 'الخطوط التونسية',
    'AT': 'الخطوط الملكية المغربية',
    'AH': 'الخطوط الجوية الجزائرية',
    'LN': 'الخطوط الجوية الليبية',

    // 🇹🇷 الشرق الأوسط وتركيا
    'RJ': 'الملكية الأردنية',
    'ME': 'طيران الشرق الأوسط (لبنان)',
    'TK': 'الخطوط الجوية التركية',
    'PC': 'طيران بيجاسوس التركي',

    // 🇪🇺 أوروبا
    'BA': 'الخطوط الجوية البريطانية',
    'LH': 'لوفتهانزا (ألمانيا)',
    'AF': 'الخطوط الجوية الفرنسية',
    'KL': 'الخطوط الملكية الهولندية (KLM)',
    'AZ': 'ITA Airways (إيطاليا)',
    'LX': 'سويس إير (سويسرا)',
    'OS': 'الخطوط النمساوية',
    'AY': 'فين إير (فنلندا)',
    'SK': 'ساس (الخطوط الإسكندنافية)',
    'IB': 'إيبيريا (إسبانيا)',

    // 🇺🇸 أمريكا
    'AA': 'الخطوط الجوية الأمريكية',
    'DL': 'دلتا إيرلاينز',
    'UA': 'يونايتد إيرلاينز',

    // 🌍 آسيا
    'CX': 'كاثي باسيفيك (هونغ كونغ)',
    'SQ': 'الخطوط الجوية السنغافورية',
    'NH': 'الخطوط الجوية اليابانية ANA',
    'JL': 'الخطوط الجوية اليابانية JAL',
    'KE': 'الخطوط الكورية',
    'CA': 'الخطوط الجوية الصينية',
    'MH': 'الخطوط الماليزية',
    'TG': 'الخطوط التايلاندية',

    // 🦘 أوقيانوسيا
    'QF': 'كانتاس (أستراليا)',
    'NZ': 'الخطوط الجوية النيوزيلندية',
  };

  return airlines[code] || code;
}

translateAirport(code?: string): string {
  if (!code) return '';

  const airports: Record<string, string> = {
    // 🇰🇼 الخليج
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

    // 🇪🇬 مصر وشمال إفريقيا
    'CAI': 'القاهرة',
    'HBE': 'برج العرب (الإسكندرية)',
    'HRG': 'الغردقة',
    'LXR': 'الأقصر',
    'SSH': 'شرم الشيخ',
    'ASW': 'أسوان',
    'TUN': 'تونس',
    'CMN': 'الدار البيضاء',
    'ALG': 'الجزائر',
    'TIP': 'طرابلس',

    // 🇱🇧 وبلاد الشام
    'BEY': 'بيروت',
    'AMM': 'عمّان',
    'DAM': 'دمشق',
    'ALE': 'حلب',

    // 🇹🇷 تركيا
    'IST': 'إسطنبول',
    'SAW': 'صبيحة كوكجن',
    'ESB': 'أنقرة',
    'ADB': 'إزمير',

    // 🇪🇺 أوروبا
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
    'FCO': 'روما (فيوميتشينو)',
    'MXP': 'ميلانو (مالبينسا)',
    'ATH': 'أثينا',
    'BRU': 'بروكسل',
    'CPH': 'كوبنهاغن',
    'OSL': 'أوسلو',
    'ARN': 'ستوكهولم',

    // 🇺🇸 أمريكا
    'JFK': 'نيويورك (جون كينيدي)',
    'EWR': 'نيوجيرسي (نيوآرك)',
    'ORD': 'شيكاغو',
    'LAX': 'لوس أنجلوس',
    'MIA': 'ميامي',
    'BOS': 'بوسطن',
    'DFW': 'دالاس',
    'IAD': 'واشنطن',

    // 🌍 آسيا
    'BKK': 'بانكوك',
    'KUL': 'كوالالمبور',
    'SIN': 'سنغافورة',
    'NRT': 'طوكيو (ناريتا)',
    'HND': 'طوكيو (هانيدا)',
    'ICN': 'سيول',
    'HKG': 'هونغ كونغ',
    'DEL': 'نيودلهي',
    'BOM': 'مومباي',
    'CGK': 'جاكرتا',
    'PEK': 'بكين',
    'PVG': 'شنغهاي',

    // 🦘 أوقيانوسيا
    'SYD': 'سيدني',
    'MEL': 'ملبورن',
    'AKL': 'أوكلاند',

    // 🇿🇦 أفريقيا جنوب الصحراء
    'JNB': 'جوهانسبرغ',
    'CPT': 'كيب تاون',

    // 🇷🇺 روسيا
    'SVO': 'موسكو (شيريميتيفو)',
    'DME': 'موسكو (دوموديدوفو)',
    'LED': 'سانت بطرسبرغ',
  };

  return airports[code.toUpperCase()] || code;
}



private groupByAirline(flights: any[]) {
  const grouped = flights.reduce((acc: any, f: any) => {
    const code = f.airline;

    if (!acc[code]) {
      acc[code] = {
        airline: f.airline,
        airlineLogo: f.airlineLogo,
        price: f.price,
        bestDeparture: f,
        variations: [],
        returnVariations: [],
        // نحتاج كل بيانات display في HTML
        ...f
      };
    } else {
      // أرخص سعر لهذه الشركة
      if (f.price < acc[code].price) {
        acc[code].price = f.price;
        acc[code].bestDeparture = f;

        // نحدّث البيانات الأساسية
        Object.assign(acc[code], f);
      }
    }

    // ضيف الـ variation
    acc[code].variations.push(f);

    // ضيف return بظروفها
    if (f.returnDepartureAt) {
      acc[code].returnVariations.push({
        departureAt: f.returnDepartureAt,
        arrivalAt: f.returnArrivalAt,
        duration: f.returnDuration,
        price: f.price,
        currency: f.currency,
        airline: f.airline,
        origin: f.returnOrigin,
        destination: f.returnDestination,
        stops: f.returnStops,
        airlineLogo: f.airlineLogo
      });
    }

    return acc;
  }, {});

  return Object.values(grouped);
}


}
