import { jsPDF } from 'jspdf';
import { ProductItem, PRODUCT_MAP } from '../data/products';
import { THEMES } from '../data/themes';

interface BriefParams {
  projectName: string;
  themeId: string;
  roomShape: string;
  dimensions: { width: number; length: number; unit: string };
  plumbingLayout: string;
  selectedFixtureIds: string[];
  totalCost: number;
}

export const generateContractorBriefPdf = ({
  projectName,
  themeId,
  roomShape,
  dimensions,
  plumbingLayout,
  selectedFixtureIds,
  totalCost
}: BriefParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const theme = THEMES[themeId];
  const products = selectedFixtureIds.map(id => PRODUCT_MAP[id]).filter(Boolean);

  // Background Header
  doc.setFillColor(28, 33, 38); // Ink charcoal
  doc.rect(0, 0, 210, 38, 'F');

  // Brand Wordmark
  doc.setTextColor(246, 243, 238); // Porcelain
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('KOHLER Spatia', 20, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(174, 138, 78); // Brass accent
  doc.text('TECHNICAL CONTRACTOR SPECIFICATION BRIEF & PLUMBING SCHEMATIC', 20, 26);

  doc.setFontSize(8);
  doc.setTextColor(140, 132, 116);
  doc.text(`Doc Ref: KS-${Date.now().toString().slice(-6)} | Issued: ${new Date().toLocaleDateString('en-GB')}`, 20, 32);

  // Project Info Block
  doc.setTextColor(28, 33, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. ARCHITECTURAL & PLUMBING SCOPE', 20, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Project Title: ${projectName}`, 20, 56);
  doc.text(`Aesthetic Finish Protocol: ${theme.name} (${theme.finishes})`, 20, 62);
  doc.text(`Envelope Geometry: ${dimensions.width} x ${dimensions.length} ${dimensions.unit} (${roomShape.toUpperCase()})`, 20, 68);
  doc.text(`Hydraulic Layout: ${plumbingLayout === 'renovating' ? 'Existing Fixed Plumbing Points' : 'New Construction (Unconstrained)'}`, 20, 74);
  doc.text(`Total Fixture Capital Investment: INR ${totalCost.toLocaleString('en-IN')}`, 20, 80);

  // Horizontal divider
  doc.setDrawColor(200, 195, 185);
  doc.setLineWidth(0.5);
  doc.line(20, 86, 190, 86);

  // Fixture Schedule Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. TECHNICAL FIXTURE SCHEDULE', 20, 96);

  // Table Headers
  doc.setFillColor(239, 236, 230);
  doc.rect(20, 101, 170, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text('CAT', 22, 105.5);
  doc.text('MODEL / SPECIFICATION', 42, 105.5);
  doc.text('FINISH CODE', 112, 105.5);
  doc.text('DIMENSIONS (W x D x H)', 142, 105.5);

  let y = 114;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  products.forEach((p, idx) => {
    if (y > 255) {
      doc.addPage();
      y = 25;
    }

    const dims = `${p.dimensions.widthMm} x ${p.dimensions.depthMm} x ${p.dimensions.heightMm} mm`;
    doc.setTextColor(28, 33, 38);
    doc.text(p.category.toUpperCase().slice(0, 8), 22, y);
    doc.text(p.name, 42, y);
    doc.text(p.finishCode, 112, y);
    doc.text(dims, 142, y);

    y += 4;
    doc.setFontSize(7);
    doc.setTextColor(120, 115, 105);
    const techNotes = p.waterConsumption?.flowRateLpm 
      ? `Flow: ${p.waterConsumption.flowRateLpm} L/min | Lead time: ${p.leadTimeWeeks} wks` 
      : (p.energyCharacteristics?.powerWatts ? `Power: ${p.energyCharacteristics.powerWatts}W | Lead time: ${p.leadTimeWeeks} wks` : `Lead time: ${p.leadTimeWeeks} wks`);
    doc.text(techNotes, 42, y);

    y += 6;
    doc.setFontSize(8);
    doc.setDrawColor(230, 226, 220);
    doc.line(20, y - 2, 190, y - 2);
  });

  // Installation Protocols
  y += 6;
  if (y > 240) {
    doc.addPage();
    y = 25;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 33, 38);
  doc.text('3. CONTRACTOR INSTALLATION PROTOCOLS', 20, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  const protocols = [
    "• Hydrostatic Pressure: Rough-in lines must be pressure tested to 5.0 bar for 4 hours prior to tile boarding.",
    "• PVD Finish Care: Chemical solvents or acid-based mortar removers must never contact French Gold, Brushed Bronze or Titanium surfaces.",
    "• In-Wall Carriers: Minimum wall stud cavity depth of 140mm required for concealed commode frame and flush actuator box.",
    "• Electrical Wet Zones: All cove channels and steam generators require dedicated RCBO protection (30mA trip threshold)."
  ];
  protocols.forEach(line => {
    doc.text(line, 20, y);
    y += 5.5;
  });

  // Mandatory Portfolio Line in Footer
  doc.setFillColor(246, 243, 238);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 132, 116);
  doc.text('© 2026 KOHLER Spatia. Concept case study — not affiliated with Kohler Co.', 20, 289);
  doc.text('Generated via Spatia Spatial Intelligence Engine', 140, 289);

  doc.save(`${projectName.toLowerCase().replace(/\s+/g, '_')}_contractor_brief.pdf`);
};
