import './App.css';
import { ReporteTurnos } from './ReporteTurnos';
import { useState, useEffect } from 'react';
import { db } from './Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; 

export const App = () => {
  const [turnos, setTurnos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [turnoId, setTurnoId] = useState(null);

  const validarCampos = () => {
    if (!nombre.trim() || !apellido.trim() || !fecha || !hora) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos antes de agendar un turno.',
      });
      return false;
    }
    return true;
  };

  const agregarTurno = async () => {
    if (!validarCampos()) return; // Valida los campos antes de proceder
    try {
      const nuevoTurno = { nombre, apellido, fecha, hora, completado: false };
      await addDoc(collection(db, 'turnos'), nuevoTurno);
      obtenerTurnos(); // Actualiza la lista de turnos
      limpiarCampos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar el turno.',
      });
      console.error('Error al agregar turno:', error);
    }
  };

  const obtenerTurnos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'turnos'));
      const turnosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTurnos(turnosData);
    } catch (error) {
      console.error('Error al obtener turnos:', error);
    }
  };

  const eliminarTurno = async (id) => {
    try {
      await deleteDoc(doc(db, 'turnos', id));
      obtenerTurnos(); // Actualiza la lista de turnos
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar el turno.',
      });
      console.error('Error al eliminar turno:', error);
    }
  };

  const editarTurno = async () => {
    if (!validarCampos()) return; // Valida los campos antes de proceder
    try {
      const turnoRef = doc(db, 'turnos', turnoId);
      await updateDoc(turnoRef, { nombre, apellido, fecha, hora });
      obtenerTurnos(); // Actualiza la lista de turnos
      limpiarCampos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al editar el turno.',
      });
      console.error('Error al editar turno:', error);
    }
  };

  const marcarComoCompletado = async (id, estadoActual) => {
    try {
      const turnoRef = doc(db, 'turnos', id);
      await updateDoc(turnoRef, { completado: !estadoActual }); // Alterna el estado
      obtenerTurnos(); // Actualiza la lista de turnos
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el estado del turno.',
      });
      console.error('Error al marcar como completado:', error);
    }
  };

  const limpiarCampos = () => {
    setNombre('');
    setApellido('');
    setFecha('');
    setHora('');
    setTurnoId(null);
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  return (
    <main>
      <h1>BarberAgenda✂️</h1>
      <section className='app'>
        <form onSubmit={(e) => { e.preventDefault(); }}> {/* Agregar preventDefault */}
          <label>Nombre:
            <input
              type="text"
              placeholder="Juan"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          <label>
            Apellido
            <input
              type="text"
              placeholder="Alvarez"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </label>

          <label>Día:
            <input className='valores'
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </label>

          <label>Hora:
            <input className='valores'
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </label>

          <button onClick={turnoId ? editarTurno : agregarTurno}>
            {turnoId ? 'Editar Turno' : 'Agendar Turno'}
          </button>
        </form>
        <ReporteTurnos turnos={turnos} /> {/* Pasar turnos como props */}
      </section>

      <section className='turnos'>
        <h2>Turnos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id} >
                <td style={{ textDecoration: turno.completado ? 'line-through' : 'none' }}>{turno.nombre}</td>
                <td style={{ textDecoration: turno.completado ? 'line-through' : 'none' }}>{turno.apellido}</td>
                <td style={{ textDecoration: turno.completado ? 'line-through' : 'none' }}>{turno.fecha}</td>
                <td style={{ textDecoration: turno.completado ? 'line-through' : 'none' }}>{turno.hora}</td>
                <td  className='acciones'>
                  <button onClick={() => { 
                      setTurnoId(turno.id); 
                      setNombre(turno.nombre); 
                      setApellido(turno.apellido); 
                      setFecha(turno.fecha); 
                      setHora(turno.hora); 
                  }}>
                    📝
                  </button>

                  <button onClick={() => eliminarTurno(turno.id)}>🗑️</button>

                  <button onClick={() => marcarComoCompletado(turno.id, turno.completado)}>
                    {turno.completado ? '❌' : '✅'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};
