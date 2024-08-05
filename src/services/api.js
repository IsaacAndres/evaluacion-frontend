import axios from "axios";

const instance = axios.create({
    baseURL: `${process.env.API_BASE_URL}/api`
})

export const getRegiones = () => instance.get('/regiones')
export const getProvincias = (regionId) => instance.get(`/provincias?region_id=${regionId}`);
export const getCiudades = (provinciaId) => instance.get(`/ciudades?provincia_id=${provinciaId}`);
export const getCalles = () => instance.get('/calles');
export const createCalle = (calle) => instance.post('/calles', calle);
export const updateCalle = (id, calle) => instance.put(`/calles/${id}`, calle);
export const deleteCalle = (id) => instance.delete(`/calles/${id}`);