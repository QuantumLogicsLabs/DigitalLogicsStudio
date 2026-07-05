import React from 'react';

// ── Gate SVG symbols ──────────────────────────────────────────────────────────
export const gateSymbols = {
  'AND': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 10 10 L 10 50 L 40 50 Q 65 50 65 30 Q 65 10 40 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'OR': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M 40 30 Q 60 30 65 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'NOT': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 10 15 L 10 45 L 55 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'NAND': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 10 10 L 10 50 L 40 50 Q 60 50 60 30 Q 60 10 40 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="65" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'NOR': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M 40 30 Q 55 30 60 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="65" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'XOR': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 5 10 Q 15 30 5 50" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M 40 30 Q 60 30 65 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'XNOR': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 5 10 Q 15 30 5 50" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M 40 30 Q 55 30 60 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="65" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'BUFFER': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <path d="M 10 15 L 10 45 L 65 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'INPUT': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <polygon points="8,18 56,18 70,30 56,42 8,42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'OUTPUT': (
    <svg viewBox="0 0 80 60" className="gate-symbol">
      <polygon points="10,30 24,18 72,18 72,42 24,42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="2" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  // ── Multiplexers ────────────────────────────────────────────────────────────
  'MUX2': (
    <svg viewBox="0 0 80 100" className="gate-symbol gate-symbol--ic">
      <polygon points="8,5 72,20 72,80 8,95" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="40" y="46" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">MUX</text>
      <text x="40" y="58" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">2:1</text>
      <line x1="0" y1="30" x2="8" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="70" x2="8" y2="70" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="95" x2="40" y2="100" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" />
      <text x="11" y="28" fontSize="6" fill="currentColor" fontFamily="monospace">D0</text>
      <text x="11" y="68" fontSize="6" fill="currentColor" fontFamily="monospace">D1</text>
      <text x="35" y="93" fontSize="6" fill="currentColor" fontFamily="monospace">S</text>
      <text x="60" y="48" fontSize="6" fill="currentColor" fontFamily="monospace">Y</text>
    </svg>
  ),
  'MUX4': (
    <svg viewBox="0 0 80 120" className="gate-symbol gate-symbol--ic">
      <polygon points="8,5 72,22 72,98 8,115" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="40" y="56" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">MUX</text>
      <text x="40" y="68" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">4:1</text>
      <line x1="0" y1="27" x2="8" y2="27" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="47" x2="8" y2="47" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="73" x2="8" y2="73" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="93" x2="8" y2="93" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="115" x2="30" y2="120" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="115" x2="50" y2="120" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2" />
      <text x="11" y="25" fontSize="6" fill="currentColor" fontFamily="monospace">D0</text>
      <text x="11" y="45" fontSize="6" fill="currentColor" fontFamily="monospace">D1</text>
      <text x="11" y="71" fontSize="6" fill="currentColor" fontFamily="monospace">D2</text>
      <text x="11" y="91" fontSize="6" fill="currentColor" fontFamily="monospace">D3</text>
      <text x="25" y="113" fontSize="6" fill="currentColor" fontFamily="monospace">S0</text>
      <text x="45" y="113" fontSize="6" fill="currentColor" fontFamily="monospace">S1</text>
      <text x="60" y="58" fontSize="6" fill="currentColor" fontFamily="monospace">Y</text>
    </svg>
  ),
  'MUX8': (
    <svg viewBox="0 0 80 160" className="gate-symbol gate-symbol--ic">
      <polygon points="8,5 72,28 72,132 8,155" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="40" y="76" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">MUX</text>
      <text x="40" y="88" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">8:1</text>
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i}>
          <line x1="0" y1={18 + i*17} x2="8" y2={18 + i*17} stroke="currentColor" strokeWidth="2" />
          <text x="10" y={16 + i*17} fontSize="5.5" fill="currentColor" fontFamily="monospace">{`D${i}`}</text>
        </g>
      ))}
      <line x1="25" y1="155" x2="25" y2="160" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="155" x2="40" y2="160" stroke="currentColor" strokeWidth="2" />
      <line x1="55" y1="155" x2="55" y2="160" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="154" fontSize="5.5" fill="currentColor" fontFamily="monospace">S0</text>
      <text x="35" y="154" fontSize="5.5" fill="currentColor" fontFamily="monospace">S1</text>
      <text x="50" y="154" fontSize="5.5" fill="currentColor" fontFamily="monospace">S2</text>
      <line x1="72" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="2" />
      <text x="60" y="78" fontSize="6" fill="currentColor" fontFamily="monospace">Y</text>
    </svg>
  ),

  // ── Demultiplexers ──────────────────────────────────────────────────────────
  'DEMUX2': (
    <svg viewBox="0 0 80 100" className="gate-symbol gate-symbol--ic">
      <polygon points="8,20 72,5 72,95 8,80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="40" y="46" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">DEMUX</text>
      <text x="40" y="58" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">1:2</text>
      <line x1="0" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="80" x2="40" y2="85" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="25" x2="80" y2="25" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="75" x2="80" y2="75" stroke="currentColor" strokeWidth="2" />
      <text x="5" y="48" fontSize="6" fill="currentColor" fontFamily="monospace">D</text>
      <text x="35" y="79" fontSize="6" fill="currentColor" fontFamily="monospace">S</text>
      <text x="60" y="23" fontSize="6" fill="currentColor" fontFamily="monospace">Y0</text>
      <text x="60" y="73" fontSize="6" fill="currentColor" fontFamily="monospace">Y1</text>
    </svg>
  ),
  'DEMUX4': (
    <svg viewBox="0 0 80 120" className="gate-symbol gate-symbol--ic">
      <polygon points="8,20 72,5 72,115 8,100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="40" y="54" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">DEMUX</text>
      <text x="40" y="66" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">1:4</text>
      <line x1="0" y1="60" x2="8" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="100" x2="30" y2="105" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="100" x2="50" y2="105" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="47" x2="80" y2="47" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="73" x2="80" y2="73" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="100" x2="80" y2="100" stroke="currentColor" strokeWidth="2" />
      <text x="5" y="58" fontSize="6" fill="currentColor" fontFamily="monospace">D</text>
      <text x="25" y="99" fontSize="6" fill="currentColor" fontFamily="monospace">S0</text>
      <text x="45" y="99" fontSize="6" fill="currentColor" fontFamily="monospace">S1</text>
      <text x="60" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">Y0</text>
      <text x="60" y="45" fontSize="6" fill="currentColor" fontFamily="monospace">Y1</text>
      <text x="60" y="71" fontSize="6" fill="currentColor" fontFamily="monospace">Y2</text>
      <text x="60" y="98" fontSize="6" fill="currentColor" fontFamily="monospace">Y3</text>
    </svg>
  ),
  'DEMUX8': (
    <svg viewBox="0 0 80 160" className="gate-symbol gate-symbol--ic">
      <polygon points="8,20 72,5 72,155 8,140" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="40" y="76" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">DEMUX</text>
      <text x="40" y="88" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">1:8</text>
      {/* Data input from left */}
      <line x1="0" y1="80" x2="8" y2="80" stroke="currentColor" strokeWidth="2" />
      {/* Select inputs from bottom */}
      <line x1="25" y1="140" x2="25" y2="145" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="140" x2="40" y2="145" stroke="currentColor" strokeWidth="2" />
      <line x1="55" y1="140" x2="55" y2="145" stroke="currentColor" strokeWidth="2" />
      {/* 8 output lines on the right */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i}>
          <line x1="72" y1={18 + i*17} x2="80" y2={18 + i*17} stroke="currentColor" strokeWidth="2" />
          <text x="62" y={16 + i*17} fontSize="5.5" fill="currentColor" fontFamily="monospace">{`Y${i}`}</text>
        </g>
      ))}
      {/* Labels */}
      <text x="5" y="78" fontSize="6" fill="currentColor" fontFamily="monospace">D</text>
      <text x="20" y="139" fontSize="5.5" fill="currentColor" fontFamily="monospace">S0</text>
      <text x="35" y="139" fontSize="5.5" fill="currentColor" fontFamily="monospace">S1</text>
      <text x="50" y="139" fontSize="5.5" fill="currentColor" fontFamily="monospace">S2</text>
    </svg>
  ),

  // ── Encoders ────────────────────────────────────────────────────────────────
  'ENC4': (
    <svg viewBox="0 0 80 100" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="90" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <text x="40" y="46" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">ENC</text>
      <text x="40" y="58" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">4:2</text>
      <line x1="0" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="40" x2="8" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="60" x2="8" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="80" x2="8" y2="80" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="65" x2="80" y2="65" stroke="currentColor" strokeWidth="2" />
      <text x="1" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">I0</text>
      <text x="1" y="38" fontSize="6" fill="currentColor" fontFamily="monospace">I1</text>
      <text x="1" y="58" fontSize="6" fill="currentColor" fontFamily="monospace">I2</text>
      <text x="1" y="78" fontSize="6" fill="currentColor" fontFamily="monospace">I3</text>
      <text x="62" y="33" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="62" y="63" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
    </svg>
  ),
  'ENC8': (
    <svg viewBox="0 0 80 140" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="130" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <text x="40" y="65" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">ENC</text>
      <text x="40" y="77" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">8:3</text>
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i}>
          <line x1="0" y1={16 + i*15} x2="8" y2={16 + i*15} stroke="currentColor" strokeWidth="2" />
          <text x="1" y={14 + i*15} fontSize="5.5" fill="currentColor" fontFamily="monospace">{`I${i}`}</text>
        </g>
      ))}
      <line x1="72" y1="45" x2="80" y2="45" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="95" x2="80" y2="95" stroke="currentColor" strokeWidth="2" />
      <text x="62" y="43" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="62" y="68" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="62" y="93" fontSize="6" fill="currentColor" fontFamily="monospace">C</text>
    </svg>
  ),

  // ── Decoders ────────────────────────────────────────────────────────────────
  'DEC4': (
    <svg viewBox="0 0 80 100" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="90" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <text x="40" y="46" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">DEC</text>
      <text x="40" y="58" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">2:4</text>
      <line x1="0" y1="35" x2="8" y2="35" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="65" x2="8" y2="65" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="2" />
      <text x="1" y="33" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="1" y="63" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="62" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">Y0</text>
      <text x="62" y="38" fontSize="6" fill="currentColor" fontFamily="monospace">Y1</text>
      <text x="62" y="58" fontSize="6" fill="currentColor" fontFamily="monospace">Y2</text>
      <text x="62" y="78" fontSize="6" fill="currentColor" fontFamily="monospace">Y3</text>
    </svg>
  ),
  'DEC8': (
    <svg viewBox="0 0 80 140" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="130" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <text x="40" y="65" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="700">DEC</text>
      <text x="40" y="77" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="monospace">3:8</text>
      <line x1="0" y1="40" x2="8" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="70" x2="8" y2="70" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="100" x2="8" y2="100" stroke="currentColor" strokeWidth="2" />
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i}>
          <line x1="72" y1={16 + i*15} x2="80" y2={16 + i*15} stroke="currentColor" strokeWidth="2" />
          <text x="62" y={14 + i*15} fontSize="5.5" fill="currentColor" fontFamily="monospace">{`Y${i}`}</text>
        </g>
      ))}
      <text x="1" y="38" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="1" y="68" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="1" y="98" fontSize="6" fill="currentColor" fontFamily="monospace">C</text>
    </svg>
  ),

  // ── Adders / Subtractors ─────────────────────────────────────────────────

  'HALF_ADDER': (
    <svg viewBox="0 0 80 80" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="70" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="40" y="36" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">HA</text>
      <text x="40" y="50" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">Half Adder</text>
      <line x1="0" y1="28" x2="8" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="52" x2="8" y2="52" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="22" x2="80" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="58" x2="80" y2="58" stroke="currentColor" strokeWidth="2" />
      <text x="1" y="26" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="1" y="50" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="62" y="20" fontSize="6" fill="currentColor" fontFamily="monospace">Σ</text>
      <text x="62" y="56" fontSize="6" fill="currentColor" fontFamily="monospace">C</text>
    </svg>
  ),

  'FULL_ADDER': (
    <svg viewBox="0 0 80 100" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="90" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="40" y="46" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">FA</text>
      <text x="40" y="60" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">Full Adder</text>
      <line x1="0" y1="28" x2="8" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="52" x2="8" y2="52" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="76" x2="8" y2="76" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="28" x2="80" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="72" x2="80" y2="72" stroke="currentColor" strokeWidth="2" />
      <text x="1" y="26" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="1" y="50" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="1" y="74" fontSize="6" fill="currentColor" fontFamily="monospace">Cᵢ</text>
      <text x="62" y="26" fontSize="6" fill="currentColor" fontFamily="monospace">Σ</text>
      <text x="62" y="70" fontSize="6" fill="currentColor" fontFamily="monospace">Cₒ</text>
    </svg>
  ),

  'ADD4': (
    <svg viewBox="0 0 80 160" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="150" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="40" y="76" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">ADD4</text>
      <text x="40" y="90" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">4‑bit Adder</text>
      {/* A inputs left top, B left bottom */}
      <line x1="0" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="2" /><text x="1" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">A0</text>
      <line x1="0" y1="35" x2="8" y2="35" stroke="currentColor" strokeWidth="2" /><text x="1" y="33" fontSize="6" fill="currentColor" fontFamily="monospace">A1</text>
      <line x1="0" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="2" /><text x="1" y="48" fontSize="6" fill="currentColor" fontFamily="monospace">A2</text>
      <line x1="0" y1="65" x2="8" y2="65" stroke="currentColor" strokeWidth="2" /><text x="1" y="63" fontSize="6" fill="currentColor" fontFamily="monospace">A3</text>
      <line x1="0" y1="85" x2="8" y2="85" stroke="currentColor" strokeWidth="2" /><text x="1" y="83" fontSize="6" fill="currentColor" fontFamily="monospace">B0</text>
      <line x1="0" y1="100" x2="8" y2="100" stroke="currentColor" strokeWidth="2" /><text x="1" y="98" fontSize="6" fill="currentColor" fontFamily="monospace">B1</text>
      <line x1="0" y1="115" x2="8" y2="115" stroke="currentColor" strokeWidth="2" /><text x="1" y="113" fontSize="6" fill="currentColor" fontFamily="monospace">B2</text>
      <line x1="0" y1="130" x2="8" y2="130" stroke="currentColor" strokeWidth="2" /><text x="1" y="128" fontSize="6" fill="currentColor" fontFamily="monospace">B3</text>
      <line x1="40" y1="150" x2="40" y2="155" stroke="currentColor" strokeWidth="2" /><text x="35" y="149" fontSize="6" fill="currentColor" fontFamily="monospace">Cᵢ</text>
      {/* Sum outputs right */}
      <line x1="72" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="2" /><text x="62" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">S0</text>
      <line x1="72" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" /><text x="62" y="38" fontSize="6" fill="currentColor" fontFamily="monospace">S1</text>
      <line x1="72" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2" /><text x="62" y="58" fontSize="6" fill="currentColor" fontFamily="monospace">S2</text>
      <line x1="72" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="2" /><text x="62" y="78" fontSize="6" fill="currentColor" fontFamily="monospace">S3</text>
      <line x1="72" y1="110" x2="80" y2="110" stroke="currentColor" strokeWidth="2" /><text x="60" y="108" fontSize="6" fill="currentColor" fontFamily="monospace">Cₒ</text>
    </svg>
  ),

  'CLADD4': (
    <svg viewBox="0 0 80 160" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="150" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="40" y="68" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">CLA4</text>
      <text x="40" y="82" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">Look‑Ahead</text>
      {/* same pin layout as ADD4 */}
      <line x1="0" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="2" /><text x="1" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">A0</text>
      <line x1="0" y1="35" x2="8" y2="35" stroke="currentColor" strokeWidth="2" /><text x="1" y="33" fontSize="6" fill="currentColor" fontFamily="monospace">A1</text>
      <line x1="0" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="2" /><text x="1" y="48" fontSize="6" fill="currentColor" fontFamily="monospace">A2</text>
      <line x1="0" y1="65" x2="8" y2="65" stroke="currentColor" strokeWidth="2" /><text x="1" y="63" fontSize="6" fill="currentColor" fontFamily="monospace">A3</text>
      <line x1="0" y1="85" x2="8" y2="85" stroke="currentColor" strokeWidth="2" /><text x="1" y="83" fontSize="6" fill="currentColor" fontFamily="monospace">B0</text>
      <line x1="0" y1="100" x2="8" y2="100" stroke="currentColor" strokeWidth="2" /><text x="1" y="98" fontSize="6" fill="currentColor" fontFamily="monospace">B1</text>
      <line x1="0" y1="115" x2="8" y2="115" stroke="currentColor" strokeWidth="2" /><text x="1" y="113" fontSize="6" fill="currentColor" fontFamily="monospace">B2</text>
      <line x1="0" y1="130" x2="8" y2="130" stroke="currentColor" strokeWidth="2" /><text x="1" y="128" fontSize="6" fill="currentColor" fontFamily="monospace">B3</text>
      <line x1="40" y1="150" x2="40" y2="155" stroke="currentColor" strokeWidth="2" /><text x="35" y="149" fontSize="6" fill="currentColor" fontFamily="monospace">Cᵢ</text>
      <line x1="72" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="2" /><text x="62" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">S0</text>
      <line x1="72" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" /><text x="62" y="38" fontSize="6" fill="currentColor" fontFamily="monospace">S1</text>
      <line x1="72" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2" /><text x="62" y="58" fontSize="6" fill="currentColor" fontFamily="monospace">S2</text>
      <line x1="72" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="2" /><text x="62" y="78" fontSize="6" fill="currentColor" fontFamily="monospace">S3</text>
      <line x1="72" y1="110" x2="80" y2="110" stroke="currentColor" strokeWidth="2" /><text x="60" y="108" fontSize="6" fill="currentColor" fontFamily="monospace">Cₒ</text>
    </svg>
  ),

  'HALF_SUBTRACTOR': (
    <svg viewBox="0 0 80 80" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="70" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="40" y="36" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">HS</text>
      <text x="40" y="50" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">Half Subtractor</text>
      <line x1="0" y1="28" x2="8" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="52" x2="8" y2="52" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="22" x2="80" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="58" x2="80" y2="58" stroke="currentColor" strokeWidth="2" />
      <text x="1" y="26" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="1" y="50" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="62" y="20" fontSize="6" fill="currentColor" fontFamily="monospace">D</text>
      <text x="62" y="56" fontSize="6" fill="currentColor" fontFamily="monospace">Bₒ</text>
    </svg>
  ),

  'FULL_SUBTRACTOR': (
    <svg viewBox="0 0 80 100" className="gate-symbol gate-symbol--ic">
      <rect x="8" y="5" width="64" height="90" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="40" y="46" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="monospace" fontWeight="700">FS</text>
      <text x="40" y="60" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">Full Subtractor</text>
      <line x1="0" y1="28" x2="8" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="52" x2="8" y2="52" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="76" x2="8" y2="76" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="28" x2="80" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="72" x2="80" y2="72" stroke="currentColor" strokeWidth="2" />
      <text x="1" y="26" fontSize="6" fill="currentColor" fontFamily="monospace">A</text>
      <text x="1" y="50" fontSize="6" fill="currentColor" fontFamily="monospace">B</text>
      <text x="1" y="74" fontSize="6" fill="currentColor" fontFamily="monospace">Bᵢ</text>
      <text x="62" y="26" fontSize="6" fill="currentColor" fontFamily="monospace">D</text>
      <text x="62" y="70" fontSize="6" fill="currentColor" fontFamily="monospace">Bₒ</text>
    </svg>
  ),
};

// ── IC metadata ───────────────────────────────────────────────────────────────
export const IC_META = {
  'MUX2':   { inputs: 3,  outputs: 1, inputLabels: ['D0','D1','S'],                                          outputLabels: ['Y']                                       },
  'MUX4':   { inputs: 6,  outputs: 1, inputLabels: ['D0','D1','D2','D3','S0','S1'],                          outputLabels: ['Y']                                       },
  'MUX8':   { inputs: 11, outputs: 1, inputLabels: ['D0','D1','D2','D3','D4','D5','D6','D7','S0','S1','S2'], outputLabels: ['Y']                                       },
  'DEMUX2': { inputs: 2,  outputs: 2, inputLabels: ['D','S'],                                                 outputLabels: ['Y0','Y1']                                 },
  'DEMUX4': { inputs: 3,  outputs: 4, inputLabels: ['D','S0','S1'],                                           outputLabels: ['Y0','Y1','Y2','Y3']                       },
  'DEMUX8': { inputs: 4,  outputs: 8, inputLabels: ['D','S0','S1','S2'],                                      outputLabels: ['Y0','Y1','Y2','Y3','Y4','Y5','Y6','Y7']},
  'ENC4':   { inputs: 4,  outputs: 2, inputLabels: ['I0','I1','I2','I3'],                                     outputLabels: ['A','B']                                   },
  'ENC8':   { inputs: 8,  outputs: 3, inputLabels: ['I0','I1','I2','I3','I4','I5','I6','I7'],                 outputLabels: ['A','B','C']                               },
  'DEC4':   { inputs: 2,  outputs: 4, inputLabels: ['A','B'],                                                 outputLabels: ['Y0','Y1','Y2','Y3']                       },
  'DEC8':   { inputs: 3,  outputs: 8, inputLabels: ['A','B','C'],                                             outputLabels: ['Y0','Y1','Y2','Y3','Y4','Y5','Y6','Y7']  },
  'HALF_ADDER':       { inputs: 2,  outputs: 2,  inputLabels: ['A','B'],                                      outputLabels: ['Σ','C']                   },
  'FULL_ADDER':       { inputs: 3,  outputs: 2,  inputLabels: ['A','B','Cᵢ'],                                 outputLabels: ['Σ','Cₒ']                  },
  'ADD4':             { inputs: 9,  outputs: 5,  inputLabels: ['A0','A1','A2','A3','B0','B1','B2','B3','Cᵢ'], outputLabels: ['S0','S1','S2','S3','Cₒ'] },
  'CLADD4':           { inputs: 9,  outputs: 5,  inputLabels: ['A0','A1','A2','A3','B0','B1','B2','B3','Cᵢ'], outputLabels: ['S0','S1','S2','S3','Cₒ'] },
  'HALF_SUBTRACTOR':  { inputs: 2,  outputs: 2,  inputLabels: ['A','B'],                                      outputLabels: ['D','Bₒ']                  },
  'FULL_SUBTRACTOR':  { inputs: 3,  outputs: 2,  inputLabels: ['A','B','Bᵢ'],                                 outputLabels: ['D','Bₒ']                  },
};

export const IC_TYPES = new Set(Object.keys(IC_META));
