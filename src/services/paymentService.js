import api from "./api";

export async function getPayments() {
  const response = await api.get("/payments");
  return response.data;
}

export async function createPayment(paymentData) {
  const response = await api.post("/payments", paymentData);
  return response.data;
}

export async function updatePayment(id, updateData) {
  const response = await api.put(`/payments/${id}`, updateData);
  return response.data;
}

export async function downloadInvoicePdf(invoiceId) {
  const response = await api.get(`/invoices/${invoiceId}/pdf`, {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(response.data);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${invoiceId}.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}