import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { PRODUCT_MAP } from '../../data/products';

export const FloorPlan2D: React.FC = () => {
  const { 
    roomShape, 
    width, 
    length, 
    unit, 
    selections,
    selectedLayout
  } = useConfigurator();

  const [activeFixtureTooltip, setActiveFixtureTooltip] = useState<string | null>(null);

  const svgWidth = 720;
  const svgHeight = 520;

  // Convert dimensions to millimeters
  const toMm = (val: number, u: string) => {
    if (u === 'ft') return val * 304.8;
    if (u === 'm') return val * 1000;
    return val * 10; // 'cm'
  };

  const roomWidthMm = Math.max(1400, toMm(width, unit));
  const roomLengthMm = Math.max(1400, toMm(length, unit));

  // Canvas bounds & scaling
  const margin = { left: 75, top: 65, right: 45, bottom: 65 };
  const availW = svgWidth - margin.left - margin.right;
  const availH = svgHeight - margin.top - margin.bottom;

  const scale = Math.min(availW / roomWidthMm, availH / roomLengthMm);
  const roomPixW = Math.round(roomWidthMm * scale);
  const roomPixH = Math.round(roomLengthMm * scale);

  const originX = margin.left + Math.round((availW - roomPixW) / 2);
  const originY = margin.top + Math.round((availH - roomPixH) / 2);

  // Fixtures from PRODUCT_MAP
  const showerItem = PRODUCT_MAP[selections.shower];
  const vanityItem = PRODUCT_MAP[selections.vanity];
  const toiletItem = PRODUCT_MAP[selections.toilet];

  const showerWidthMm = showerItem?.dimensions.widthMm || 1000;
  const showerDepthMm = showerItem?.dimensions.depthMm || 1000;
  const vanityWidthMm = vanityItem?.dimensions.widthMm || 900;
  const vanityDepthMm = vanityItem?.dimensions.depthMm || 520;
  const toiletWidthMm = toiletItem?.dimensions.widthMm || 400;
  const toiletDepthMm = toiletItem?.dimensions.depthMm || 650;

  const showerW = Math.max(30, Math.round(showerWidthMm * scale));
  const showerD = Math.max(30, Math.round(showerDepthMm * scale));
  const vanityW = Math.max(25, Math.round(vanityWidthMm * scale));
  const vanityD = Math.max(20, Math.round(vanityDepthMm * scale));
  const toiletW = Math.max(16, Math.round(toiletWidthMm * scale));
  const toiletD = Math.max(20, Math.round(toiletDepthMm * scale));

  // Door swing dimensions
  const doorWidthMm = 850;
  const doorPixW = Math.round(doorWidthMm * scale);
  const doorX = originX + Math.min(30, roomPixW * 0.1);
  const doorY = originY + roomPixH;

  // Derive fixture positions based on selectedLayout
  let showerX = originX + 5;
  let showerY = originY + 5;

  let vanityX = originX + showerW + 15;
  let vanityY = originY + 5;
  let vanityBoxW = vanityW;
  let vanityBoxH = vanityD;

  let toiletX = originX + showerW + vanityW + 30;
  let toiletY = originY + 5;
  let toiletBoxW = toiletW;
  let toiletBoxH = toiletD;
  let isToiletRotated = false;

  if (selectedLayout === 'l-shaped') {
    // Shower in top-left corner
    showerX = originX + 5;
    showerY = originY + 5;

    // Vanity on top wall right side
    vanityX = originX + roomPixW - vanityW - 15;
    vanityY = originY + 5;
    vanityBoxW = vanityW;
    vanityBoxH = vanityD;

    // Toilet on perpendicular right wall
    toiletX = originX + roomPixW - toiletD - 5;
    toiletY = originY + vanityD + 25;
    toiletBoxW = toiletD;
    toiletBoxH = toiletW;
    isToiletRotated = true;
  } else if (selectedLayout === 'parallel') {
    // Vanity along top wall left side
    vanityX = originX + 15;
    vanityY = originY + 5;
    vanityBoxW = vanityW;
    vanityBoxH = vanityD;

    // Shower along top wall right side
    showerX = originX + roomPixW - showerW - 5;
    showerY = originY + 5;

    // Toilet along bottom wall opposing vanity (clear of door swing)
    toiletX = originX + roomPixW - toiletW - 35;
    toiletY = originY + roomPixH - toiletD - 5;
    toiletBoxW = toiletW;
    toiletBoxH = toiletD;
    isToiletRotated = false;
  } else {
    // Linear Wet Wall layout: fixtures sequenced along top wall
    showerX = originX + 5;
    showerY = originY + 5;

    const remainingWallW = roomPixW - showerW - 25;
    vanityBoxW = Math.min(vanityW, remainingWallW * 0.6);
    toiletX = originX + showerW + 15;
    toiletY = originY + 5;

    vanityX = originX + showerW + toiletW + 30;
    vanityY = originY + 5;
  }

  // Room polygon paths
  const getFloorPoints = () => {
    switch (roomShape) {
      case 'l-shaped': {
        const cutX = originX + Math.round(roomPixW * 0.6);
        const cutY = originY + Math.round(roomPixH * 0.55);
        return `${originX},${originY} ${originX + roomPixW},${originY} ${originX + roomPixW},${cutY} ${cutX},${cutY} ${cutX},${originY + roomPixH} ${originX},${originY + roomPixH}`;
      }
      case 'alcove': {
        const a1 = originX + Math.round(roomPixW * 0.35);
        const a2 = originX + Math.round(roomPixW * 0.65);
        const alcoveDepth = Math.round(roomPixH * 0.2);
        return `${originX},${originY} ${originX + roomPixW},${originY} ${originX + roomPixW},${originY + roomPixH} ${a2},${originY + roomPixH} ${a2},${originY + roomPixH - alcoveDepth} ${a1},${originY + roomPixH - alcoveDepth} ${a1},${originY + roomPixH} ${originX},${originY + roomPixH}`;
      }
      case 'angled': {
        const chamfer = Math.round(roomPixH * 0.3);
        return `${originX},${originY} ${originX + roomPixW},${originY} ${originX + roomPixW},${originY + roomPixH - chamfer} ${originX + roomPixW - chamfer},${originY + roomPixH} ${originX},${originY + roomPixH}`;
      }
      case 'rectangular':
      default:
        return `${originX},${originY} ${originX + roomPixW},${originY} ${originX + roomPixW},${originY + roomPixH} ${originX},${originY + roomPixH}`;
    }
  };

  return (
    <div className="bg-white border border-stone/20 rounded-sm p-6 space-y-4 shadow-editorial">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone/15 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-ink">2D Architectural Floor Plan</h3>
            <span className="text-[10px] font-mono uppercase bg-porcelain-warm px-2 py-0.5 rounded border border-stone/20 text-accent font-bold">
              Dynamic Scale 1:{(1 / scale).toFixed(0)}
            </span>
          </div>
          <p className="text-xs text-stone-dark mt-0.5">
            True-to-scale layout for {width}×{length} {unit} ({Math.round(roomWidthMm)}×{Math.round(roomLengthMm)} mm) · {selectedLayout.toUpperCase()} configuration.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-stone-dark">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Drain Point</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Hot/Cold Riser</span>
          </span>
        </div>
      </div>

      <div className="w-full aspect-[4/3] bg-porcelain-warm/30 rounded-sm border border-stone/15 relative overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full select-none">
          <defs>
            <pattern id="floorGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25,0 L 0,0 0,25" fill="none" stroke="#E5E1D8" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Floor Polygon with grid */}
          <polygon points={getFloorPoints()} fill="#FAF8F5" />
          <polygon points={getFloorPoints()} fill="url(#floorGrid)" opacity="0.6" />

          {/* Architectural Wall Outlines */}
          <polygon points={getFloorPoints()} fill="none" stroke="#1C2126" strokeWidth="6" strokeLinejoin="miter" />
          <polygon points={getFloorPoints()} fill="none" stroke="#8C8474" strokeWidth="1.5" strokeLinejoin="miter" />

          {/* Door Opening & Swing Arc */}
          <g transform={`translate(${doorX}, ${doorY})`}>
            {/* Break wall line */}
            <line x1="0" y1="0" x2={doorPixW} y2="0" stroke="#FAF8F5" strokeWidth="8" />
            {/* Door swing arc */}
            <path
              d={`M ${doorPixW},0 A ${doorPixW} ${doorPixW} 0 0 0 0,${-doorPixW}`}
              fill="none"
              stroke="#8C8474"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Door leaf */}
            <line x1="0" y1="0" x2="0" y2={-doorPixW} stroke="#1C2126" strokeWidth="3" />
            <text x={doorPixW / 2} y="-12" fill="#8C8474" fontSize="8" fontFamily="monospace" textAnchor="middle">
              Door {doorWidthMm}mm
            </text>
          </g>

          {/* Architectural Window Opening on Back Wall (Single source of truth with 3D scene) */}
          {(() => {
            const winWidthMm = 900;
            const winPixW = Math.min(roomPixW * 0.35, Math.round(winWidthMm * scale));
            const winX = originX + Math.round(roomPixW * 0.58);
            const winY = originY;

            return (
              <g>
                {/* Break top wall line */}
                <line x1={winX} y1={winY} x2={winX + winPixW} y2={winY} stroke="#FAF8F5" strokeWidth="8" />
                {/* Outer frame & sill lines */}
                <line x1={winX - 3} y1={winY - 3} x2={winX + winPixW + 3} y2={winY - 3} stroke="#1C2126" strokeWidth="1.5" />
                <line x1={winX - 3} y1={winY + 3} x2={winX + winPixW + 3} y2={winY + 3} stroke="#8C8474" strokeWidth="1.2" />
                {/* Double glass panes */}
                <line x1={winX} y1={winY - 1} x2={winX + winPixW} y2={winY - 1} stroke="#60A5FA" strokeWidth="1" />
                <line x1={winX} y1={winY + 1} x2={winX + winPixW} y2={winY + 1} stroke="#60A5FA" strokeWidth="1" />
                {/* Label */}
                <text x={winX + winPixW / 2} y={winY - 8} fill="#8C8474" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Window {winWidthMm}mm
                </text>
              </g>
            );
          })()}

          {/* Wheelchair 60" turning circle for Parallel / Universal layout */}
          {selectedLayout === 'parallel' && (
            <g opacity="0.6">
              <circle
                cx={originX + roomPixW / 2}
                cy={originY + roomPixH / 2}
                r={Math.min(roomPixW, roomPixH) * 0.28}
                fill="rgba(130, 89, 22, 0.08)"
                stroke="#825916"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={originX + roomPixW / 2}
                y={originY + roomPixH / 2 + 4}
                fill="#825916"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                Ø 1524mm (60") Turning Circle
              </text>
            </g>
          )}

          {/* 1. SHOWER ZONE (Omitted if 'none') */}
          {selections.shower !== 'none' && showerItem && (
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveFixtureTooltip(showerItem.name || 'Shower')}
            >
              <rect 
                x={showerX} 
                y={showerY} 
                width={showerW} 
                height={showerD} 
                fill="#EBF3FA" 
                stroke="#60A5FA" 
                strokeWidth="1.5" 
              />
              {/* Cross drainage slopes */}
              <line x1={showerX} y1={showerY} x2={showerX + showerW / 2} y2={showerY + showerD / 2} stroke="#BFDBFE" strokeWidth="1" />
              <line x1={showerX + showerW} y1={showerY} x2={showerX + showerW / 2} y2={showerY + showerD / 2} stroke="#BFDBFE" strokeWidth="1" />
              <line x1={showerX} y1={showerY + showerD} x2={showerX + showerW / 2} y2={showerY + showerD / 2} stroke="#BFDBFE" strokeWidth="1" />
              <line x1={showerX + showerW} y1={showerY + showerD} x2={showerX + showerW / 2} y2={showerY + showerD / 2} stroke="#BFDBFE" strokeWidth="1" />
              {/* Drain node */}
              <circle cx={showerX + showerW / 2} cy={showerY + showerD / 2} r="6" fill="#3B82F6" />
              <circle cx={showerX + showerW / 2} cy={showerY + showerD / 2} r="2" fill="#FFFFFF" />
              {/* Glass divider panel line (matches single glass partition) */}
              <line x1={showerX + showerW} y1={showerY} x2={showerX + showerW} y2={showerY + showerD} stroke="#0284C7" strokeWidth="3" />
              
              <text x={showerX + showerW / 2} y={showerY + Math.min(24, showerD * 0.3)} fill="#1E3A8A" fontSize="10.5" fontFamily="serif" fontWeight="bold" textAnchor="middle">
                {showerItem.name || 'Shower'}
              </text>
              <text x={showerX + showerW / 2} y={showerY + Math.min(38, showerD * 0.48)} fill="#1C1714" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {showerWidthMm}×{showerDepthMm}mm
              </text>
            </g>
          )}

          {/* 2. VANITY & BASIN (Omitted if 'none') */}
          {selections.vanity !== 'none' && vanityItem && (
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveFixtureTooltip(vanityItem.name || 'Vanity')}
            >
              <rect 
                x={vanityX} 
                y={vanityY} 
                width={vanityBoxW} 
                height={vanityBoxH} 
                rx="2" 
                fill="#F4EDE4" 
                stroke="#825916" 
                strokeWidth="1.5" 
              />
              {/* Oval Basin */}
              <ellipse 
                cx={vanityX + vanityBoxW / 2} 
                cy={vanityY + vanityBoxH / 2} 
                rx={Math.max(12, vanityBoxW * 0.28)} 
                ry={Math.max(8, vanityBoxH * 0.3)} 
                fill="#FFFFFF" 
                stroke="#4A423B" 
                strokeWidth="1.2" 
              />
              {/* Faucet Point */}
              {selections.faucet !== 'none' && (
                <>
                  <circle cx={vanityX + vanityBoxW / 2} cy={vanityY + 6} r="3.5" fill="#825916" />
                  <circle cx={vanityX + vanityBoxW / 2} cy={vanityY + 11} r="2.5" fill="#9C6E21" />
                </>
              )}
              
              <text x={vanityX + vanityBoxW / 2} y={vanityY + vanityBoxH + 13} fill="#1C1714" fontSize="10.5" fontFamily="serif" fontWeight="bold" textAnchor="middle">
                {vanityItem.name || 'Vanity'}
              </text>
              <text x={vanityX + vanityBoxW / 2} y={vanityY + vanityBoxH + 25} fill="#2E2722" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {vanityWidthMm}×{vanityDepthMm}mm
              </text>
            </g>
          )}

          {/* 3. TOILET COMMODE (Omitted if 'none') */}
          {selections.toilet !== 'none' && toiletItem && (
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveFixtureTooltip(toiletItem.name || 'Commode')}
            >
              {isToiletRotated ? (
                // Side wall rotated commode
                <g>
                  <rect x={toiletX + toiletBoxW - 14} y={toiletY} width="14" height={toiletBoxH} fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx={toiletX + toiletBoxW * 0.4} cy={toiletY + toiletBoxH / 2} rx={toiletBoxW * 0.35} ry={toiletBoxH * 0.38} fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
                  <circle cx={toiletX + toiletBoxW - 6} cy={toiletY + toiletBoxH / 2} r="3" fill="#3B82F6" />
                </g>
              ) : (
                // Standard wall commode
                <g>
                  <rect x={toiletX} y={toiletY} width={toiletBoxW} height={Math.min(14, toiletBoxH * 0.3)} fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx={toiletX + toiletBoxW / 2} cy={toiletY + toiletBoxH * 0.6} rx={toiletBoxW * 0.42} ry={toiletBoxH * 0.38} fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
                  <circle cx={toiletX + toiletBoxW / 2} cy={toiletY + 7} r="3" fill="#3B82F6" />
                </g>
              )}

              <text x={toiletX + toiletBoxW / 2} y={toiletY + toiletBoxH + 13} fill="#1C1714" fontSize="10.5" fontFamily="serif" fontWeight="bold" textAnchor="middle">
                {toiletItem.name || 'Commode'}
              </text>
              <text x={toiletX + toiletBoxW / 2} y={toiletY + toiletBoxH + 25} fill="#2E2722" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {toiletWidthMm}×{toiletDepthMm}mm
              </text>
            </g>
          )}

          {/* Passage Corridor Guide Marker */}
          <path 
            d={`M ${doorX + 30},${doorY - 30} Q ${originX + roomPixW * 0.5},${originY + roomPixH * 0.55} ${originX + roomPixW * 0.5},${originY + Math.max(showerD, vanityD) + 30}`} 
            fill="none" 
            stroke="#825916" 
            strokeWidth="1.5" 
            strokeDasharray="5 4" 
            opacity="0.8" 
          />
          <text 
            x={originX + roomPixW * 0.5} 
            y={originY + roomPixH * 0.65} 
            fill="#825916" 
            fontSize="10" 
            fontFamily="monospace" 
            fontWeight="bold"
            textAnchor="middle"
          >
            Clear Circulation Corridor ({selectedLayout === 'parallel' ? '1250mm' : selectedLayout === 'linear' ? '950mm' : '880mm'})
          </text>

          {/* Dimension Extension Lines - Room Width (Top) */}
          <line x1={originX} y1={margin.top - 25} x2={originX + roomPixW} y2={margin.top - 25} stroke="#1C1714" strokeWidth="2" />
          <line x1={originX} y1={margin.top - 34} x2={originX} y2={margin.top - 16} stroke="#1C1714" strokeWidth="2" />
          <line x1={originX + roomPixW} y1={margin.top - 34} x2={originX + roomPixW} y2={margin.top - 16} stroke="#1C1714" strokeWidth="2" />
          <text x={originX + roomPixW / 2} y={margin.top - 29} fill="#1C1714" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            Width: {width} {unit} ({Math.round(roomWidthMm)} mm)
          </text>

          {/* Dimension Extension Lines - Room Length (Left) */}
          <line x1={margin.left - 25} y1={originY} x2={margin.left - 25} y2={originY + roomPixH} stroke="#1C1714" strokeWidth="2" />
          <line x1={margin.left - 34} y1={originY} x2={margin.left - 16} y2={originY} stroke="#1C1714" strokeWidth="2" />
          <line x1={margin.left - 34} y1={originY + roomPixH} x2={margin.left - 16} y2={originY + roomPixH} stroke="#1C1714" strokeWidth="2" />
          <text 
            x={margin.left - 29} 
            y={originY + roomPixH / 2} 
            fill="#1C1714" 
            fontSize="12" 
            fontFamily="monospace" 
            fontWeight="bold" 
            textAnchor="middle" 
            transform={`rotate(-90 ${margin.left - 29} ${originY + roomPixH / 2})`}
          >
            Length: {length} {unit} ({Math.round(roomLengthMm)} mm)
          </text>
        </svg>
      </div>

      {activeFixtureTooltip && (
        <div className="p-3.5 bg-porcelain-warm border border-accent/40 rounded-sm text-sm font-mono font-medium text-ink flex items-center justify-between animate-fade-in">
          <span>Active Fixture Focus: <strong className="font-bold text-ink">{activeFixtureTooltip}</strong></span>
          <button onClick={() => setActiveFixtureTooltip(null)} className="text-xs font-mono uppercase font-bold text-ink hover:text-accent">Dismiss</button>
        </div>
      )}
    </div>
  );
};
