export const generatePatientReport = async (patient, history) => {
    // Dynamic imports for code splitting
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default;

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("GlucoseGuard Patient Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${today}`, 14, 30);

    // -- Patient Details --
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);

    // ... (rest of the PDF generation logic remains the same, assuming standard API usage)

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Patient Information", 14, 45);

    doc.setFontSize(11);
    doc.text(`Name: ${patient.name}`, 14, 55);
    doc.text(`ID: ${patient.id}`, 14, 62);
    doc.text(`Current Status: ${patient.status}`, 14, 69);

    // -- Risk Assessment --
    doc.setFontSize(14);
    doc.text("Current Risk Assessment", 110, 45);

    // Color coding for risk (text only for simplicity in PDF)
    const riskColor = patient.ml.risk === 'high_risk' ? [220, 53, 69] : [40, 167, 69]; // Red or Green
    doc.setTextColor(...riskColor);
    doc.setFontSize(12);
    doc.text(`Risk Level: ${patient.ml.risk.toUpperCase().replace('_', ' ')}`, 110, 55);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Confidence Score: ${(patient.ml.score * 100).toFixed(1)}%`, 110, 62);
    doc.text(`Prediction Window: 30 Minutes`, 110, 69);

    doc.setDrawColor(200);
    doc.line(14, 75, 196, 75);

    // -- Recent Vitals Table --
    doc.setFontSize(14);
    doc.text("Recent Vitals History (Last 24h)", 14, 85);

    const tableData = history.map(row => [
        new Date(row.timestamp).toLocaleString(),
        row.heart_rate || '--',
        row.spo2 || '--',
        row.temperature || '--',
        row.instability_risk || 'N/A'
    ]);

    autoTable(doc, {
        startY: 90,
        head: [['Timestamp', 'Heart Rate (bpm)', 'SpO2 (%)', 'Temp (°C)', 'ML Risk']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] },
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 50 },
            4: { fontStyle: 'bold' }
        }
    });

    // -- Footer --
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Page ' + i + ' of ' + pageCount, 196, 285, { align: 'right' });
        doc.text('Confidential Medical Record', 14, 285);
    }

    // Save
    doc.save(`GlucoseGuard_Report_${patient.id}_${Date.now()}.pdf`);
};
