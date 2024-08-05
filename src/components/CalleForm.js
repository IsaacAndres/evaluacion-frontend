import { useEffect, useState } from "react";
import { getRegiones, getProvincias, getCiudades, getCalles, createCalle, updateCalle, deleteCalle } from "../services/api";

const CalleForm = () => {

    const [regiones, setRegiones] = useState([])
    const [provincias, setProvincias] = useState([])
    const [ciudades, setCiudades] = useState([])
    const [calles, setCalles] = useState([])

    const [selectedRegion, setSelectedRegion] = useState('')
    const [selectedProvincia, setSelectedProvincia] = useState('')
    const [selectedCiudad, setSelectedCiudad] = useState('')
    const [selectedCalle, setSelectedCalle] = useState('')
    
    const [CalleName, setCalleName] = useState('')

    const [editingCalle, setEditingCalle] = useState(null)

    const [searchCalle, setSearchCalle] = useState('')
    const [searchRegion, setSearchRegion] = useState('')
    const [searchProvincia, setSearchProvincia] = useState('')
    const [searchCiudad, setSearchCiudad] = useState('')

    const [callesFilter, setCallesFilter] = useState([])

    useEffect(() => {
        loadRegiones();
        loadCalles();
    }, []);

    const loadRegiones = async () => {
        const response = await getRegiones();
        setRegiones(response.data.data);
    };

    const loadProvincias = async (regionId) => {
        const response = await getProvincias(regionId);
        setProvincias(response.data.data);
    };

    const loadCiudades = async (provinciaId) => {
        const response = await getCiudades(provinciaId);
        setCiudades(response.data.data);
    };

    const loadCalles = async () => {
        const response = await getCalles();
        setCalles(response.data.data);
        setCallesFilter(response.data.data);
    };

    const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
        setProvincias([])
        setCiudades([])
        loadProvincias(e.target.value);
    };

    const handleProvinciaChange = (e) => {
        setSelectedProvincia(e.target.value);
        setCiudades([])
        loadCiudades(e.target.value);
    };

    const handleCiudadChange = (e) => {
        setSelectedCiudad(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const calle = {
            nombre: CalleName,
            ciudad_id: selectedCiudad
        }

        if(editingCalle) {
            await updateCalle(editingCalle.id, calle);
            setEditingCalle(null);
        } else {
            await createCalle(calle);
        }

        setCalleName('')
        setSelectedRegion('')
        setSelectedProvincia('')
        setSelectedCiudad('')
        loadCalles()
    };

    const  handleEditCalle = (calle) => {
        setEditingCalle(calle)

        setCalleName(calle.nombre)
        setSelectedRegion(calle.region.id)
        setSelectedProvincia(calle.provincia.id)
        setSelectedCiudad(calle.ciudad.id)

        loadProvincias(calle.region.id)
        loadCiudades(calle.provincia.id)
    }

    const handleDeleteCalle = async (calleId) => {
        await deleteCalle(calleId);
        loadCalles();
    }

    const handleSearch = () => {
        const filter = calles.filter(calle =>
            (!searchCalle || calle.nombre.toLowerCase().includes(searchCalle.toLowerCase())) &&
            (!searchRegion || calle.region.nombre.toLowerCase().includes(searchRegion.toLowerCase())) &&
            (!searchProvincia || calle.provincia.nombre.toLowerCase().includes(searchProvincia.toLowerCase())) &&
            (!searchCiudad || calle.ciudad.nombre.toLowerCase().includes(searchCiudad.toLowerCase()))
        )

        setCallesFilter(filter)
    }

    useEffect(() => {
        handleSearch();
    }, [searchCalle, searchRegion, searchProvincia, searchCiudad]);
    
    return (
        <div>
            <h3>Mantenedor de calles</h3>
            <hr />
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Región:</label>
                    <select value={selectedRegion} onChange={handleRegionChange}>
                        <option value="">-- Seleccione --</option>
                        {
                            regiones.map(region => (
                                <option key={region.id} value={region.id}>
                                    {region.nombre}
                                </option>)
                            )
                        }
                    </select>
                </div>                
                <div>
                    <label>Provincia:</label>
                    <select value={selectedProvincia} onChange={handleProvinciaChange}>
                        <option value="">-- Seleccione --</option>
                        {
                            provincias.map(provincia => (
                                <option key={provincia.id} value={provincia.id}>
                                    {provincia.nombre}
                                </option>)
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Ciudad:</label>
                    <select value={selectedCiudad} onChange={handleCiudadChange}>
                        <option value="">-- Seleccione --</option>
                        {
                            ciudades.map(ciudad => (
                                <option key={ciudad.id} value={ciudad.id}>
                                    {ciudad.nombre}
                                </option>)
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Calle:</label>
                    <input type="text" value={CalleName} onChange={(e) => setCalleName(e.target.value)}/>
                </div>
                <button type="submit">Guardar</button>
            </form>
            <hr />

            <h4>Busqueda:</h4>
            <div>
                <label>Nombre Calle:</label>
                <input type="text" value={searchCalle} onChange={(e) => setSearchCalle(e.target.value)}/>
            </div>
            <div>
                <label>Nombre Región:</label>
                <input type="text" value={searchRegion} onChange={(e) => setSearchRegion(e.target.value)}/>
            </div>
            <div>
                <label>Nombre Provincia:</label>
                <input type="text" value={searchProvincia} onChange={(e) => setSearchProvincia(e.target.value)}/>
            </div>
            <div>
                <label>Nombre Ciudad:</label>
                <input type="text" value={searchCiudad} onChange={(e) => setSearchCiudad(e.target.value)}/>
            </div>
            <hr />
            
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Región</th>
                        <th>Provincia</th>
                        <th>Ciudad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        callesFilter.map(calle => (
                            <tr key={calle.id}>
                                <td>{calle.nombre}</td>
                                <td>{calle.region.nombre}</td>
                                <td>{calle.provincia.nombre}</td>
                                <td>{calle.ciudad.nombre}</td>
                                <td>
                                    <button onClick={() => handleEditCalle(calle)}>Editar</button> &nbsp;
                                    <button onClick={() => handleDeleteCalle(calle.id)}>Eliminar</button>
                                </td>
                            </tr>)
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CalleForm;