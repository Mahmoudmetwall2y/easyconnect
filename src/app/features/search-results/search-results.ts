import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchBar } from "../home/flight-search-bar/flight-search-bar";

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FlightSearchBar],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
})
export class SearchResults  implements OnInit{



  flights: any[] = [];
  originalFlights: any[] = [];

  selectedFrom: any = null;
  selectedTo: any = null;

  selectedDepartureDate:string | Date | null = null;
  selectedReturnDate: string | Date | null= null;

  adults: number = 1;
  children: number = 0;
  infants: number = 0;
  travelClass: string = 'السياحية';

  groupedFlights: any[] = [];

  constructor(private router: Router) {

    const nav = this.router.getCurrentNavigation();

    const departures =
      nav?.extras?.state?.['departures'] ||
      JSON.parse(sessionStorage.getItem('departures') || '[]');

    const returns =
      nav?.extras?.state?.['returns'] ||
      JSON.parse(sessionStorage.getItem('returns') || '[]');

    this.selectedFrom = JSON.parse(sessionStorage.getItem('selectedFrom') || 'null');
    this.selectedTo = JSON.parse(sessionStorage.getItem('selectedTo') || 'null');

    this.selectedDepartureDate = new Date(sessionStorage.getItem('depDate')!);
    this.selectedReturnDate = new Date(sessionStorage.getItem('retDate')!);

    this.adults = Number(sessionStorage.getItem('adults') || 1);
    this.children = Number(sessionStorage.getItem('children') || 0);
    this.infants = Number(sessionStorage.getItem('infants') || 0);
    this.travelClass = sessionStorage.getItem('travelClass') || 'السياحية';

    const grouped = this.groupFlights(departures, returns);

    // Group per airline
    this.groupedFlights = this.groupByAirline(grouped);

    // Only valid if round trip
    if (sessionStorage.getItem('selectedTripType') === 'ذهاب وعودة') {
      this.groupedFlights = this.groupedFlights.filter(f => f.returnDepartureAt);
    }

    console.log("✅ Clean grouped flights:", this.groupedFlights);
  }

  ngOnInit() {}



  // ---------------------------------------------------------------------
  // 🔵 CLEAN GROUPING OF FLIGHTS (DEPARTURES + RETURNS)
  // ---------------------------------------------------------------------
  private groupFlights(departures: any[], returns: any[]) {
    if (!departures?.length) return [];

    const depDay = new Date(sessionStorage.getItem('depDate')!).toDateString();
    const retDay = new Date(sessionStorage.getItem('retDate')!).toDateString();

    const depSameDay = departures.filter(d =>
      new Date(d.departureAt).toDateString() === depDay
    );

    const retSameDay = returns.filter(r =>
      new Date(r.departureAt).toDateString() === retDay
    );

    const results: any[] = [];

    for (const dep of depSameDay) {

      const matchingReturns = retSameDay.filter(r =>
        r.airline === dep.airline &&
        r.origin === dep.destination &&
        r.destination === dep.origin &&
        new Date(r.departureAt) > new Date(dep.arrivalAt)
      );

      if (matchingReturns.length === 0) continue;

      const bestReturn = matchingReturns.sort((a, b) => a.price - b.price)[0];

      results.push({

        // ----------- MAIN DISPLAY DATA -----------
        airline: dep.airline,
        airlineLogo: dep.airlineLogo,

        origin: dep.origin,
        destination: dep.destination,

        departureAt: dep.departureAt,
        arrivalAt: dep.arrivalAt,
        duration: dep.duration,
        stops: dep.stops,
        currency: dep.currency,
        price: dep.price + bestReturn.price,

        // ----------- RETURN DISPLAY DATA ---------
        returnDepartureAt: bestReturn.departureAt,
        returnArrivalAt: bestReturn.arrivalAt,
        returnDuration: bestReturn.duration,
        returnStops: bestReturn.stops,
        returnOrigin: bestReturn.origin,
        returnDestination: bestReturn.destination,

        // ----------- DEPARTURE VARIATIONS (Only Dep) -----------
        variations: depSameDay
          .filter(xx => xx.airline === dep.airline)
        .map(d => ({
          departureAt: d.departureAt,
          arrivalAt: d.arrivalAt,
          duration: d.duration,
          stops: d.stops,
          origin: d.origin,
          destination: d.destination,
          airline: d.airline,
          airlineLogo: d.airlineLogo,
          currency: d.currency,
          price: d.price
        })),

        // ----------- RETURN VARIATIONS (Only Return) -----------
        returnVariations: matchingReturns.map(r => ({
          departureAt: r.departureAt,
          arrivalAt: r.arrivalAt,
          duration: r.duration,
          stops: r.stops,
          origin: r.origin,
          destination: r.destination,
          airline: r.airline,
          airlineLogo: r.airlineLogo,
          currency: r.currency,
          price: r.price
        })),

        isDepartureExpanded: false,
        isReturnExpanded: false
      });

    }

    return results;
  }

  // ---------------------------------------------------------------------
  // 🔵 GROUP BY AIRLINE (CLEAN, NO DUPLICATES)
  // ---------------------------------------------------------------------
  private groupByAirline(flights: any[]) {

    const grouped: any = {};

    for (const f of flights) {

      if (!grouped[f.airline]) {
        grouped[f.airline] = {
          airline: f.airline,
          airlineLogo: f.airlineLogo,
          price: f.price,

          ...f,

          variations: [...f.variations],
          returnVariations: [...f.returnVariations],

          isDepartureExpanded: false,
          isReturnExpanded: false
        };
      }

      // Keep Cheapest
      if (f.price < grouped[f.airline].price) {
        grouped[f.airline].price = f.price;
        Object.assign(grouped[f.airline], f);
      }
    }

    return Object.values(grouped);
  }

  // ---------------------------------------------------------------------
  // UI ACTIONS
  // ---------------------------------------------------------------------

onChangeDeparture(selected: any) {
  this.groupedFlights.forEach(f => {
    if (f !== selected) f.isDepartureExpanded = false;
  });

  selected.isDepartureExpanded = !selected.isDepartureExpanded;
  selected.isReturnExpanded = false;
}


onChangeReturn(selected: any) {
  this.groupedFlights.forEach(f => {
    if (f !== selected) f.isReturnExpanded = false;
  });

  selected.isReturnExpanded = !selected.isReturnExpanded;
  selected.isDepartureExpanded = false;
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

applyNewDeparture(f: any, option: any) {
    f.selectedDeparture = option;   // ← حطيه هنا

  f.price = option.price + (f.returnPrice || 0);  // تحديث السعر النهائي
  f.departureAt = option.departureAt;
  f.arrivalAt = option.arrivalAt;
  f.duration = option.duration;
  f.stops = option.stops;
}
applyNewReturn(f: any, option: any) {
    f.selectedReturn = option;   // ← نفس الفكرة هنا

  f.price = (f.price - f.returnPrice) + option.price;
  f.returnPrice = option.price;
  f.returnDepartureAt = option.departureAt;
  f.returnArrivalAt = option.arrivalAt;
  f.returnDuration = option.duration;
  f.returnStops = option.stops;
}




}
