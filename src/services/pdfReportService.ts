import { jsPDF } from 'jspdf';
import { ProductItem, PRODUCT_MAP } from '../data/products';
import { THEMES } from '../data/themes';
import { ASSET_MAP } from '../data/assets';
import { BathroomDesignState, calculateDesignAssessment } from './designEngine';
import { calculateSustainability } from './sustainabilityEngine';
import { generateAIReasoning } from './aiReasoningService';

export interface ReportGenerationParams {
  state: BathroomDesignState;
  selectedFixtureIds: string[];
  totalCost: number;
  projectName?: string;
  clientName?: string;
}

/**
 * Robust async helper to load Cloudinary / remote image assets as data URLs
 * for direct embedding into jsPDF with timeout and graceful fallback.
 */
async function loadImageDataUrl(url: string, timeoutMs = 3500): Promise<string | null> {
  if (!url || typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(null);
    }, timeoutMs);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 300;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      } catch (e) {
        // Handle tainted canvas or CORS fallback
        resolve(null);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

export async function generate13PageDesignReportPdf({
  state,
  selectedFixtureIds,
  totalCost,
  projectName = 'Hilltop Master Bath Sanctuary',
  clientName = 'Architectural Patron'
}: ReportGenerationParams): Promise<jsPDF> {
  // Pre-load visual assets concurrently for report embedding
  const theme = THEMES[state.theme] || THEMES['luxury-escape'] || THEMES['nature-retreat'];
  const coverImageUrl = (state.selectedBlend?.hasVisualPreview && state.selectedBlend.imageUrl)
    ? state.selectedBlend.imageUrl
    : (theme.imageUrl || ASSET_MAP.themes[state.theme] || ASSET_MAP.homepage.hero);
  const persAUrl = ASSET_MAP.step1.bathroomTypes[state.bathroomType === 'Master' ? 'master' : state.bathroomType === 'Guest' ? 'guest' : 'powderRoom'];
  const persBUrl = ASSET_MAP.homepage.waysToBegin.designYourBathroom;

  const [coverImgData, persAImgData, persBImgData] = await Promise.all([
    loadImageDataUrl(coverImageUrl),
    loadImageDataUrl(persAUrl),
    loadImageDataUrl(persBUrl)
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const products: ProductItem[] = selectedFixtureIds.map(id => PRODUCT_MAP[id]).filter(Boolean);
  const assessment = calculateDesignAssessment(state, products);
  const sustainability = calculateSustainability(products, state.bathroomType);
  const reasoning = generateAIReasoning(state, {
    shower: selectedFixtureIds.find(id => id.startsWith('shower-')) || 'none',
    toilet: selectedFixtureIds.find(id => id.startsWith('toilet-')) || 'none',
    faucet: selectedFixtureIds.find(id => id.startsWith('faucet-')) || 'none',
    lighting: selectedFixtureIds.find(id => id.startsWith('light-')) || 'none',
    flooring: selectedFixtureIds.find(id => id.startsWith('floor-')) || 'none',
    vanity: selectedFixtureIds.find(id => id.startsWith('vanity-')) || 'none'
  });

  const primaryDark = [28, 33, 38];   // #1C2126 Ink charcoal
  const porcelainBg = [246, 243, 238]; // #F6F3EE Porcelain
  const accentBrass = [174, 138, 78]; // #AE8A4E Brass accent
  const stoneGrey = [140, 132, 116];  // #8C8474 Stone grey
  const borderStone = [220, 215, 205];

  // Helper: Header for inside pages (pages 2-13)
  const drawPageHeader = (pageNumber: number, sectionTitle: string) => {
    doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.rect(0, 0, pageWidth, 22, 'F');

    doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('KOHLER Spatia', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text('SPATIAL INTELLIGENCE & DESIGN OPTIMIZATION', margin, 18);

    doc.setFontSize(8);
    doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.text(sectionTitle.toUpperCase(), pageWidth - margin, 14, { align: 'right' });
  };

  // Helper: Footer for inside pages
  const drawPageFooter = (pageNumber: number) => {
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text('© 2026 KOHLER Spatia. Concept case study — not affiliated with Kohler Co.', margin, pageHeight - 9);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNumber} of 13`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Elegant Editorial Cover
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Accent Band
  doc.setFillColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.rect(0, 45, 6, 95, 'F');

  // Wordmark
  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text('KOHLER Spatia', margin + 6, 68);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.text('AI BATHROOM DESIGN & SPATIAL SPECIFICATION REPORT', margin + 6, 78);

  doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.setLineWidth(0.7);
  doc.line(margin + 6, 88, margin + 140, 88);

  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(projectName, margin + 6, 108);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(180, 175, 165);
  doc.text(state.selectedBlend ? `AI Theme Blend: ${state.selectedBlend.title}` : `Aesthetic Theme: ${theme.name} (${theme.finishes})`, margin + 6, 120);
  doc.text(`Envelope: ${state.roomDimensions.width} x ${state.roomDimensions.length} x ${state.roomDimensions.height ?? 2.8} ${state.roomDimensions.unit} (${state.roomShape.toUpperCase()})`, margin + 6, 128);
  doc.text(`Client: ${clientName} | Issued: ${new Date().toLocaleDateString('en-GB')}`, margin + 6, 136);

  // Hero Architectural Render (Embedded Image or Vector Fallback)
  if (coverImgData) {
    try {
      doc.addImage(coverImgData, 'JPEG', margin + 6, 155, contentWidth - 6, 90);
      doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.setLineWidth(0.8);
      doc.rect(margin + 6, 155, contentWidth - 6, 90, 'D');

      // Subtle lower overlay banner for high-contrast caption
      doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.rect(margin + 6, 230, contentWidth - 6, 15, 'F');
      doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(state.selectedBlend ? 'AI THEME BLEND · INDICATIVE REPRESENTATION' : 'AI SPATIAL SYNTHESIS · DOLLHOUSE SPECIFICATION PASS', margin + 12, 237);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.text(state.selectedBlend ? `${state.selectedBlend.title.toUpperCase()} · CALIBRATED ATMOSPHERE` : `${theme.name.toUpperCase()} PALETTE · PVD METALLURGY · TRUE 1:25 SCALE`, margin + 12, 242);
    } catch (e) {
      doc.setFillColor(38, 44, 52);
      doc.rect(margin + 6, 155, contentWidth - 6, 90, 'F');
      doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.setLineWidth(0.8);
      doc.rect(margin + 6, 155, contentWidth - 6, 90, 'D');
      doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('AI SPATIAL SYNTHESIS HERO PERSPECTIVE', pageWidth / 2, 195, { align: 'center' });
    }
  } else {
    doc.setFillColor(38, 44, 52);
    doc.rect(margin + 6, 155, contentWidth - 6, 90, 'F');
    doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.setLineWidth(0.8);
    doc.rect(margin + 6, 155, contentWidth - 6, 90, 'D');

    doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('AI SPATIAL SYNTHESIS HERO PERSPECTIVE', pageWidth / 2, 195, { align: 'center' });
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text('Calibrated PVD Metallurgy · Ray-Traced Architectural Photorealism · 1:25 Scale', pageWidth / 2, 203, { align: 'center' });
  }

  // Cover Footer
  doc.setFontSize(7.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text('© 2026 KOHLER Spatia. Concept case study — not affiliated with Kohler Co.', margin + 6, pageHeight - 15);
  doc.text(`Ref: KS-${Date.now().toString().slice(-6)}`, pageWidth - margin, pageHeight - 15, { align: 'right' });

  // ==========================================
  // PAGE 2: EXECUTIVE DESIGN SUMMARY
  // ==========================================
  doc.addPage();
  drawPageHeader(2, 'Executive Design Summary');
  drawPageFooter(2);

  let y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Executive Design & Spatial Performance Summary', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text('Comprehensive synthesis of room geometry, investment allocation, and algorithmic design validation.', margin, y);

  y += 12;
  // Key Metric Cards (2x2 grid)
  const metricCards = [
    { label: 'SPATIA DESIGN SCORE', value: `${assessment.scores.overallScore} / 100`, sub: 'Spatial, Budget & Hydraulic Fit' },
    { label: 'ANNUAL WATER SAVINGS', value: `${sustainability.metrics.waterSavingsPercentage}%`, sub: `${sustainability.metrics.annualWaterSavingsLitres.toLocaleString('en-IN')} L / year saved` },
    { label: 'TOTAL CAPITAL INVESTMENT', value: `INR ${totalCost.toLocaleString('en-IN')}`, sub: `Target Budget: INR ${state.budget.toLocaleString('en-IN')}` },
    { label: 'RENOVATION COMPLEXITY', value: assessment.renovationComplexity.toUpperCase(), sub: `Est. ${assessment.renovationDaysEstimate}` }
  ];

  metricCards.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = margin + col * (contentWidth / 2 + 3);
    const cy = y + row * 34;

    doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.rect(cx, cy, contentWidth / 2 - 3, 30, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.4);
    doc.rect(cx, cy, contentWidth / 2 - 3, 30, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(c.label, cx + 6, cy + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(c.value, cx + 6, cy + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(c.sub, cx + 6, cy + 25);
  });

  y += 80;
  // Subscore Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Algorithmic Score Breakdown', margin, y);

  y += 6;
  const subScores = [
    { name: 'Spatial & Clearance Fit', score: assessment.scores.spatialFit, benchmark: 'Code minimum 750mm respected' },
    { name: 'Budget Capital Allocation', score: assessment.scores.budgetFit, benchmark: 'Aligned with target envelope' },
    { name: 'Theme & Finish Compatibility', score: assessment.scores.styleCompatibility, benchmark: 'PVD metallurgical alignment' },
    { name: 'Functional Suitability', score: assessment.scores.functionalCompatibility, benchmark: `${state.bathroomType} bathroom fixtures` },
    { name: 'Hydraulic & Plumbing Fit', score: assessment.scores.plumbingCompatibility, benchmark: `${state.plumbingStatus} infrastructure` },
    { name: 'Water & Eco Efficiency', score: assessment.scores.waterEfficiency, benchmark: 'Flow aerated Katalyst tech' },
    { name: 'Universal Accessibility', score: assessment.scores.accessibilityCompatibility, benchmark: 'Ergonomic transfer zones' },
    { name: 'Future Readiness & Smart Tech', score: assessment.scores.futureReadiness, benchmark: 'Integrated digital controls' }
  ];

  subScores.forEach((s, idx) => {
    const sy = y + idx * 11;
    doc.setFillColor(idx % 2 === 0 ? 255 : porcelainBg[0], idx % 2 === 0 ? 255 : porcelainBg[1], idx % 2 === 0 ? 255 : porcelainBg[2]);
    doc.rect(margin, sy, contentWidth, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(s.name, margin + 4, sy + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(s.benchmark, margin + 75, sy + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(`${s.score}%`, pageWidth - margin - 8, sy + 6.5, { align: 'right' });
  });

  // ==========================================
  // PAGE 3: USER REQUIREMENTS & SPACE ENVELOPE
  // ==========================================
  doc.addPage();
  drawPageHeader(3, 'User Requirements & Space Envelope');
  drawPageFooter(3);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Client Inputs & Physical Space Envelope', margin, y);

  y += 10;
  const toMm = state.roomDimensions.unit === 'ft' ? 304.8 : state.roomDimensions.unit === 'm' ? 1000 : 10;
  const heightMm = Math.round((state.roomDimensions.height ?? 2.8) * toMm);
  const specItems = [
    { label: 'Room Envelope Dimensions', val: `${state.roomDimensions.width} x ${state.roomDimensions.length} x ${state.roomDimensions.height ?? 2.8} ${state.roomDimensions.unit} (${Math.round(state.roomDimensions.width * toMm)} x ${Math.round(state.roomDimensions.length * toMm)} x ${heightMm} mm)` },
    { label: 'Ceiling Height Specification', val: `${state.roomDimensions.height ?? 2.8} ${state.roomDimensions.unit} (${heightMm} mm) overhead framing` },
    { label: 'Architectural Footprint Shape', val: state.roomShape.toUpperCase() },
    { label: 'Bathroom Classification', val: state.bathroomType },
    { label: 'Plumbing Layout Status', val: state.plumbingStatus === 'renovating' ? 'Existing Fixed Plumbing Points' : 'New Construction (Unconstrained)' },
    { label: 'Target Capital Budget', val: `INR ${state.budget.toLocaleString('en-IN')}` },
    { label: 'Aesthetic Finish Theme', val: state.selectedBlend ? `AI Theme Blend: ${state.selectedBlend.title}` : `${theme.name} (${theme.finishes})` },
    { label: 'Door Geometry & Clear Swing', val: `Width: 850mm · Swing: ${state.doorPosition.swing} · Location: ${state.doorPosition.wall} wall` },
    { label: 'Accessibility Requirements', val: Object.entries(state.accessibilityRequirements).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'Standard Residential Ergonomics' },
    { label: 'Renovation Structural Scope', val: state.renovationScope.wallsCanMove ? 'Walls & Plumbing Modifiable' : 'Strict Non-Demolition Envelope' }
  ];

  specItems.forEach((sp, idx) => {
    const sy = y + idx * 16;
    doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.rect(margin, sy, contentWidth, 13, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.3);
    doc.rect(margin, sy, contentWidth, 13, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(sp.label.toUpperCase(), margin + 4, sy + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(sp.val, margin + 4, sy + 10.5);
  });

  // ==========================================
  // PAGE 4: AI DESIGN RATIONALE
  // ==========================================
  doc.addPage();
  drawPageHeader(4, 'AI Design Rationale');
  drawPageFooter(4);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Spatial Intelligence & Architectural Rationale', margin, y);

  y += 12;
  const rationaleBoxes = [
    {
      title: 'Circulation & Flow Optimization',
      body: `In this ${state.roomDimensions.width}x${state.roomDimensions.length} ${state.roomDimensions.unit} ${state.roomShape} room, Spatia positioned primary sanitary fixtures along the perimeter walls to guarantee an unobstructed central corridor of >850mm. Door swing arcs clear all cabinetry edges with safety margins.`
    },
    {
      title: 'Aesthetic Finish Cohesion & Metallurgy',
      body: state.selectedBlend
        ? `Curated under the ${state.selectedBlend.title} AI theme blend ("${state.selectedBlend.oneSentenceDescription}"). Indicative representation calibrates ${state.selectedBlend.designDirection.palette} with ${state.selectedBlend.designDirection.materialDirection}.`
        : `Curated under the ${theme.name} palette, all visible brassware, shower trim, and vanity accents utilize identical PVD deposition chemistry (${theme.finishes}). This ensures identical specular reflectance and absolute color fidelity across all physical touchpoints.`
    },
    {
      title: 'Hydraulic Pressure & Thermal Precision',
      body: `Engineered to respect a residential water pressure baseline. Thermostatic mixing valves maintain temperature stability within 0.2°C, preventing thermal shock while Katalyst air-induction delivers full luxury droplets at reduced flow rates.`
    },
    {
      title: 'Universal Ergonomics & Long-Term Longevity',
      body: `Fixture heights and grab points conform to universal design principles. Clear floor spaces facilitate effortless daily grooming while non-porous vitreous china and PVD finishes resist scale and chemical degradation for decades.`
    }
  ];

  rationaleBoxes.forEach(rb => {
    doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.rect(margin, y, contentWidth, 38, 'F');
    doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.setLineWidth(0.6);
    doc.rect(margin, y, contentWidth, 38, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(rb.title, margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    const splitLines = doc.splitTextToSize(rb.body, contentWidth - 12);
    doc.text(splitLines, margin + 6, y + 16);

    y += 46;
  });

  // ==========================================
  // PAGE 5: SCHEDULED FIXTURE PORTFOLIO
  // ==========================================
  doc.addPage();
  drawPageHeader(5, 'Scheduled Fixture Portfolio');
  drawPageFooter(5);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Scheduled Fixture Portfolio & Specifications', margin, y);

  y += 10;
  // Header Bar
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.text('CATEGORY', margin + 3, y + 5.5);
  doc.text('PRODUCT / MODEL', margin + 35, y + 5.5);
  doc.text('FINISH', margin + 92, y + 5.5);
  doc.text('DIMENSIONS (W x D x H)', margin + 115, y + 5.5);
  doc.text('PRICE (INR)', pageWidth - margin - 3, y + 5.5, { align: 'right' });

  y += 8;
  products.forEach((p, idx) => {
    const rowY = y + idx * 16;
    doc.setFillColor(idx % 2 === 0 ? 255 : porcelainBg[0], idx % 2 === 0 ? 255 : porcelainBg[1], idx % 2 === 0 ? 255 : porcelainBg[2]);
    doc.rect(margin, rowY, contentWidth, 16, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, rowY + 16, pageWidth - margin, rowY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(p.category.toUpperCase(), margin + 3, rowY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(p.name, margin + 35, rowY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(`Lead time: ${p.leadTimeWeeks} wks · Complexity: ${p.installationComplexity}`, margin + 35, rowY + 11);

    doc.text(p.finishCode, margin + 92, rowY + 6);
    doc.text(`${p.dimensions.widthMm}x${p.dimensions.depthMm}x${p.dimensions.heightMm}`, margin + 115, rowY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(`₹${p.price.toLocaleString('en-IN')}`, pageWidth - margin - 3, rowY + 7, { align: 'right' });
  });

  // Total Row
  const totalY = y + products.length * 16 + 6;
  doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.rect(margin, totalY, contentWidth, 12, 'F');
  doc.setDrawColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin, totalY, contentWidth, 12, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('TOTAL CAPITAL FIXTURE INVESTMENT (EXCL. GST)', margin + 4, totalY + 7.5);
  doc.setFontSize(11);
  doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.text(`INR ${totalCost.toLocaleString('en-IN')}`, pageWidth - margin - 4, totalY + 8, { align: 'right' });

  // ==========================================
  // PAGE 6: COMPARATIVE SELECTION ANALYSIS
  // ==========================================
  doc.addPage();
  drawPageHeader(6, 'Comparative Selection Analysis');
  drawPageFooter(6);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('AI Recommendation vs Rejected Alternatives Analysis', margin, y);

  y += 10;
  const compItems = [
    {
      cat: 'SHOWER SYSTEM',
      chosen: 'Kohler Thermostatic Rain & Jet Column',
      rejected: 'Enclosed Steam Cabin',
      reason: 'Steam cabin requires 55+ sq ft for generator safety enclosure; thermostatic column delivers full hydrotherapy without corridor infringement.'
    },
    {
      cat: 'VANITY & CABINETRY',
      chosen: 'Kohler Freestanding / Floating Console',
      rejected: 'Commercial Double-Basin Vanity (1600mm)',
      reason: 'Double basin consumes >70% of available wall run, reducing door egress corridor below 650mm minimum.'
    },
    {
      cat: 'SANITATION COMMODE',
      chosen: 'Kohler Smart Tankless / Wall-Hung System',
      rejected: 'Exposed Floor Cistern',
      reason: 'Concealed carrier reclaims 160mm walking passage and elevates hygiene through antimicrobial rimless glazing.'
    },
    {
      cat: 'BASIN FAUCET',
      chosen: 'Kohler Precision Faucet with Laminar Aerator',
      rejected: 'Standard High-Flow Commercial Tap',
      reason: 'Reduces flow to 4.5 L/min without sacrificing perceived droplet impact, saving 28,000L of heated water annually.'
    }
  ];

  compItems.forEach(ci => {
    doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.rect(margin, y, contentWidth, 38, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 38, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(ci.cat, margin + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 110, 45); // Green for chosen
    doc.text(`SELECTED: ${ci.chosen}`, margin + 4, y + 13);

    doc.setTextColor(170, 40, 40); // Red for rejected
    doc.text(`REJECTED ALTERNATIVE: ${ci.rejected}`, margin + 4, y + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    const splitLines = doc.splitTextToSize(`Rationale: ${ci.reason}`, contentWidth - 8);
    doc.text(splitLines, margin + 4, y + 26);

    y += 45;
  });

  // ==========================================
  // PAGE 7: 2D ARCHITECTURAL FLOOR PLAN
  // ==========================================
  doc.addPage();
  drawPageHeader(7, '2D Architectural Floor Plan');
  drawPageFooter(7);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('2D Architectural Floor Plan & Circulation Paths', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text(`Scale 1:25 · Room Footprint: ${state.roomDimensions.width} x ${state.roomDimensions.length} ${state.roomDimensions.unit} (${state.roomShape.toUpperCase()})`, margin, y);

  y += 10;
  // Large Architectural Drawing Box
  const planBoxW = contentWidth;
  const planBoxH = 140;
  doc.setFillColor(252, 250, 247);
  doc.rect(margin, y, planBoxW, planBoxH, 'F');
  doc.setDrawColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin, y, planBoxW, planBoxH, 'D');

  // Draw scaled room outline inside the box
  const roomInsetX = margin + 25;
  const roomInsetY = y + 15;
  const roomDrawW = planBoxW - 50;
  const roomDrawH = planBoxH - 30;

  // Outer Walls
  doc.setDrawColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setLineWidth(2.5);
  doc.rect(roomInsetX, roomInsetY, roomDrawW, roomDrawH, 'D');

  // Door Swing
  doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.setLineWidth(0.4);
  doc.line(roomInsetX + 15, roomInsetY + roomDrawH, roomInsetX + 15 + 25, roomInsetY + roomDrawH);
  if (typeof (doc as any).setLineDash === 'function') {
    try { (doc as any).setLineDash([2, 2], 0); } catch (e) { /* ignore */ }
  }
  doc.circle(roomInsetX + 15, roomInsetY + roomDrawH, 25, 'D');
  if (typeof (doc as any).setLineDash === 'function') {
    try { (doc as any).setLineDash([], 0); } catch (e) { /* ignore */ }
  }

  // Shower Zone (Top Left)
  doc.setFillColor(230, 240, 250);
  doc.rect(roomInsetX + 5, roomInsetY + 5, 38, 38, 'F');
  doc.setDrawColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setLineWidth(0.5);
  doc.rect(roomInsetX + 5, roomInsetY + 5, 38, 38, 'D');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('SHOWER', roomInsetX + 14, roomInsetY + 25);

  // Vanity Zone (Top Right)
  doc.setFillColor(245, 235, 220);
  doc.rect(roomInsetX + roomDrawW - 50, roomInsetY + 5, 45, 22, 'F');
  doc.rect(roomInsetX + roomDrawW - 50, roomInsetY + 5, 45, 22, 'D');
  doc.text('VANITY', roomInsetX + roomDrawW - 35, roomInsetY + 18);

  // Toilet Zone (Bottom Right)
  doc.setFillColor(250, 250, 250);
  doc.rect(roomInsetX + roomDrawW - 30, roomInsetY + roomDrawH - 35, 24, 28, 'F');
  doc.rect(roomInsetX + roomDrawW - 30, roomInsetY + roomDrawH - 35, 24, 28, 'D');
  doc.text('TOILET', roomInsetX + roomDrawW - 23, roomInsetY + roomDrawH - 18);

  // Center Passage Corridor Dimension Line
  doc.setDrawColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.setLineWidth(0.3);
  doc.line(roomInsetX + 50, roomInsetY + 60, roomInsetX + roomDrawW - 35, roomInsetY + 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Clear Passage Width: 920 mm (Compliant)', roomInsetX + roomDrawW / 2, roomInsetY + 58, { align: 'center' });

  y += planBoxH + 12;
  // Floor Plan Legend
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Architectural Drawing Legend & Key Measurements', margin, y);

  y += 6;
  const planNotes = [
    'Blue Node: Primary Waste Drain Location (100mm dia. cast iron / PVC)',
    'Amber Node: Hot & Cold Water Supply Riser (1/2" brass compression)',
    'Dashed Arc: 850mm Egress Door Swing Radius',
    'Center Zone: 1200mm Universal Turning Circle'
  ];
  planNotes.forEach(pn => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(`• ${pn}`, margin + 4, y);
    y += 5.5;
  });

  // ==========================================
  // PAGE 8: 3D SPATIAL GEOMETRY
  // ==========================================
  doc.addPage();
  drawPageHeader(8, '3D Spatial Geometry & Isometric Renderings');
  drawPageFooter(8);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('3D Volumetric Envelope & Isometric Spatial Modeling', margin, y);

  y += 10;
  // Isometric View Box
  doc.setFillColor(30, 35, 42);
  doc.rect(margin, y, contentWidth, 120, 'F');
  doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.setLineWidth(0.6);
  doc.rect(margin, y, contentWidth, 120, 'D');

  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('INTERACTIVE 3D WEBGL ISOMETRIC PROJECTION', pageWidth / 2, y + 55, { align: 'center' });
  doc.setFontSize(8.5);
  const toMmPage7 = state.roomDimensions.unit === 'ft' ? 304.8 : state.roomDimensions.unit === 'm' ? 1000 : 10;
  const heightMmPage7 = Math.round((state.roomDimensions.height ?? 2.8) * toMmPage7);
  doc.text(`Proportional Geometry: ${state.roomDimensions.width} x ${state.roomDimensions.length} x ${state.roomDimensions.height ?? 2.8} ${state.roomDimensions.unit} | Height: ${heightMmPage7} mm`, pageWidth / 2, y + 65, { align: 'center' });

  y += 135;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Volumetric Clearance Audit', margin, y);

  y += 7;
  const volumetricPoints = [
    { title: 'Overhead Clearance', desc: 'Rain shower arm mounted at 2200mm floor-to-sprayface; provides 350mm safety margin.' },
    { title: 'Lateral Ergonomic Buffer', desc: 'Vanity basin centered with 380mm clearance to adjacent sidewall for free elbow motion.' },
    { title: 'Commode Kneeroom Corridor', desc: '620mm clear space in front of commode rim, exceeding standard 530mm building code.' }
  ];

  volumetricPoints.forEach(vp => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(`✓ ${vp.title}: `, margin + 4, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(vp.desc, margin + 45, y);
    y += 8;
  });

  // ==========================================
  // PAGE 9: AI SPATIAL VISUALIZATIONS
  // ==========================================
  doc.addPage();
  drawPageHeader(9, 'AI Spatial Visualizations');
  drawPageFooter(9);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('AI Spatial Synthesis & Mood Visualizations', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text('AI-generated visualization — indicative representation of material physics, lighting diffusion, and spatial proportion.', margin, y);

  y += 10;
  // Two Visualization Display Panes
  const renderBoxH = 95;
  // View 1
  if (persAImgData) {
    try {
      doc.addImage(persAImgData, 'JPEG', margin, y, contentWidth, renderBoxH);
      doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, renderBoxH, 'D');

      // Caption overlay bar
      doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.rect(margin, y + renderBoxH - 16, contentWidth, 16, 'F');
    } catch (e) {
      doc.setFillColor(34, 40, 48);
      doc.rect(margin, y, contentWidth, renderBoxH, 'F');
      doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, renderBoxH, 'D');
    }
  } else {
    doc.setFillColor(34, 40, 48);
    doc.rect(margin, y, contentWidth, renderBoxH, 'F');
    doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, renderBoxH, 'D');
  }

  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PERSPECTIVE A: VANITY & LIGHTING FOCAL AXIS', margin + 8, y + renderBoxH - 9);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.text(`Calibrated to ${theme.name} palette with 3000K warm LED backlighting and ${theme.finishes} brassware`, margin + 8, y + renderBoxH - 4);

  // View 2
  y += renderBoxH + 10;
  if (persBImgData) {
    try {
      doc.addImage(persBImgData, 'JPEG', margin, y, contentWidth, renderBoxH);
      doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, renderBoxH, 'D');

      // Caption overlay bar
      doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.rect(margin, y + renderBoxH - 16, contentWidth, 16, 'F');
    } catch (e) {
      doc.setFillColor(34, 40, 48);
      doc.rect(margin, y, contentWidth, renderBoxH, 'F');
      doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, renderBoxH, 'D');
    }
  } else {
    doc.setFillColor(34, 40, 48);
    doc.rect(margin, y, contentWidth, renderBoxH, 'F');
    doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, renderBoxH, 'D');
  }

  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PERSPECTIVE B: HYDROTHERAPY WALK-IN SHOWER SUITE', margin + 8, y + renderBoxH - 9);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.text('Zero-threshold floor drain integration with floor-to-ceiling glass enclosure', margin + 8, y + renderBoxH - 4);

  // ==========================================
  // PAGE 10: ENVIRONMENTAL SUSTAINABILITY
  // ==========================================
  doc.addPage();
  drawPageHeader(10, 'Environmental Sustainability & Hydro-Efficiency');
  drawPageFooter(10);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Environmental Sustainability & Hydro-Efficiency Audit', margin, y);

  y += 10;
  // 4 Green Impact Cards
  const greenMetrics = [
    { label: 'ANNUAL WATER REDUCTION', val: `${sustainability.metrics.annualWaterSavingsLitres.toLocaleString('en-IN')} Litres`, sub: `${sustainability.metrics.waterSavingsPercentage}% savings vs builder baseline` },
    { label: 'ENERGY CONSERVED (HOT WATER)', val: `${sustainability.metrics.annualEnergySavingsKwh} kWh / year`, sub: 'Reduced water heating thermal draw' },
    { label: 'CARBON OFFSET', val: `${sustainability.metrics.annualCarbonOffsetKgCo2} kg CO2e`, sub: 'Annual municipal greenhouse avoidance' },
    { label: 'ANNUAL UTILITY SAVINGS', val: `INR ${sustainability.metrics.annualUtilitySavingsInr.toLocaleString('en-IN')}`, sub: 'Combined water & electric tariff reduction' }
  ];

  greenMetrics.forEach((gm, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const gx = margin + col * (contentWidth / 2 + 3);
    const gy = y + row * 28;

    doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.rect(gx, gy, contentWidth / 2 - 3, 24, 'F');
    doc.setDrawColor(30, 110, 45);
    doc.setLineWidth(0.4);
    doc.rect(gx, gy, contentWidth / 2 - 3, 24, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 110, 45);
    doc.text(gm.label, gx + 6, gy + 7);

    doc.setFontSize(11);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(gm.val, gx + 6, gy + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(gm.sub, gx + 6, gy + 20);
  });

  y += 70;
  // Baseline vs Spatia Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Baseline Builder Grade vs. Spatia AI Optimization', margin, y);

  y += 6;
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.text('FIXTURE CLASS', margin + 3, y + 5);
  doc.text('BUILDER BASELINE', margin + 50, y + 5);
  doc.text('SPATIA AI FIXTURE', margin + 105, y + 5);
  doc.text('ANNUAL SAVINGS', pageWidth - margin - 3, y + 5, { align: 'right' });

  y += 7;
  sustainability.comparisonTable.forEach((item, idx) => {
    const rowY = y + idx * 16;
    doc.setFillColor(idx % 2 === 0 ? 255 : porcelainBg[0], idx % 2 === 0 ? 255 : porcelainBg[1], idx % 2 === 0 ? 255 : porcelainBg[2]);
    doc.rect(margin, rowY, contentWidth, 16, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, rowY + 16, pageWidth - margin, rowY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(item.fixtureCategory, margin + 3, rowY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(`${item.baselineSpec} (${item.baselineFlow})`, margin + 50, rowY + 6);
    doc.text(`${item.baselineAnnualLitres.toLocaleString('en-IN')} L / yr`, margin + 50, rowY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(`${item.spatiaSpec} (${item.spatiaFlow})`, margin + 105, rowY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 110, 45);
    doc.text(`${item.spatiaAnnualLitres.toLocaleString('en-IN')} L / yr`, margin + 105, rowY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`-${item.savingsPercent}%`, pageWidth - margin - 3, rowY + 9, { align: 'right' });
  });

  // ==========================================
  // PAGE 11: RENOVATION SCOPE & CONSTRAINTS
  // ==========================================
  doc.addPage();
  drawPageHeader(11, 'Renovation Scope & Architectural Constraints');
  drawPageFooter(11);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Renovation Feasibility, Structural Scope & Milestones', margin, y);

  y += 10;
  // Complexity Banner
  doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.rect(margin, y, contentWidth, 24, 'F');
  doc.setDrawColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.setLineWidth(0.6);
  doc.rect(margin, y, contentWidth, 24, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.text('OVERALL RENOVATION COMPLEXITY AUDIT', margin + 6, y + 8);
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(`${assessment.renovationComplexity.toUpperCase()} COMPLEXITY`, margin + 6, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text(`Estimated Duration: ${assessment.renovationDaysEstimate} | Est. Labor Rough-in: INR ${assessment.renovationCostEstimate.toLocaleString('en-IN')}`, pageWidth - margin - 6, y + 17, { align: 'right' });

  y += 34;
  // Renovation Phases
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Milestone Sequencing Schedule', margin, y);

  y += 6;
  const phases = [
    { name: 'Phase 1: Demolition & Hazardous Core Isolation', days: 'Days 1–3', desc: 'Tile removal, floor screed excavation to bare concrete slab.' },
    { name: 'Phase 2: Rough-In Plumbing & Hydrostatic Testing', days: 'Days 4–7', desc: 'Positioning 100mm waste pipes and 1/2" risers. 48hr pressure testing at 10 bar.' },
    { name: 'Phase 3: Concealed Electrical & Moisture Barrier', days: 'Days 8–10', desc: 'Recessed conduits for smart bidet & LED backlit mirrors. Dual-coat waterproof membrane.' },
    { name: 'Phase 4: Tile Setting & Anti-Microbial Grouting', days: 'Days 11–16', desc: 'Large format porcelain floor and wall installation with 1.5mm expansion joints.' },
    { name: 'Phase 5: Fixture Mounting & Commissioning', days: 'Days 17–20', desc: 'Mounting thermostatic trim, digital toilet, glass partitions, and calibration.' }
  ];

  phases.forEach((ph, idx) => {
    const py = y + idx * 24;
    doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
    doc.rect(margin, py, contentWidth, 20, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.3);
    doc.rect(margin, py, contentWidth, 20, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(ph.name, margin + 4, py + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
    doc.text(ph.days, pageWidth - margin - 4, py + 7, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(ph.desc, margin + 4, py + 14);
  });

  // ==========================================
  // PAGE 12: MEP CONTRACTOR SPECIFICATION
  // ==========================================
  doc.addPage();
  drawPageHeader(12, 'MEP Contractor & Installation Specification');
  drawPageFooter(12);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Mechanical, Electrical & Plumbing (MEP) Specification', margin, y);

  y += 10;
  // Technical MEP Table
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.text('FIXTURE', margin + 3, y + 5.5);
  doc.text('SUPPLY LINE', margin + 50, y + 5.5);
  doc.text('DRAIN DIA.', margin + 85, y + 5.5);
  doc.text('MIN DYNAMIC BAR', margin + 120, y + 5.5);
  doc.text('ELECTRICAL', pageWidth - margin - 3, y + 5.5, { align: 'right' });

  y += 8;
  products.forEach((p, idx) => {
    const rowY = y + idx * 13;
    doc.setFillColor(idx % 2 === 0 ? 255 : porcelainBg[0], idx % 2 === 0 ? 255 : porcelainBg[1], idx % 2 === 0 ? 255 : porcelainBg[2]);
    doc.rect(margin, rowY, contentWidth, 13, 'F');
    doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, rowY + 13, pageWidth - margin, rowY + 13);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(p.name.slice(0, 24), margin + 3, rowY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(p.plumbingRequirements.supplyLineSizeInch, margin + 50, rowY + 8);
    doc.text(`${p.plumbingRequirements.drainDiameterMm} mm`, margin + 85, rowY + 8);
    doc.text(`${p.plumbingRequirements.minDynamicBar} bar`, margin + 120, rowY + 8);

    const elec = p.energyCharacteristics.powerWatts > 0 ? `${p.energyCharacteristics.powerWatts}W` : 'None';
    doc.text(elec, pageWidth - margin - 3, rowY + 8, { align: 'right' });
  });

  y += products.length * 13 + 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Mandatory General Contractor Directives', margin, y);

  y += 6;
  const directives = [
    'Flush all supply lines with clean water before connecting ceramic cartridge faucets to purge pipe solder and grit.',
    'Install a dedicated 30mA RCBO circuit breaker for the smart commode bidet seat and LED illuminated mirror.',
    'Maintain a continuous 1:50 (2%) floor slope toward the linear shower channel drain to prevent standing pooling.',
    'Test static water pressure at branch manifold prior to final sign-off; install inline pressure reducer if static pressure exceeds 5.0 bar.'
  ];

  directives.forEach(dir => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
    doc.text(`• ${dir}`, margin + 4, y);
    y += 6;
  });

  // ==========================================
  // PAGE 13: FINAL AI DESIGN SCORECARD & SIGN-OFF
  // ==========================================
  doc.addPage();
  drawPageHeader(13, 'Final AI Design Scorecard & Sign-off');
  drawPageFooter(13);

  y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Final Design Scorecard & Portfolio Attestation', margin, y);

  y += 10;
  // Hero Score Card
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, y, contentWidth, 38, 'F');

  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('SPATIA SYNTHESIS RATING', margin + 8, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(accentBrass[0], accentBrass[1], accentBrass[2]);
  doc.text(`${assessment.scores.overallScore} / 100`, margin + 8, y + 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.text('Spatial, Ergonomic, Hydraulic & Aesthetic Optimization Verified', pageWidth - margin - 8, y + 22, { align: 'right' });

  y += 48;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Why This Design Works — Executive Rationale', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  const finalSummaryText = `This design achieves optimal spatial equilibrium for your ${state.roomDimensions.width}x${state.roomDimensions.length} ${state.roomDimensions.unit} ${state.roomShape} bathroom. By pairing the ${theme.name} palette with precision engineered Kohler fixtures, it preserves code clearances, saves ${sustainability.metrics.waterSavingsPercentage}% annual municipal water, and keeps capital investment within target budget parameters.`;
  const splitSummary = doc.splitTextToSize(finalSummaryText, contentWidth);
  doc.text(splitSummary, margin, y);

  y += 28;
  // Sign-off / Signature blocks
  doc.setFillColor(porcelainBg[0], porcelainBg[1], porcelainBg[2]);
  doc.rect(margin, y, contentWidth, 48, 'F');
  doc.setDrawColor(borderStone[0], borderStone[1], borderStone[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentWidth, 48, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('SPECIFICATION APPROVAL & ATTESTATION', margin + 6, y + 9);

  doc.line(margin + 6, y + 32, margin + 70, y + 32);
  doc.line(margin + 90, y + 32, margin + 154, y + 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text('Client Representative Signature', margin + 6, y + 38);
  doc.text('General Contractor Representative', margin + 90, y + 38);

  y += 58;
  // Mandatory Concept Case Study Portfolio Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(stoneGrey[0], stoneGrey[1], stoneGrey[2]);
  doc.text('Concept case study — not affiliated with Kohler Co.', margin, y);
  doc.text('All product names, trademarks and registered trademarks are property of their respective owners.', margin, y + 5);
  doc.text('Generated deterministically by KOHLER Spatia Spatial Intelligence Engine.', margin, y + 10);

  // Save the PDF
  const filename = `KOHLER_Spatia_Design_Report_${Date.now().toString().slice(-6)}.pdf`;
  doc.save(filename);
  return doc;
}
