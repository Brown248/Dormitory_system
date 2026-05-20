const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ==========================================
// Data Mappers (snake_case <-> camelCase)
// ==========================================

export function mapDormRoomToClient(r: any) {
  return {
    number: r.number,
    floor: r.floor,
    rate: r.rate,
    tenant: r.tenant || "",
    waterMeter: r.water_meter || 0,
    electricityMeter: r.electricity_meter || 0,
    waterCost: r.water_cost || 0,
    electricCost: r.electric_cost || 0,
    cleaningFee: r.cleaning_fee || 0,
    otherFee: r.other_fee || 0,
    lateDays: r.late_days || 0,
    fineCost: r.fine_cost || 0,
    paymentStatus: r.payment_status || "pending",
    paymentDate: r.payment_date || "",
    remark: r.remark || "",
    moveOut: r.move_out || "",
    vacant: r.vacant || "",
    dormKey: r.dorm_key,
  };
}

export function mapDormRoomToServer(r: any) {
  return {
    dorm_key: r.dormKey || r.dorm_key,
    number: r.number,
    floor: r.floor,
    rate: r.rate,
    tenant: r.tenant,
    water_meter: r.waterMeter,
    electricity_meter: r.electricityMeter,
    water_cost: r.waterCost,
    electric_cost: r.electricCost,
    cleaning_fee: r.cleaningFee,
    other_fee: r.otherFee,
    late_days: r.lateDays,
    fine_cost: r.fineCost,
    payment_status: r.paymentStatus,
    payment_date: r.paymentDate,
    remark: r.remark,
    move_out: r.moveOut,
    vacant: r.vacant,
  };
}

export function mapGarageJobToClient(j: any) {
  return {
    id: String(j.id),
    customerName: j.customer_name,
    licensePlate: j.license_plate,
    carModel: j.car_model,
    description: j.description,
    status: j.status,
    totalCost: j.total_cost || 0,
    paymentStatus: j.payment_status || "unpaid",
    createdAt: j.created_at,
    finishedAt: j.finished_at || undefined,
  };
}

export function mapGarageJobToServer(j: any) {
  return {
    customer_name: j.customerName,
    license_plate: j.licensePlate,
    car_model: j.carModel,
    description: j.description,
    status: j.status,
    total_cost: j.totalCost,
    payment_status: j.paymentStatus,
    finished_at: j.finishedAt,
  };
}

export function mapRentalHouseToClient(h: any) {
  return {
    id: h.id,
    name: h.name,
    tenantName: h.tenant_name || "",
    monthlyRent: h.monthly_rent || 0,
    waterBill: h.water_bill || 0,
    electricBill: h.electric_bill || 0,
    paymentStatus: h.payment_status || "unpaid",
    lastPaymentDate: h.last_payment_date || "",
  };
}

export function mapRentalHouseToServer(h: any) {
  return {
    name: h.name,
    tenant_name: h.tenantName,
    monthly_rent: h.monthlyRent,
    water_bill: h.waterBill,
    electric_bill: h.electricBill,
    payment_status: h.paymentStatus,
    last_payment_date: h.lastPaymentDate,
  };
}

// ==========================================
// API Operations
// ==========================================

export async function fetchUnits() {
  const res = await fetch(`${API_BASE_URL}/units/`);
  return res.json();
}

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE_URL}/customers/`);
  return res.json();
}

export async function fetchInvoices() {
  const res = await fetch(`${API_BASE_URL}/invoices/`);
  return res.json();
}

export async function createInvoice(invoice: any) {
  const res = await fetch(`${API_BASE_URL}/invoices/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
  return res.json();
}

export async function updateInvoiceStatus(invoiceId: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/status?status=${status}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE_URL}/transactions/`);
  return res.json();
}

export async function fetchTransactionSummary() {
  const res = await fetch(`${API_BASE_URL}/transactions/summary`);
  return res.json();
}

export async function createTransaction(transaction: any) {
  const res = await fetch(`${API_BASE_URL}/transactions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  return res.json();
}

// Dormitory APIs
export async function fetchDormRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms/`);
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map(mapDormRoomToClient);
  }
  return [];
}

export async function updateDormRoom(dormKey: string, number: string, room: any) {
  const serverPayload = mapDormRoomToServer(room);
  const res = await fetch(`${API_BASE_URL}/rooms/${dormKey}/${number}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serverPayload),
  });
  const data = await res.json();
  return mapDormRoomToClient(data);
}

export async function rolloverDormRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms/rollover/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function resetDormRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms/reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

// Garage APIs
export async function fetchGarageJobs() {
  const res = await fetch(`${API_BASE_URL}/garage/jobs/`);
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map(mapGarageJobToClient);
  }
  return [];
}

export async function createGarageJob(job: any) {
  const serverPayload = mapGarageJobToServer(job);
  const res = await fetch(`${API_BASE_URL}/garage/jobs/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serverPayload),
  });
  const data = await res.json();
  return mapGarageJobToClient(data);
}

export async function updateGarageJob(jobId: number, job: any) {
  const serverPayload = mapGarageJobToServer(job);
  const res = await fetch(`${API_BASE_URL}/garage/jobs/${jobId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serverPayload),
  });
  const data = await res.json();
  return mapGarageJobToClient(data);
}

export async function deleteGarageJob(jobId: number) {
  const res = await fetch(`${API_BASE_URL}/garage/jobs/${jobId}/`, {
    method: 'DELETE',
  });
  return res.json();
}

// House APIs
export async function fetchRentalHouses() {
  const res = await fetch(`${API_BASE_URL}/houses/`);
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map(mapRentalHouseToClient);
  }
  return [];
}

export async function updateRentalHouse(houseId: string, house: any) {
  const serverPayload = mapRentalHouseToServer(house);
  const res = await fetch(`${API_BASE_URL}/houses/${houseId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serverPayload),
  });
  const data = await res.json();
  return mapRentalHouseToClient(data);
}
