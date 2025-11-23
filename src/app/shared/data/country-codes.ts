export interface CountryCode {
  iso: string;
  name: string;
  flag: string; // image path
  dial: string;
}


export const COUNTRY_CODES: CountryCode[] = [
  { iso: 'EG', name: 'Egypt', flag: '/assets/flags/eg.png', dial: '+20' },
  { iso: 'SA', name: 'Saudi Arabia', flag: '/assets/flags/sa.png', dial: '+966' },
  { iso: 'AE', name: 'UAE', flag: '/assets/flags/ae.png', dial: '+971' },
  { iso: 'QA', name: 'Qatar', flag: '/assets/flags/qa.png', dial: '+974' },
  { iso: 'KW', name: 'Kuwait', flag: '/assets/flags/kw.png', dial: '+965' },
  { iso: 'OM', name: 'Oman', flag: '/assets/flags/om.png', dial: '+968' },
  { iso: 'BH', name: 'Bahrain', flag: '/assets/flags/bh.png', dial: '+973' },
  { iso: 'US', name: 'United States',  flag: '/assets/flags/us.png', dial: '+1'   },
  { iso: 'JO', name: 'Jordan', flag: '/assets/flags/jo.png', dial: '+962' },
  { iso: 'LB', name: 'Lebanon', flag: '/assets/flags/lb.png', dial: '+961' },
  { iso: 'MA', name: 'Morocco', flag: '/assets/flags/ma.png', dial: '+212' },
  { iso: 'TN', name: 'Tunisia', flag: '/assets/flags/tn.png', dial: '+216' },
  { iso: 'DZ', name: 'Algeria', flag: '/assets/flags/dz.png', dial: '+213' },
  { iso: 'TR', name: 'Turkey', flag: '/assets/flags/tr.png', dial: '+90' },
  { iso: 'IN', name: 'India', flag: '/assets/flags/in.png', dial: '+91' },
  { iso: 'GB', name: 'United Kingdom', flag: '/assets/flags/gb.png', dial: '+44' },
  { iso: 'DE', name: 'Germany', flag: '/assets/flags/de.png', dial: '+49' },
];

