import "server-only";
import { Document, Page, View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, fontFamily: "Helvetica", color: "#0B0F19" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  brand: { fontSize: 16, fontWeight: 700, color: "#0B0F19" },
  brandSub: { fontSize: 8, color: "#5B6472", marginTop: 2 },
  docTitle: { fontSize: 13, fontWeight: 700, color: "#6D28D9", textAlign: "right" },
  docNumber: { fontSize: 9, color: "#5B6472", textAlign: "right", marginTop: 2 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  metaBlock: { flexDirection: "column" },
  metaLabel: { fontSize: 7.5, color: "#94A0B2", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 9.5, color: "#0B0F19" },
  table: { marginTop: 10, borderTop: "1 solid #E5E7EB" },
  tableHeaderRow: { flexDirection: "row", borderBottom: "1 solid #E5E7EB", paddingVertical: 6, backgroundColor: "#F7F8FA" },
  tableRow: { flexDirection: "row", borderBottom: "0.5 solid #EEF0F4", paddingVertical: 7 },
  colItem: { width: "40%", paddingHorizontal: 4 },
  colQty: { width: "12%", paddingHorizontal: 4, textAlign: "center" },
  colPrice: { width: "22%", paddingHorizontal: 4, textAlign: "right" },
  colAmount: { width: "26%", paddingHorizontal: 4, textAlign: "right" },
  thText: { fontSize: 7.5, color: "#5B6472", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 },
  itemLabel: { fontSize: 9.5, fontWeight: 700 },
  itemDesc: { fontSize: 8, color: "#5B6472", marginTop: 1.5 },
  totalsBlock: { marginTop: 16, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 220, justifyContent: "space-between", paddingVertical: 3 },
  totalsLabel: { fontSize: 9, color: "#5B6472" },
  totalsValue: { fontSize: 9, color: "#0B0F19" },
  grandRow: { flexDirection: "row", width: 220, justifyContent: "space-between", paddingVertical: 6, marginTop: 4, borderTop: "1 solid #0B0F19" },
  grandLabel: { fontSize: 11, fontWeight: 700 },
  grandValue: { fontSize: 11, fontWeight: 700 },
  depositBox: { marginTop: 18, padding: 12, backgroundColor: "#F7F8FA", borderRadius: 6, flexDirection: "row", justifyContent: "space-between" },
  depositCol: { flexDirection: "column" },
  paySection: { marginTop: 24, padding: 16, borderRadius: 8, backgroundColor: "#6D28D9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  payText: { color: "#FFFFFF" },
  payTitle: { fontSize: 11, fontWeight: 700 },
  payLink: { fontSize: 8, marginTop: 4, color: "#E9D5FF" },
  payButton: { backgroundColor: "#FFFFFF", color: "#6D28D9", fontSize: 10, fontWeight: 700, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 4 },
  qr: { width: 56, height: 56, marginLeft: 12 },
  footerBlock: { marginTop: 20 },
  footerLabel: { fontSize: 7.5, color: "#94A0B2", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 },
  footerText: { fontSize: 8.5, color: "#5B6472", lineHeight: 1.5 },
  pageFooter: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 7.5, color: "#94A0B2", textAlign: "center", borderTop: "0.5 solid #EEF0F4", paddingTop: 8 },
});

const TITLE_MAP: Record<string, string> = { QUOTE: "QUOTATION", PROFORMA: "PROFORMA INVOICE", INVOICE: "TAX INVOICE" };

export interface DocumentPdfProps {
  type: string;
  number: string;
  createdAt: Date;
  validUntil: Date | null;
  company: { name: string; phone: string | null; email: string | null };
  contactName: string | null;
  items: { label: string; description: string | null; quantity: number; unitPrice: number; amount: number }[];
  subtotal: number;
  discount: number;
  taxLabel: string;
  taxMode: string;
  taxAmount: number;
  total: number;
  depositRequired: number;
  balance: number;
  paymentTermsLabel: string;
  notes: string | null;
  terms: string | null;
  paymentUrl?: string;
  qrDataUrl?: string;
}

function kes(n: number): string {
  return `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n)}`;
}

export function DocumentPdf(p: DocumentPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>TECHFIND CONSULTING LIMITED</Text>
            <Text style={styles.brandSub}>Nairobi, Kenya · techfind.co.ke</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>{TITLE_MAP[p.type] ?? p.type}</Text>
            <Text style={styles.docNumber}>{p.number}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Client</Text>
            <Text style={styles.metaValue}>{p.company.name}</Text>
            {p.contactName && <Text style={styles.metaValue}>{p.contactName}</Text>}
            {p.company.phone && <Text style={styles.metaValue}>{p.company.phone}</Text>}
            {p.company.email && <Text style={styles.metaValue}>{p.company.email}</Text>}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{p.createdAt.toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</Text>
          </View>
          {p.validUntil && (
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Valid Until</Text>
              <Text style={styles.metaValue}>{p.validUntil.toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</Text>
            </View>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colItem, styles.thText]}>Item</Text>
            <Text style={[styles.colQty, styles.thText]}>Qty</Text>
            <Text style={[styles.colPrice, styles.thText]}>Unit Price</Text>
            <Text style={[styles.colAmount, styles.thText]}>Amount</Text>
          </View>
          {p.items.map((it, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colItem}>
                <Text style={styles.itemLabel}>{it.label}</Text>
                {it.description && <Text style={styles.itemDesc}>{it.description}</Text>}
              </View>
              <Text style={styles.colQty}>{it.quantity}</Text>
              <Text style={styles.colPrice}>{kes(it.unitPrice)}</Text>
              <Text style={styles.colAmount}>{kes(it.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{kes(p.subtotal)}</Text>
          </View>
          {p.discount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Discount</Text>
              <Text style={styles.totalsValue}>-{kes(p.discount)}</Text>
            </View>
          )}
          {p.taxMode !== "NONE" && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>{p.taxLabel} {p.taxMode === "INCLUSIVE" ? "(incl.)" : ""}</Text>
              <Text style={styles.totalsValue}>{kes(p.taxAmount)}</Text>
            </View>
          )}
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>TOTAL</Text>
            <Text style={styles.grandValue}>{kes(p.total)}</Text>
          </View>
        </View>

        {p.depositRequired > 0 && p.depositRequired < p.total && (
          <View style={styles.depositBox}>
            <View style={styles.depositCol}>
              <Text style={styles.footerLabel}>Deposit Required</Text>
              <Text style={styles.metaValue}>{kes(p.depositRequired)}</Text>
            </View>
            <View style={styles.depositCol}>
              <Text style={styles.footerLabel}>Balance</Text>
              <Text style={styles.metaValue}>{kes(p.balance)}</Text>
            </View>
            <View style={styles.depositCol}>
              <Text style={styles.footerLabel}>Payment Terms</Text>
              <Text style={styles.metaValue}>{p.paymentTermsLabel}</Text>
            </View>
          </View>
        )}

        {p.paymentUrl && (
          <View style={styles.paySection}>
            <View style={styles.payText}>
              <Text style={styles.payTitle}>Pay securely online</Text>
              <Text style={styles.payLink}>{p.paymentUrl}</Text>
            </View>
            {p.qrDataUrl && <Image src={p.qrDataUrl} style={styles.qr} />}
          </View>
        )}

        {p.notes && (
          <View style={styles.footerBlock}>
            <Text style={styles.footerLabel}>Notes</Text>
            <Text style={styles.footerText}>{p.notes}</Text>
          </View>
        )}
        {p.terms && (
          <View style={styles.footerBlock}>
            <Text style={styles.footerLabel}>Terms</Text>
            <Text style={styles.footerText}>{p.terms}</Text>
          </View>
        )}

        <Text style={styles.pageFooter}>Techfind Consulting Limited · This document was generated by Techfind Revenue OS</Text>
      </Page>
    </Document>
  );
}
