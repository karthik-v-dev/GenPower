import { jsPDF } from 'jspdf';
import { TERMS_AND_CONDITIONS, SERVICE_DISCOUNT_TIERS } from '../constants/terms';

export interface StoredTermsDocument {
  id: string;
  version: string;
  title: string;
  generatedAt: string;
  pdfDataUri: string;
  fileSizeKb: number;
  clausesSummary: string[];
}

export class TermsPdfService {
  /**
   * Generates the official GenPower Terms & Conditions PDF document
   */
  generatePdf(): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // --- Header Banner ---
    doc.setFillColor(25, 118, 210); // GenPower Primary Blue (#1976d2)
    doc.rect(margin, y, contentWidth, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('GENPOWER SOLUTIONS PRIVATE LIMITED', margin + 6, y + 9);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Industrial & Commercial Power Systems | Sales, Leases, Maintenance & Spare Parts',
      margin + 6,
      y + 16
    );

    y += 28;

    // --- Document Meta & Reference ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Document Ref: GP-TC-2026/V2`, margin, y);
    doc.text(`Effective: ${TERMS_AND_CONDITIONS.effectiveDate}`, margin + 60, y);
    doc.text(`Support: ${TERMS_AND_CONDITIONS.supportContact}`, margin + 120, y);

    y += 5;
    doc.setDrawColor(220, 224, 230);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + contentWidth, y);

    y += 7;

    // --- Title ---
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('OFFICIAL TERMS & CONDITIONS & SERVICE WARRANTY POLICY', margin, y);

    y += 6;

    // --- Critical Alert Box (Strict Non-Refundable / Repair Only) ---
    doc.setFillColor(254, 242, 242); // Soft red background
    doc.setDrawColor(239, 68, 68); // Red border
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setTextColor(185, 28, 28); // Bold red text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('CRITICAL NOTICE: STRICT NON-RETURNABLE & NON-REFUNDABLE POLICY', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(127, 29, 29);
    const noticeText =
      'Once an order is confirmed, payments are NON-REFUNDABLE and products are NON-RETURNABLE under any circumstance. Only authorized repairs, inspections, and component replacements will be performed by GenPower certified technicians.';
    const splitNotice = doc.splitTextToSize(noticeText, contentWidth - 8);
    doc.text(splitNotice, margin + 4, y + 11);

    y += 25;

    // --- Clauses ---
    TERMS_AND_CONDITIONS.clauses.forEach((clause) => {
      // Check page break if reaching near bottom
      if (y > 265) {
        doc.addPage();
        y = 16;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text(clause.title, margin, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const splitBody = doc.splitTextToSize(clause.content, contentWidth);
      doc.text(splitBody, margin, y);
      y += splitBody.length * 3.6 + 3.5;
    });

    // Check if we need a new page for the Discount Tiers table
    if (y > 215) {
      doc.addPage();
      y = 18;
    }

    // --- Service Discount Tier Table Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('SCHEDULE A: MAINTENANCE SERVICE CHARGE & DISCOUNT TIERS', margin, y);
    y += 6;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 7, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('TIER / SERVICE', margin + 3, y + 5);
    doc.text('LABOR / SERVICE CHARGE', margin + 42, y + 5);
    doc.text('EQUIPMENT & PARTS COST', margin + 92, y + 5);
    doc.text('DISCOUNT', margin + 150, y + 5);
    y += 7;

    // Table Rows
    SERVICE_DISCOUNT_TIERS.forEach((tier) => {
      doc.setFillColor(tier.tierNumber % 2 === 0 ? 248 : 255, tier.tierNumber % 2 === 0 ? 250 : 255, 252);
      doc.rect(margin, y, contentWidth, 8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(tier.serviceRange, margin + 3, y + 5.2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(tier.discountPercentage === 100 ? 22 : 51, tier.discountPercentage === 100 ? 101 : 65, tier.discountPercentage === 100 ? 52 : 85);
      doc.text(tier.laborCharge, margin + 42, y + 5.2);

      doc.setTextColor(180, 83, 9); // Amber warning color
      doc.setFont('helvetica', 'bold');
      doc.text(tier.equipmentCost, margin + 92, y + 5.2);

      doc.setTextColor(tier.discountPercentage > 0 ? 25 : 100, tier.discountPercentage > 0 ? 118 : 116, tier.discountPercentage > 0 ? 210 : 139);
      doc.text(tier.discountPercentage > 0 ? `${tier.discountPercentage}% OFF` : '0% (Standard)', margin + 150, y + 5.2);

      y += 8;
    });

    y += 6;

    // Table Note
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text(
      '* Note: Equipment, spare parts, engine oils, and consumables costs are strictly imposed and must be paid by the customer for all services.',
      margin,
      y
    );

    y += 12;

    // --- Sign-off / Verification ---
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('FOR GENPOWER SOLUTIONS PRIVATE LIMITED', margin, y);
    doc.text('CUSTOMER ACCEPTANCE VERIFICATION', margin + 105, y);

    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Authorized Signatory & Legal Compliance Team', margin, y);
    doc.text('Mandatory Checkbox Agreement Confirmed Digitally Prior to Order Placement', margin + 105, y);

    return doc;
  }

  /**
   * Generates and downloads the PDF to the user's browser
   */
  downloadPdf(filename: string = 'GenPower_Terms_And_Conditions.pdf'): void {
    const doc = this.generatePdf();
    doc.save(filename);
  }

  /**
   * Generates base64 data URI for storage and display
   */
  getDataUri(): string {
    const doc = this.generatePdf();
    return doc.output('datauristring');
  }

  /**
   * Prepares a standardized document object for database storage
   */
  createDocumentRecord(): StoredTermsDocument {
    const dataUri = this.getDataUri();
    // Estimate size
    const sizeInKb = Math.round((dataUri.length * 3) / 4 / 1024);

    return {
      id: `terms-v${TERMS_AND_CONDITIONS.version.replace(/\./g, '-')}`,
      version: TERMS_AND_CONDITIONS.version,
      title: 'GenPower Official Terms, Conditions & Service Policy',
      generatedAt: new Date().toISOString(),
      pdfDataUri: dataUri,
      fileSizeKb: sizeInKb,
      clausesSummary: TERMS_AND_CONDITIONS.summaryPoints,
    };
  }
}

export const termsPdfService = new TermsPdfService();
