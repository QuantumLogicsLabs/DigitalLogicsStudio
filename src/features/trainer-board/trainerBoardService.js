import apiClient from "../../shared/services/apiClient";

// Mirrors the pattern used by authService/progressService: thin wrapper
// around apiClient, one function per endpoint, returns response.data.
const trainerBoardService = {
  // POST /api/trainer-board/circuits — create a new saved circuit
  saveCircuit: async ({ name, wires, placedICs, switches, clkHz, clkOn }) => {
    const { data } = await apiClient.post("/trainer-board/circuits", {
      name,
      wires,
      placedICs,
      switches,
      clkHz,
      clkOn,
    });
    return data;
  },

  // PUT /api/trainer-board/circuits/:id — overwrite an existing saved circuit
  updateCircuit: async (id, { name, wires, placedICs, switches, clkHz, clkOn }) => {
    const { data } = await apiClient.put(`/trainer-board/circuits/${id}`, {
      name,
      wires,
      placedICs,
      switches,
      clkHz,
      clkOn,
    });
    return data;
  },

  // GET /api/trainer-board/circuits — list the current user's saved circuits
  listCircuits: async () => {
    const { data } = await apiClient.get("/trainer-board/circuits");
    return data;
  },

  // GET /api/trainer-board/circuits/:id — fetch one saved circuit
  getCircuit: async (id) => {
    const { data } = await apiClient.get(`/trainer-board/circuits/${id}`);
    return data;
  },

  // DELETE /api/trainer-board/circuits/:id
  deleteCircuit: async (id) => {
    const { data } = await apiClient.delete(`/trainer-board/circuits/${id}`);
    return data;
  },
};

export default trainerBoardService;
