
import React from 'react';
import { Order, PrintSettings, OrderItem } from '../types';
import { RESTAURANT_DETAILS } from '../constants';

interface PrintLayoutProps {
  order: Order;
  type: 'bill' | 'kot';
  settings: PrintSettings;
}

const RECEIPT_WIDTH = 32; // Characters for 58mm paper

const center = (text: string) => {
  const padding = Math.max(0, Math.floor((RECEIPT_WIDTH - text.length) / 2));
  return ' '.repeat(padding) + text;
};

const spaceBetween = (left: string, right: string) => {
  const padding = Math.max(1, RECEIPT_WIDTH - left.length - right.length);
  return left + ' '.repeat(padding) + right;
};

const formatTimeForPrint = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 === 0 ? 12 : h % 12;
    const formattedMinutes = m < 10 ? '0' + m : m;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const generateReceiptText = (order: Order, type: 'bill' | 'kot', settings: PrintSettings): string => {
  const isKot = type === 'kot';
  let output = '';
  const separator = '-'.repeat(RECEIPT_WIDTH) + '\n';

  // Header
  output += center(RESTAURANT_DETAILS.name) + '\n';
  if (settings.showAddress) {
    RESTAURANT_DETAILS.address.split('\n').forEach(line => {
      output += center(line) + '\n';
    });
  }
  if (settings.showPhone) output += center(`Ph: ${RESTAURANT_DETAILS.phone}`) + '\n';
  if (!isKot && settings.showGstin) output += center(`GSTIN: ${RESTAURANT_DETAILS.gstin}`) + '\n';
  output += separator;

  // Title
  const title = isKot ? 'Kitchen Order Ticket' : (order.isNC ? 'NO CHARGE INVOICE' : 'Tax Invoice');
  output += center(title.toUpperCase()) + '\n';
  if (isKot && order.isNC) {
      output += center('*** NO CHARGE ORDER ***') + '\n';
  }
  output += separator;

  // Order Info
  output += spaceBetween(`ID: ${order.id.slice(-6)}`, `Date: ${order.date.toLocaleDateString()}`) + '\n';
  output += spaceBetween(`Time: ${order.date.toLocaleTimeString()}`, '') + '\n';
  if (settings.showGuestInfo && order.guestName) output += `Guest: ${order.guestName}\n`;
  if (settings.showGuestInfo && order.roomNo) output += `Room: ${order.roomNo}\n`;
  if (settings.showGuestInfo && order.tableNo) output += `Table: ${order.tableNo}\n`;
  if (settings.showStaffInfo && order.staff) output += `Staff: ${order.staff}\n`;
  
  if (isKot && order.serviceTime) {
      const formattedTime = formatTimeForPrint(order.serviceTime);
      output += `SERVICE TIME: ${formattedTime}\n`;
  }
  
  if (isKot && order.specialRequest) {
      output += separator;
      output += center('*** SPECIAL REQUEST ***') + '\n';
      
      const words = order.specialRequest.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
          if (currentLine === '') {
              currentLine = word;
          } else if ((currentLine + ' ' + word).length <= RECEIPT_WIDTH) {
              currentLine += ' ' + word;
          } else {
              lines.push(currentLine);
              currentLine = word;
          }
      }
      if (currentLine) lines.push(currentLine);
      
      lines.forEach(line => {
          output += center(line) + '\n';
      });
  }

  output += separator;

  // Items Header
  if (isKot) {
    output += 'QTY  ITEM\n';
  } else {
    output += 'QTY ITEM                  AMOUNT\n'.slice(0, RECEIPT_WIDTH) + '\n';
  }
  output += separator;

  // Items
  order.items.forEach((item: OrderItem) => {
    if (isKot) {
        const qtyStr = String(item.quantity);
        const qtyPart = (qtyStr).padEnd(5); // e.g. "2    " to match header spacing
        const itemName = item.name;
        const availableWidth = RECEIPT_WIDTH - qtyPart.length;

        const words = itemName.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            if (currentLine === '') {
                currentLine = word;
            } else if ((currentLine + ' ' + word).length <= availableWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine !== '') {
            lines.push(currentLine);
        }

        // First line with quantity
        output += qtyPart + (lines[0] || '') + '\n';

        // Subsequent lines indented
        for (let i = 1; i < lines.length; i++) {
            output += ' '.repeat(qtyPart.length) + lines[i] + '\n';
        }
    } else {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const qtyStr = String(item.quantity);
        const line1Left = `${qtyStr} x ${item.name}`;
        
        if (line1Left.length + itemTotal.length < RECEIPT_WIDTH) {
            output += spaceBetween(line1Left, itemTotal) + '\n';
        } else {
            // Word wrap for long item names
            const availableWidth = RECEIPT_WIDTH - qtyStr.length - 2; // "2 "
            const words = item.name.split(' ');
            let currentLine = `${qtyStr} `;
            words.forEach(word => {
                if ((currentLine + ' ' + word).length > availableWidth) {
                    output += currentLine + '\n';
                    currentLine = '   ' + word; // Indent subsequent lines
                } else {
                    currentLine += (currentLine.endsWith(' ') ? '' : ' ') + word;
                }
            });
            output += spaceBetween(currentLine, itemTotal) + '\n';
        }
    }
  });

  output += separator;
  
  // Totals
  if (!isKot) {
    output += spaceBetween('Subtotal:', `Rs. ${order.subtotal.toFixed(2)}`) + '\n';
    output += spaceBetween('GST @ 5%:', `Rs. ${order.tax.toFixed(2)}`) + '\n';
    output += separator;
    output += spaceBetween('TOTAL:', `Rs. ${order.total.toFixed(2)}`) + '\n';
    output += separator;
  }

  // Footer
  let footerText = isKot ? '--- Please Prepare Items ---' : 'Thank you for your visit!';
  if (order.isNC && !isKot) {
    footerText = '*** COMPLIMENTARY ***';
  }
  output += center(footerText) + '\n';

  return output;
};


export const PrintLayout: React.FC<PrintLayoutProps> = ({ order, type, settings }) => {
  const receiptText = generateReceiptText(order, type, settings);
  
  return (
    <pre style={{ margin: 0, padding: 0, fontFamily: 'monospace', fontSize: '8pt', lineHeight: 1.3, color: 'black', background: 'white' }}>
      {receiptText}
    </pre>
  );
};
