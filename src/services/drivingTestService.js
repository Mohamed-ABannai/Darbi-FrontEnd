import api from "./api";

async function getDrivingTests() {
  const response = await api.get("/driving-tests");
  return response.data;
}

async function createDrivingTest(testData) {
  const response = await api.post("/driving-tests", testData);
  return response.data;
}

async function cancelDrivingTest(id) {
  const response = await api.put(`/driving-tests/${id}`);
  return response.data;
}

export { getDrivingTests, createDrivingTest, cancelDrivingTest };