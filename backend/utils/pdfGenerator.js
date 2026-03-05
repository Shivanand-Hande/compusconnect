const PDFDocument = require('pdfkit');

const generateCertificate = (res, data) => {
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
    });

    const { userName, eventName, date, clubName } = data;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${userName.replace(/\s+/g, '_')}.pdf`);

    doc.pipe(res);

    // Design
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#0284c7');
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#0ea5e9');

    // Content
    doc.fillColor('#0f172a').fontSize(40).text('CERTIFICATE', 0, 100, { align: 'center' });
    doc.fontSize(20).text('OF PARTICIPATION', 0, 150, { align: 'center' });

    doc.fontSize(16).text('This is to certify that', 0, 230, { align: 'center' });
    doc.fillColor('#0ea5e9').fontSize(30).text(userName, 0, 260, { align: 'center' });

    doc.fillColor('#0f172a').fontSize(16).text(`has successfully participated in the event`, 0, 310, { align: 'center' });
    doc.fontSize(22).text(eventName, 0, 340, { align: 'center' });

    doc.fontSize(16).text(`Organized by ${clubName}`, 0, 380, { align: 'center' });
    doc.fontSize(14).text(`Date: ${new Date(date).toLocaleDateString()}`, 0, 410, { align: 'center' });

    // Footer
    doc.fontSize(12).text('CampusConnect - Digital Certificate', 0, 500, { align: 'center' });

    doc.end();
};

module.exports = { generateCertificate };
