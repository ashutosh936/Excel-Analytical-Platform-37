import jsPDF from 'jspdf';

export function exportChartAsPDF(canvas, filename = 'chart.pdf') {
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape' });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height - 20);
  pdf.save(filename);
} 