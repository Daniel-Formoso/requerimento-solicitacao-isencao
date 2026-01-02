/**
 * Estilos CSS base compartilhados por todos os geradores de PDF
 * Mantém consistência visual em todos os documentos
 */

export const baseStyles = `
  @page {
    margin: 15mm;
    size: A4;
  }
  
  body {
    font-family: 'Arial', sans-serif;
    font-size: 11px;
    line-height: 1.3;
    color: #000;
    margin: 0;
    padding: 0;
    padding-bottom: 40px;
  }
  
  .header {
    display: flex;
    align-items: center;
    border-bottom: 3px solid #2b2862;
    padding-bottom: 12px;
    margin-bottom: 15px;
  }
  
  .header img {
    width: 70px;
    height: auto;
    margin-right: 20px;
    flex-shrink: 0;
  }
  
  .header-text {
    flex: 1;
    text-align: left;
  }
  
  .header-text h3 {
    margin: 2px 0;
    font-size: 12px;
    font-weight: bold;
    color: #2b2862;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }

  .declaration-section {
    border: 1.5px solid #2b2862;
    border-radius: 6px;
    padding: 16px 18px 12px 18px;
    margin: 18px 0 10px 0;
    background: #f7f7fb;
    font-size: 11px;
    color: #222;
  }

  .declaration-title {
    font-size: 13px;
    font-weight: bold;
    color: #2b2862;
    margin-bottom: 7px;
    text-align: left;
    letter-spacing: 0.5px;
  }

  .declaration-text {
    font-size: 11px;
    margin-bottom: 10px;
    color: #222;
    font-style: italic;
  }

  .declaration-info {
    margin-bottom: 8px;
  }

  .declaration-item {
    margin-bottom: 2px;
  }

  .declaration-label {
    font-weight: bold;
    color: #2b2862;
    margin-right: 4px;
    font-size: 10px;
    text-transform: uppercase;
  }

  .declaration-value {
    color: #222;
    font-size: 10px;
  }

  .declaration-footer {
    font-size: 10px;
    color: #444;
    margin-top: 8px;
    text-align: left;
  }

  .section {
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  
  .section-title {
    background: #2b2862;
    color: white;
    padding: 6px 10px;
    font-weight: bold;
    font-size: 11px;
    margin-bottom: 8px;
    border-radius: 3px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 15px;
    margin-bottom: 8px;
  }
  
  .info-item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
  }
  
  .info-label {
    font-weight: bold;
    font-size: 9px;
    color: #2b2862;
    margin-bottom: 2px;
    text-transform: uppercase;
  }
  
  .info-value {
    font-size: 10px;
    color: #333;
    margin-top: 2px;
    word-wrap: break-word;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }

  .bool-value {
    font-size: 10px;
    color: #333;
    font-weight: 500;
  }

  .sim {
    color: #28a745;
  }

  .nao {
    color: #dc3545;
  }
  
  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35px;
    border-top: 1px solid #d0d0d0;
    padding: 5px 15mm;
    font-size: 8px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 1.2;
    background: #f9f9f9;
  }
  
  @media print {
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .page-footer {
      position: fixed;
      bottom: 0;
    }
  }
`;
