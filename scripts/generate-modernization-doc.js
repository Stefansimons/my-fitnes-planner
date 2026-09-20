const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = require('docx');

const outputPath = path.resolve(
  __dirname,
  '..',
  'MODERNIZATION_PROGRESS.docx'
);
const fallbackPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

function svgImage(svg, width, height) {
  return new ImageRun({
    data: Buffer.from(svg),
    fallback: { data: fallbackPng, type: 'png' },
    transformation: { width, height },
    type: 'svg',
  });
}

function box(x, y, width, height, label, fill) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="12" fill="${fill}" stroke="#1f2937" stroke-width="2"/><text x="${x + width / 2}" y="${y + height / 2 + 6}" text-anchor="middle" font-family="Arial" font-size="18" fill="#111827">${label}</text>`;
}

function arrow(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748b" stroke-width="3" marker-end="url(#arrow)"/>`;
}

function gitDiagram() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="420" viewBox="0 0 1100 420">
    <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#64748b"/></marker></defs>
    <rect width="1100" height="420" fill="#f8fafc"/>
    <text x="550" y="34" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#0f172a">Git tok modernizacije</text>
    ${box(35, 85, 190, 62, 'legacy-version', '#e2e8f0')}
    ${box(280, 85, 220, 62, 'Angular 13 -> 18', '#dbeafe')}
    ${box(555, 85, 230, 62, 'Angular 19 + standalone', '#dcfce7')}
    ${box(840, 85, 225, 62, 'Week 3 domain-api', '#fef3c7')}
    ${arrow(225, 116, 280, 116)}${arrow(500, 116, 555, 116)}${arrow(785, 116, 840, 116)}
    <path d="M390 147 V235 H670 V147" fill="none" stroke="#94a3b8" stroke-width="3"/>
    ${box(70, 270, 250, 62, 'week-2-angular-foundation', '#dbeafe')}
    ${box(425, 270, 250, 62, 'week-2-standalone-routing', '#dcfce7')}
    ${box(780, 270, 250, 62, 'feature-angular-modernization', '#ede9fe')}
    ${arrow(320, 301, 425, 301)}${arrow(675, 301, 780, 301)}
    <text x="550" y="385" text-anchor="middle" font-family="Arial" font-size="16" fill="#475569">Latest checkpoint: e2d79fe folder reorganization, merged at 027e29b</text>
  </svg>`;
}

function architectureDiagram() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="300" viewBox="0 0 1100 300">
    <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#64748b"/></marker></defs>
    <rect width="1100" height="300" fill="#f8fafc"/>
    <text x="550" y="35" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#0f172a">Arhitektonska tranzicija</text>
    ${box(35, 105, 180, 70, 'NgModule\nlegacy', '#e2e8f0')}
    ${box(265, 105, 180, 70, 'Angular 19\nstandalone', '#dbeafe')}
    ${box(495, 105, 180, 70, 'Feature\nstruktura', '#dcfce7')}
    ${box(725, 105, 150, 70, 'Domain +\nDTO', '#fef3c7')}
    ${box(925, 105, 140, 70, 'State +\nFacade', '#ede9fe')}
    ${arrow(215, 140, 265, 140)}${arrow(445, 140, 495, 140)}${arrow(675, 140, 725, 140)}${arrow(875, 140, 925, 140)}
    <text x="550" y="235" text-anchor="middle" font-family="Arial" font-size="17" fill="#475569">Smer rada: UI -> Facade -> State/API -> Adapter -> Domain Model</text>
  </svg>`;
}

function bullet(text, checked = true) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [
      new TextRun({ text: `${checked ? '[x]' : '[ ]'} ${text}` }),
    ],
  });
}

function statusTable() {
  const rows = [
    ['Angular/CLI upgrade', 'Zavrseno', 'Angular 19.2.x'],
    ['Standalone root i bootstrap', 'Zavrseno', 'bootstrapApplication + provideRouter'],
    ['Folder reorganizacija', 'Zavrseno', 'core / shared / features'],
    ['Feature standalone migracija', 'U toku', 'HomeComponent je prvi migrirani feature'],
    ['Domain/API/Adapter', 'Zavrseno', 'DTO, adapter testovi, API servis i error handling postoje'],
    ['State/Signals/Facade', 'U toku', 'WorkoutState i WorkoutFacade business flow postoje'],
    ['Karma/ChromeHeadless testovi', 'Otvoreno', 'Nema pouzdanog zavrsenog rezultata'],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: ['Oblast', 'Status', 'Detalj'].map((value) =>
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: value, bold: true })] })] })
        ),
      }),
      ...rows.map((row) =>
        new TableRow({
          children: row.map((value) => new TableCell({ children: [new Paragraph(value)] })),
        })
      ),
    ],
  });
}

const document = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          children: [new TextRun('My Fitness Planner - Modernization Progress')],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun('Stanje projekta i git tok modernizacije')],
        }),
        new Paragraph({ text: 'Trenutna grana: modernize/week-3-domain-api' }),
        new Paragraph({ text: 'Poslednji Week 2 checkpoint: e2d79fe refactor: organize application folders' }),
        new Paragraph({ text: 'Merge checkpoint: 027e29b' }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Git tok' }),
        new Paragraph({ children: [svgImage(gitDiagram(), 650, 248)] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Arhitektonska tranzicija' }),
        new Paragraph({ children: [svgImage(architectureDiagram(), 650, 177)] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Status po planu' }),
        statusTable(),
        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Zavrseno' }),
        bullet('Audit i dokumentacija arhitekture'),
        bullet('Postepeni Angular upgrade do verzije 19'),
        bullet('Uskladjivanje TypeScript, RxJS, Firebase, AngularFire, Material i ng-bootstrap'),
        bullet('Standalone root komponenta, bootstrapApplication i provideRouter'),
        bullet('Ocuvano lazy loading za workouts i nutrition feature'),
        bullet('Reorganizacija foldera na core, shared i features'),
        bullet('HomeComponent prebacen na standalone'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Sledece' }),
        bullet('Definisati Workout, WorkoutExercise i WorkoutSet domain modele'),
        bullet('Odvojiti Firestore DTO od frontend domain modela'),
        bullet('Dodati i testirati adapter DTO <-> domain'),
        bullet('Izdvojiti API service: WorkoutApiService'),
        bullet('Dodati API error handling kroz WorkoutApiError'),
        bullet('Povezati API service sa WorkoutState i WorkoutFacade'),
        bullet('Implementirati create/update/delete/finish workout flow'),
        bullet('Dodati WorkoutState unit testove za signals i reset'),
        bullet('Dodati WorkoutFacade unit testove za orchestration i error flow'),
        bullet('Povezati pocetno ucitavanje TrainingListComponent sa WorkoutFacade'),
        bullet('Prebaciti TrainingList delete/deactivate tok na WorkoutFacade'),
        bullet('Ukloniti neiskorisceni direktni read tok iz TrainingListComponent'),
        bullet('Dodati WorkoutState Signals query state za search, sort i pagination'),
        bullet('Prebaciti TrainingList prikaz i pagination na WorkoutFacade/WorkoutState'),
        bullet('Ukloniti TrainingService zavisnost iz TrainingListComponent'),
        bullet('Prebaciti TrainingForm create/update tok na WorkoutFacade'),
        bullet('Dodati naprednije state transitions i facade business flow', false),
        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Napomena' }),
        new Paragraph({ text: 'PDF plan je lokalni referentni fajl i nije deo source koda. Karma/ChromeHeadless testovi jos nemaju pouzdan zavrsen rezultat; production build je prolazio nakon migracionih koraka.' }),
      ],
    },
  ],
});

Packer.toBuffer(document).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${outputPath}`);
});
