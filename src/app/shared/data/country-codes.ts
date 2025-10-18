export interface CountryCode {
  iso: string;
  name: string;
  flag: string; // image path
  dial: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { iso: 'EG', name: 'Egypt',          flag: '/assets/flags/eg.png', dial: '+20'  },
  { iso: 'SA', name: 'Saudi Arabia',   flag: '/assets/flags/sa.png', dial: '+966' },
  { iso: 'AE', name: 'UAE',            flag: '/assets/flags/ae.png', dial: '+971' },
  { iso: 'QA', name: 'Qatar',          flag: '/assets/flags/qa.png', dial: '+974' },
  { iso: 'KW', name: 'Kuwait',         flag: '/assets/flags/kw.png', dial: '+965' },
  { iso: 'OM', name: 'Oman',           flag: '/assets/flags/om.png', dial: '+968' },
  { iso: 'BH', name: 'Bahrain',        flag: '/assets/flags/bh.png', dial: '+973' },
  { iso: 'US', name: 'United States',  flag: '/assets/flags/us.png', dial: '+1'   },
  { iso: 'GB', name: 'United Kingdom', flag: '/assets/flags/gb.png', dial: '+44'  },
  { iso: 'DE', name: 'Germany',        flag: '/assets/flags/de.png', dial: '+49'  },
];
