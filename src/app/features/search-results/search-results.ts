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
selectedFrom: any;
selectedTo: any;

constructor(private router: Router) {
  const nav = this.router.getCurrentNavigation();
  let results: any[] = [];

  if (nav?.extras?.state?.['results']) {
    results = nav.extras.state['results'];
    sessionStorage.setItem('flights', JSON.stringify(results));
  } else {
    const saved = sessionStorage.getItem('flights');
    results = saved ? JSON.parse(saved) : [];
  }

  // 🟩 استرجاع الاتجاهات من البحث السابق
  const savedFrom = sessionStorage.getItem('selectedFrom');
  const savedTo = sessionStorage.getItem('selectedTo');
  this.selectedFrom = savedFrom ? JSON.parse(savedFrom) : null;
  this.selectedTo = savedTo ? JSON.parse(savedTo) : null;

  // 🟢 نعمل التجميع بعد استرجاع البيانات
  this.flights = this.groupFlights(results);
  console.log("✅ grouped flights:", this.flights);
}


  ngOnInit() {}

 
     
private groupFlights(flights: any[]) {
  const grouped: Record<string, any> = {};

  flights.forEach((f) => {
    // ✅ نحدد إذا كانت الرحلة ذهاب أو عودة بناءً على الـ origin
const isReturn = f.origin === this.selectedTo?.iataCode;

    // مفتاح التجميع حسب شركة الطيران والمسار الأساسي
    const baseKey =
      f.origin < f.destination
        ? `${f.origin}-${f.destination}-${f.airline}`
        : `${f.destination}-${f.origin}-${f.airline}`;

    if (!grouped[baseKey]) {
      grouped[baseKey] = {
        origin: f.origin < f.destination ? f.origin : f.destination,
        destination: f.origin < f.destination ? f.destination : f.origin,
        airline: f.airline,
        price: f.price,
        currency: f.currency,
        variations: [],
        returnVariations: [],
        isDepartureExpanded: false,
        isReturnExpanded: false,
      };
    }

    // ✈️ لو الرحلة ذهاب
    if (!isReturn) {
      grouped[baseKey].variations.push(f);
    }
    // 🔁 لو الرحلة عودة
    else {
      grouped[baseKey].returnVariations.push(f);
    }

    // ✅ نحدث أقل سعر
    if (f.price < grouped[baseKey].price) {
      grouped[baseKey].price = f.price;
    }
  });

  // ⏱️ ترتيب الرحلات حسب وقت المغادرة
  Object.values(grouped).forEach((g: any) => {
    g.variations.sort(
      (a: any, b: any) =>
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
    );
    g.returnVariations.sort(
      (a: any, b: any) =>
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
    );
  });

  return Object.values(grouped);
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
  // لو التوقيت راجع UTC نعدله لمنطقة المستخدم
  const local = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  let hours = local.getHours();
  const minutes = local.getMinutes().toString().padStart(2, '0');
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





}
