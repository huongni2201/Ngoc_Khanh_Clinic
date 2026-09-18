export interface InvoiceItem {
  id: string;
  serviceCode: string;
  serviceName: string;
  roomCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProvisionalInvoice {
  invoiceCode: string;
  encounterCode: string;
  patientCode: string;
  patientName: string;
  issuedAt: string;
  cashierName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: "UNPAID" | "PAID";
  paymentMethod?: "CASH" | "VIETQR" | "CARD";
  vietQR: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    transferContent: string;
    qrImageUrl: string;
  };
}
