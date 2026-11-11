import api from "./api";

export async function getDrivingTests() {
  const response = await api.get("/driving-tests");
  return response.data;
}

export async function createDrivingTest(testData) {
  const response = await api.post("/driving-tests", testData);
  return response.data;
}

export async function cancelDrivingTest(id) {
  const response = await api.put(`/driving-tests/${id}`, {
    status: "cancelled"
  });
  return response.data;
}

export async function scheduleDrivingTest(id, examiner, date) {
  const response = await api.put(`/driving-tests/${id}`, {
    examiner,
    date
  });
  return response.data;
}

export async function submitDrivingTestResult(id, result) {
  const response = await api.put(`/driving-tests/${id}`, {
    result
  });
  return response.data;
}