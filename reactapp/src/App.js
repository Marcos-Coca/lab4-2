import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function App() {
    const [cedula, setCedula] = useState();
    const [personas, setPersonas] = useState([]);

    const handleSearch = () => {
        const cedulaSplit = cedula.split("-");
        fetch(
            `https://corsproxy.io/?https%3A%2F%2Fcompulaboratoriomendez.com%2Flib%2F%3FKey%3DDESARROLLOWEB%26MUN_CED%3D${cedulaSplit[0]}%26SEQ_CED%3D${cedulaSplit[1]}%26VER_CED%3D${cedulaSplit[2]}`
        )
            .then((res) => res.json())
            .then(([response]) => {
                if (!response) {
                    alert("Cedula no encontrada");
                    return;
                }

                const data = {
                    nombres: response.NOMBRES,
                    apellidos: response.APELLIDO1 + " " + (response.APELLIDO2 || ""),
                    fNacimiento: response.FECHA_NAC,
                    sexo: response.SEXO,
                    lugarNacimiento: response.LUGAR_NAC,
                    cedula,
                    telefono: response.TELEFONO,
                    direccion: response.LUGAR_NAC,
                };
                saveData(data);
            });
    };

    const saveData = (data) => {
        const value = {
            nombres: data.nombres,
            apellidos: data.apellidos,
            sexo: data.sexo,
            fechaNacimiento: new Date(data.fNacimiento).toJSON(),
            cedula: data.cedula,
            direccion: data.direccion,
            telefono: data.telefono,
            lugarNacimiento: data.lugarNacimiento,
        }

        setPersonas([...personas, value]);

        fetch("https://localhost:7289/api/Persona", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
        }).then((res) => {
            if (res.status === 200) {
                alert(
                    `${data.nombres} ${data.apellidos} ha sido registrado exitosamente`
                );

            } else {
                alert("Error al registrar");
            }
        });
    }

    useEffect(() => {
        fetch("https://localhost:7289/api/Persona", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
            .then((personas) => {
                setPersonas(personas)
            });
    }, [])



    return (
        <div className="container">
            <form className="row">
                <div className="col-12">
                    <h1 className="my-4 text-center">Personas registradas</h1>
                </div>

                <div className="col-md-8 mx-auto">
                    <div className="form-group">
                        <label htmlFor="cedula">Cedula:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cedula"
                            placeholder="000-0000000-0"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <button
                        className="btn btn-primary btn-block mt-4"
                        type="button"
                        onClick={() => {
                            handleSearch();
                        }}
                    >
                        Agregar
                    </button>
                </div>
            </form>

            <div className="row mt-4">
                <div className="col-12">
                    
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Cedula</th>
                                <th scope="col">Nombres</th>
                                <th scope="col">Apellidos</th>
                                <th scope="col">Sexo</th>
                                <th scope="col">Fecha de nacimiento</th>
                                <th scope="col">Lugar de nacimiento</th>
                                <th scope="col">Telefono</th>
                                <th scope="col">Direccion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map((persona) => (
                                <tr key={persona.cedula}>
                                    <th scope="row">{persona.cedula}</th>
                                    <td>{persona.nombres}</td>
                                    <td>{persona.apellidos}</td>
                                    <td>{persona.sexo}</td>
                                    <td>{persona.fechaNacimiento}</td>
                                    <td>{persona.lugarNacimiento}</td>
                                    <td>{persona.telefono}</td>
                                    <td>{persona.direccion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
        </div>
    );
}
