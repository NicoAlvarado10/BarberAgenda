import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 
import { FaDollarSign } from 'react-icons/fa';
import { FaChartBar } from 'react-icons/fa';

export const ReporteTurnos = ({ turnos }) => {
  const [ganancias, setGanancias] = useState(0);
  const [totalTurnos, setTotalTurnos] = useState(0);

  useEffect(() => {
    const calcularReporte = () => {
      const turnosFiltrados = turnos.filter(turno => turno.completado);
      const totalGanancias = turnosFiltrados.length * 6000;

      // Obtener el mes actual para el corte mensual
      const mesActual = new Date().getMonth() + 1; // Enero es 0
      const turnosDelMes = turnosFiltrados.filter(turno => {
        const fechaTurno = new Date(turno.fecha);
        return fechaTurno.getMonth() + 1 === mesActual;
      });

      setGanancias(totalGanancias);
      setTotalTurnos(turnosDelMes.length);
    };

    calcularReporte();
  }, [turnos]); // Dependencia en turnos

  return (
    <div className="reporte">
      <h2 style={{ display: 'flex', alignItems:'center', gap:'5px' }}>Reporte <FaChartBar color='#007bff' /></h2>
      <p>Turnos completados: {totalTurnos}</p>
      <p >Ganancias del mes: <FaDollarSign color="green" />{ganancias.toLocaleString()}</p>
    </div>
  );
};

// Define PropTypes para el componente
ReporteTurnos.propTypes = {
  turnos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      hora: PropTypes.string.isRequired,
      completado: PropTypes.bool.isRequired,
    })
  ).isRequired,
};
