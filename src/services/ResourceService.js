import APIService from "@/http.js";
const API = new APIService();

export default {
  async getResourceCount (payload) {
    let url = `/api/resources/total`;
    let headers = { "Content-Type": "application/json" };
    let res = await API.post(url, payload, headers);
    return res.data;
  },

  async filterResources (payload) {
    let headers = { "Content-Type": "application/json" };
    let url = `/api/resources/filter`;
    let res = await API.post(url, payload, headers);
    return res.data;
  },

  async getCurrentResources () {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.get(`/api/resources/current`, headers);
    return res.data;
  },

  async addResource (payload) {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.post('/api/admin/resources', payload, headers);
    return res.data;
  },

  async getResourceDetail (id) {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.get(`/api/resources/${id}`, headers);
    return res.data;
  },

  async updateResource (payload) {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.put(`/api/admin/resources/${payload.id}`, payload, headers);
    return res.data;
  },

  async deleteResource (id) {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.delete(`/api/admin/resources/${id}`, headers);
    return res.data;
  },

  async bookmarkResource (payload) {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.post(`/api/bookmarks`, payload, headers);
    return res.data;
  },

  async unbookmarkResource (payload) {
    let headers = { "Content-Type": "application/json-patch+json" };
    let res = await API.delete(`/api/bookmarks`, payload, headers);
    return res.data;
  }
}
