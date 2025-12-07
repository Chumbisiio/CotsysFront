import api from "./http";

export async function getKits() {
  const resp = await api.get("/kits/get-all-kits");
  return resp.data;
}

export async function createKit(kit: any) {
  const resp = await api.post("/kits/create-kit", kit);
  return resp.data;
}

export async function updateKit(id_kit: number, kit: any) {
  const resp = await api.put(`/kits/${id_kit}/update-kit`, kit);
  return resp.data;
}

export async function deleteKit(id_kit: number) {
  const resp = await api.delete(`/kits/${id_kit}/delete-kit`);
  return resp.data;
}
