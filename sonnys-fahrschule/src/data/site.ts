export const site = {
  name: "Sonny's Fahrschule",
  owner: 'Bernd Schneider',
  contactName: 'Sonny Schneider',
  street: 'Fischergasse 16',
  city: '95326 Kulmbach',
  phone: '0170 - 2138671',
  phoneHref: 'tel:+491702138671',
  whatsapp: 'https://wa.me/491702138671',
  email: '42sonny@googlemail.com',
  hours: 'Montag und Mittwoch von 18°° Uhr - 20°° Uhr',
  mapsQuery: 'Fischergasse 16, 95326 Kulmbach',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Blog' },
  {
    href: '/fe-klassen/',
    label: 'FE-Klassen',
    children: [
      { href: '/fe-klassen/b-bf17/', label: 'B + BF17' },
      { href: '/fe-klassen/be/', label: 'BE' },
      { href: '/fe-klassen/b96/', label: 'B96' },
    ],
  },
  { href: '/kurse/', label: 'Kurse' },
  { href: '/news/', label: 'News' },
  { href: '/kontakt/', label: 'Kontakt' },
  { href: '/gaestebuch/', label: 'Gästebuch' },
  { href: '/passwortbereich/', label: 'Passwortbereich' },
  { href: '/info/', label: 'INFO' },
];

// Reihenfolge und Verlinkung wie auf der Seite "FE-Klassen"
export const klassen = [
  { code: 'B', img: '/img/klasse-b.png', href: '/fe-klassen/b-bf17/', short: 'Pkw bis 3.500 kg' },
  { code: 'BF17', img: '/img/klasse-bf17.png', href: '/fe-klassen/b-bf17/', short: 'Begleitetes Fahren ab 17' },
  { code: 'BE', img: '/img/klasse-be.png', href: '/fe-klassen/be/', short: 'Pkw mit Anhänger bis 3.500 kg' },
  { code: 'B96', img: '/img/klasse-b96.png', href: '/fe-klassen/b96/', short: 'Gespann bis 4.250 kg' },
];
