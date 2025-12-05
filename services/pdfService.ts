
import { Order } from '../types';
import { RESTAURANT_DETAILS } from '../constants';

// Inform TypeScript that jspdf and its plugins are available on the window object
declare const jspdf: any;

const formatTimeForPdf = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 === 0 ? 12 : h % 12;
    const formattedMinutes = m < 10 ? '0' + m : m;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};


const generatePdf = (order: Order, isKot: boolean) => {
    if (order.items.length === 0) {
        alert(`Cannot generate ${isKot ? 'KOT' : 'Bill'}. The order is empty.`);
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    const title = isKot ? 'Kitchen Order Ticket (KOT)' : (order.isNC ? 'No Charge Invoice' : 'Tax Invoice');
    const fileName = `${isKot ? 'KOT' : 'Bill'}_${order.id}.pdf`;
    
    let currentY = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(RESTAURANT_DETAILS.name, 105, currentY, { align: 'center' });
    currentY += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const addressLines = RESTAURANT_DETAILS.address.split('\n');
    doc.text(addressLines, 105, currentY, { align: 'center' });
    currentY += addressLines.length * 4.5; // Adjust Y based on number of address lines

    doc.text(`Phone: ${RESTAURANT_DETAILS.phone}`, 105, currentY, { align: 'center' });
    currentY += 13;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, currentY, { align: 'center' });
    currentY += 15;

    // Order Details
    const detailsStartX = 14;
    const detailsValueX = 40;
    const detailsLineHeight = 5;

    doc.setFontSize(10);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Order ID:', detailsStartX, currentY);
    doc.text('Date:', detailsStartX, currentY + detailsLineHeight);
    doc.text('Guest:', detailsStartX, currentY + detailsLineHeight * 2);

    doc.setFont('helvetica', 'normal');
    doc.text(order.id, detailsValueX, currentY);
    doc.text(order.date.toLocaleString(), detailsValueX, currentY + detailsLineHeight);
    doc.text(order.guestName, detailsValueX, currentY + detailsLineHeight * 2);
    
    currentY += detailsLineHeight * 3;

    if (order.roomNo) {
        doc.setFont('helvetica', 'bold');
        doc.text('Room No:', detailsStartX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(order.roomNo, detailsValueX, currentY);
        currentY += detailsLineHeight;
    }
     if (order.tableNo) {
        doc.setFont('helvetica', 'bold');
        doc.text('Table No:', detailsStartX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(order.tableNo, detailsValueX, currentY);
        currentY += detailsLineHeight;
    }
    if (order.staff) {
        doc.setFont('helvetica', 'bold');
        doc.text('Staff:', detailsStartX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(order.staff, detailsValueX, currentY);
        currentY += detailsLineHeight;
    }

    if (isKot && order.isNC) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0); // Red color
        doc.text('Order Type:', detailsStartX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text('NO CHARGE / COMPLIMENTARY', detailsValueX, currentY);
        doc.setTextColor(0, 0, 0); // Reset color
        currentY += detailsLineHeight;
    }
    
    if (isKot && order.serviceTime) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0); // Make it stand out in red
        doc.text('Service Time:', detailsStartX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(formatTimeForPdf(order.serviceTime), detailsValueX, currentY);
        doc.setTextColor(0, 0, 0); // Reset color
        currentY += detailsLineHeight;
    }

    if (isKot && order.specialRequest) {
        currentY += 4;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0); // Red color
        
        const requestHeader = '*** SPECIAL REQUEST ***';
        doc.text(requestHeader, 105, currentY, { align: 'center' });
        currentY += detailsLineHeight * 1.5;
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const requestLines = doc.splitTextToSize(order.specialRequest, doc.internal.pageSize.width - 40);
        doc.text(requestLines, 105, currentY, { align: 'center' });
        
        currentY += (detailsLineHeight * requestLines.length) + 2;
    
        // Reset styles
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
    }

    currentY += 5; // Padding before table


    // Table
    const tableColumn = isKot 
        ? ["Item Name", "Quantity"] 
        : ["Item Name", "Price", "Qty", "Amount"];
    
    const tableRows = order.items.map(item => isKot 
        ? [item.name, item.quantity] 
        : [item.name, item.price.toFixed(2), item.quantity, (item.price * item.quantity).toFixed(2)]
    );

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] }
    });

    if (!isKot) {
        let finalY = doc.autoTable.previous.finalY;
        const rightAlign = doc.internal.pageSize.getWidth() - 14;

        doc.setFontSize(10);
        doc.text('Subtotal:', rightAlign - 30, finalY + 10);
        doc.text(`Rs. ${order.subtotal.toFixed(2)}`, rightAlign, finalY + 10, { align: 'right' });
        
        doc.text('GST (5%):', rightAlign - 30, finalY + 15);
        doc.text(`Rs. ${order.tax.toFixed(2)}`, rightAlign, finalY + 15, { align: 'right' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Total:', rightAlign - 30, finalY + 25);
        doc.text(`Rs. ${order.total.toFixed(2)}`, rightAlign, finalY + 25, { align: 'right' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        const footerText = order.isNC ? 'This is a complimentary bill. No payment is due.' : 'Thank you for your visit!';
        doc.text(footerText, 105, finalY + 40, { align: 'center' });
        doc.text(`GSTIN: ${RESTAURANT_DETAILS.gstin}`, 105, finalY + 45, { align: 'center' });
    }

    doc.save(fileName);
};


export const generateBillPdf = (order: Order) => {
    generatePdf(order, false);
};

export const generateKotPdf = (order: Order) => {
    generatePdf(order, true);
};
