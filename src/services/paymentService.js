import api from "./api";

async function getPayments() {
  const response = await api.get("/payments");
  return response.data;
}

async function createPayment(paymentData) {
  const response = await api.post("/payments", paymentData);
  return response.data;
}

async function updatePayment(id, updateData) {
  const response = await api.put(`/payments/${id}`, updateData);
  return response.data;
}

async function downloadInvoicePdf(invoiceId) {
  const res = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice.pdf`;
  link.click();
}

export { getPayments, createPayment, updatePayment, downloadInvoicePdf };