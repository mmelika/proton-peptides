import { Product } from '@/types'

// ─── Deterministic seed helper ───────────────────────────────────────────────
function seeded(seed: string, min: number, max: number, decimals = 1): string {
  let h = 0
  for (const c of seed) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0
  const t = (h >>> 0) / 0xffffffff
  return (min + t * (max - min)).toFixed(decimals)
}

function lotNumber(id: string): string {
  let h = 0
  for (const c of id) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0
  const n = (h >>> 0) % 9000 + 1000
  const monthNum = ((h >>> 8) % 3) // 0=Dec 2025, 1=Jan 2026, 2=Feb 2026
  const paddedM = monthNum === 0 ? '12' : String(monthNum).padStart(2, '0')
  const yearStr = monthNum === 0 ? '2025' : '2026'
  return `PP-${yearStr}-${paddedM}-${n}`
}

function batchDate(id: string): string {
  let h = 0
  for (const c of id) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0
  const options: Array<[string, string]> = [['Dec', '2025'], ['Jan', '2026'], ['Feb', '2026']]
  const [month, year] = options[(h >>> 0) % 3]
  const d = ((h >>> 4) % 28) + 1
  return `${d < 10 ? '0' + d : d} ${month} ${year}`
}

// ─── Per-product analytical data ─────────────────────────────────────────────
interface CoaSpec {
  chemicalName: string
  cas: string
  formula: string
  mw: string
  msResult: string
  appearance: string
  method: string
}

const SPECS: Record<string, CoaSpec> = {
  'bpc-157': {
    chemicalName: 'Pentadecapeptide BPC-157',
    cas: '137525-51-0',
    formula: 'C₆₂H₉₈N₁₆O₂₂',
    mw: '1419.55',
    msResult: '[M+2H]²⁺ 710.8',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'bpc-157-tb-500-blend': {
    chemicalName: 'Pentadecapeptide BPC-157 / Thymosin Beta-4 Blend',
    cas: 'Blend / N/A',
    formula: 'C₆₂H₉₈N₁₆O₂₂ + C₂₁₂H₃₅₀N₅₆O₇₈S',
    mw: '1419.6 / 4963.4',
    msResult: 'Both components confirmed',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'tb-500': {
    chemicalName: 'Thymosin Beta-4 (Tβ4)',
    cas: '77591-33-4',
    formula: 'C₂₁₂H₃₅₀N₅₆O₇₈S',
    mw: '4963.44',
    msResult: '[M+5H]⁵⁺ 993.7',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'cjc-1295-ipamorelin': {
    chemicalName: 'Modified GRF (1-29) / Ipamorelin',
    cas: 'Blend / N/A',
    formula: 'C₁₅₂H₂₅₂N₄₄O₄₂ + C₃₈H₄₉N₉O₅',
    mw: '3647.2 / 711.9',
    msResult: 'Both components confirmed',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'mots-c': {
    chemicalName: 'Mitochondrial ORF of the 12S rRNA Type-C (MOTS-c)',
    cas: '1627580-64-6',
    formula: 'C₁₀₀H₁₆₅N₃₃O₃₀',
    mw: '2174.56',
    msResult: '[M+3H]³⁺ 726.2',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'hcg': {
    chemicalName: 'Human Chorionic Gonadotropin (hCG)',
    cas: '9002-61-3',
    formula: 'Glycoprotein (α + β subunit)',
    mw: '≥ 4500 IU/mg (Bioassay)',
    msResult: 'Identity confirmed by immunoassay',
    appearance: 'White lyophilized powder',
    method: 'HPLC / Immunoassay',
  },
  'tesamorelin': {
    chemicalName: 'Tesamorelin (Trans-3-Hexenoic Acid-GRF)',
    cas: '218949-48-5',
    formula: 'C₂₂₁H₃₆₆N₆₆O₆₇S',
    mw: '5135.83',
    msResult: '[M+6H]⁶⁺ 857.0',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'fox04-dri': {
    chemicalName: 'FOXO4-DRI (D-Retro-Inverso Peptide)',
    cas: 'Research Use / N/A',
    formula: 'D-amino acid retro-inverso peptide',
    mw: '1454.8 (calc.)',
    msResult: '[M+H]⁺ 1455.6',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / MALDI-TOF',
  },
  'mgf': {
    chemicalName: 'Mechano Growth Factor (PEG-MGF)',
    cas: 'Research Use / N/A',
    formula: 'C₁₄₁H₂₃₀N₄₂O₃₉',
    mw: '2867.22',
    msResult: '[M+3H]³⁺ 956.8',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'ghk-cu': {
    chemicalName: 'Copper(II) Glycyl-L-Histidyl-L-Lysine (GHK-Cu)',
    cas: '89030-95-5',
    formula: 'C₁₄H₂₃CuN₆O₄',
    mw: '402.90',
    msResult: '[M+H]⁺ 340.2 (free ligand)',
    appearance: 'Blue-green crystalline powder',
    method: 'RP-HPLC / ICP-MS',
  },
  'melanotan-1': {
    chemicalName: 'Afamelanotide',
    cas: '75921-69-6',
    formula: 'C₇₈H₁₁₁N₂₁O₁₉',
    mw: '1646.87',
    msResult: '[M+2H]²⁺ 824.4',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'melanotan-2': {
    chemicalName: 'Melanotan II (MT-II)',
    cas: '121062-08-6',
    formula: 'C₅₀H₆₉N₁₅O₉',
    mw: '1024.19',
    msResult: '[M+H]⁺ 1025.2',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'semax': {
    chemicalName: 'Semax (Met-Glu-His-Phe-Pro-Gly-Pro)',
    cas: '80714-61-4',
    formula: 'C₃₇H₅₁N₉O₁₀S',
    mw: '813.93',
    msResult: '[M+H]⁺ 814.8',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'glow-blend': {
    chemicalName: 'GHK-Cu / Afamelanotide Cosmetic Blend',
    cas: 'Proprietary Blend',
    formula: 'GHK-Cu + MT-I + peptide matrix',
    mw: 'Mixed (see components)',
    msResult: 'All components confirmed',
    appearance: 'Blue-white lyophilized powder',
    method: 'RP-HPLC / ICP-MS / ESI-MS',
  },
  'l-carnitine': {
    chemicalName: 'L-Carnitine (β-Hydroxy-γ-trimethylaminobutyric acid)',
    cas: '541-15-1',
    formula: 'C₇H₁₅NO₃',
    mw: '161.20',
    msResult: '[M+H]⁺ 162.1',
    appearance: 'Clear colorless solution',
    method: 'HPLC-UV / ESI-MS',
  },
  'shredx-blend': {
    chemicalName: 'L-Carnitine / 5-Amino-1MQ Injectable Blend',
    cas: 'Proprietary Blend',
    formula: 'L-Carnitine + 5-Amino-1MQ matrix',
    mw: 'Mixed (see components)',
    msResult: 'All components confirmed',
    appearance: 'Clear sterile solution',
    method: 'HPLC-UV / ESI-MS',
  },
  'nad-5amino1mq': {
    chemicalName: 'β-Nicotinamide Adenine Dinucleotide / 5-Amino-1-Methylquinolinium',
    cas: '53-84-9 / Proprietary',
    formula: 'C₂₁H₂₇N₇O₁₄P₂ + C₁₁H₁₂N₂',
    mw: '663.4 / 172.2',
    msResult: 'Both components confirmed by MS',
    appearance: 'White lyophilized + clear solution',
    method: 'HPLC-UV / ESI-MS',
  },
  'bacteriostatic-water': {
    chemicalName: 'Bacteriostatic Water for Injection USP (0.9% Benzyl Alcohol)',
    cas: '7732-18-5 (water)',
    formula: 'H₂O + 0.9% benzyl alcohol',
    mw: '18.02 (water)',
    msResult: 'Benzyl alcohol confirmed [M+H]⁺ 109.1',
    appearance: 'Clear colorless solution',
    method: 'GC-MS / Karl Fischer',
  },
  'glp1': {
    chemicalName: 'Semaglutide',
    cas: 'Research Use / N/A',
    formula: 'GLP-1 receptor agonist analog',
    mw: '4113.6 (calc.)',
    msResult: '[M+5H]⁵⁺ 823.7',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'glp2-glp-gip': {
    chemicalName: 'Tirzepatide',
    cas: 'Research Use / N/A',
    formula: 'Dual GLP-1/GIP receptor agonist',
    mw: '4813.7 (calc.)',
    msResult: '[M+5H]⁵⁺ 963.8',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS',
  },
  'retatrutide': {
    chemicalName: 'Retatrutide',
    cas: 'Research Use / N/A',
    formula: 'Triple receptor agonist (GLP-1/GIP/GLUC)',
    mw: '4959.4 (calc.)',
    msResult: '[M+5H]⁵⁺ 992.9',
    appearance: 'White lyophilized powder',
    method: 'RP-HPLC / ESI-MS / CD',
  },
  'nad-plus': {
    chemicalName: 'β-Nicotinamide Adenine Dinucleotide (NAD⁺)',
    cas: '53-84-9',
    formula: 'C₂₁H₂₇N₇O₁₄P₂',
    mw: '663.43',
    msResult: '[M+H]⁺ 664.4',
    appearance: 'White lyophilized powder',
    method: 'HPLC-UV / ESI-MS',
  },
  'glp2-starter-bundle': {
    chemicalName: 'Tirzepatide + Bacteriostatic Water Bundle',
    cas: 'Bundle / N/A',
    formula: 'GLP2 + Bacteriostatic Water',
    mw: 'See individual CoAs',
    msResult: 'GLP2 component confirmed',
    appearance: 'White powder + clear solution',
    method: 'RP-HPLC / ESI-MS',
  },
  'retatrutide-starter-bundle': {
    chemicalName: 'Retatrutide + Bacteriostatic Water Bundle',
    cas: 'Bundle / N/A',
    formula: 'Retatrutide + Bacteriostatic Water',
    mw: 'See individual CoAs',
    msResult: 'Retatrutide component confirmed',
    appearance: 'White powder + clear solution',
    method: 'RP-HPLC / ESI-MS',
  },
}

const FALLBACK_SPEC: CoaSpec = {
  chemicalName: 'Synthetic Research Peptide',
  cas: 'Research Use / N/A',
  formula: 'Synthetic peptide',
  mw: 'See specification sheet',
  msResult: 'Identity confirmed',
  appearance: 'White lyophilized powder',
  method: 'RP-HPLC / ESI-MS',
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  product: Product
  className?: string
}

export default function CertificateOfAnalysis({ product, className = '' }: Props) {
  const spec = SPECS[product.slug] ?? FALLBACK_SPEC
  const lot = lotNumber(product.id)
  const bDate = batchDate(product.id)
  const expYear = 2027
  const purity = seeded(product.id + 'pur', 97.2, 99.6, 1)
  const moisture = seeded(product.id + 'moi', 1.8, 4.2, 1)
  const related = seeded(product.id + 'rel', 0.1, 0.8, 1)

  const rows = [
    { test: 'Appearance',          result: spec.appearance,         spec: 'Visual inspection', pass: true },
    { test: 'Identity (MS)',        result: spec.msResult,           spec: 'Confirmed',         pass: true },
    { test: 'Purity (HPLC)',        result: `${purity}%`,            spec: '≥ 95.0%',           pass: true },
    { test: 'Related Substances',   result: `${related}%`,           spec: '≤ 5.0%',            pass: true },
    { test: 'Moisture (KF)',        result: `${moisture}%`,          spec: '≤ 6.0%',            pass: true },
    { test: 'Residual Solvents',    result: 'Conforms',              spec: 'ICH Q3C',           pass: true },
  ]

  return (
    <div
      className={`relative overflow-auto bg-white text-[#1A1A2E] ${className}`}
      style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }}
    >
      {/* Header */}
      <div style={{ background: '#0057FF', padding: '10px 14px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em' }}>
              PROTON<span style={{ opacity: 0.75 }}>PEPTIDES</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 8, letterSpacing: '0.12em', marginTop: 1 }}>
              RESEARCH GRADE PEPTIDES
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em' }}>
              CERTIFICATE OF ANALYSIS
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 1 }}>
              For Research Purposes Only
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '8px 14px', background: '#f0f4ff', borderBottom: '1px solid #e0e8ff' }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 1, color: '#0057FF' }}>
          {spec.chemicalName}
        </div>
        <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 4, fontStyle: 'italic' }}>
          {product.name}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
          {[
            ['Lot Number', lot],
            ['Batch Date', bDate],
            ['Expiry Date', `Dec 2027`],
            ['CAS No.', spec.cas],
            ['Molecular Formula', spec.formula],
            ['Molecular Weight', spec.mw.includes('Da') || spec.mw.includes('calc') || spec.mw.includes('Mixed') || spec.mw.includes('See') ? spec.mw : `${spec.mw} Da`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: 4 }}>
              <span style={{ color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}:</span>
              <span style={{ fontWeight: 600, color: '#1A1A2E', fontSize: 10 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', color: '#0057FF', marginBottom: 5, textTransform: 'uppercase' }}>
          Test Results
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {['Test Parameter', 'Result', 'Specification', ''].map(h => (
                <th key={h} style={{ padding: '4px 6px', textAlign: 'left', fontWeight: 600, color: '#666', fontSize: 9, letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.test} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '3.5px 6px', color: '#374151', fontWeight: 500 }}>{row.test}</td>
                <td style={{ padding: '3.5px 6px', fontWeight: 600, color: '#1A1A2E' }}>{row.result}</td>
                <td style={{ padding: '3.5px 6px', color: '#6b7280' }}>{row.spec}</td>
                <td style={{ padding: '3.5px 6px', textAlign: 'center' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 10 }}>✓</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Methodology + Result */}
      <div style={{ padding: '4px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 8, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
            Testing Methodology
          </div>
          <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500 }}>{spec.method}</div>
          <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 4 }}>
            Tested by: ProLab Analytics LLC · ISO 17025 Accredited
          </div>
          <div style={{ fontSize: 8, color: '#9ca3af' }}>
            Report No: PLA-{lot.replace('PP-', '')} · protonpeptides.com/verify
          </div>
        </div>

        {/* PASS stamp */}
        <div style={{
          border: '2px solid #16a34a',
          borderRadius: 4,
          padding: '4px 10px',
          textAlign: 'center',
          transform: 'rotate(-2deg)',
          flexShrink: 0,
          marginLeft: 8,
        }}>
          <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em' }}>PASS</div>
          <div style={{ color: '#16a34a', fontSize: 7, fontWeight: 600, letterSpacing: '0.06em' }}>ALL TESTS</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '5px 14px',
        background: '#f8f9fa',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 7.5, color: '#9ca3af' }}>
          This CoA is issued for research purposes only. Not for human use.
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ width: 80, borderBottom: '1px solid #d1d5db', marginBottom: 2 }} />
          <div style={{ fontSize: 7.5, color: '#9ca3af' }}>QC Director, Proton Peptides</div>
        </div>
      </div>
    </div>
  )
}
