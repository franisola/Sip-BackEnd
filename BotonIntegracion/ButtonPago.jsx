import React, { useState } from 'react';
import { Wallet } from '@mercadopago/sdk-react';

const ButtonPago = ({ fecha, horarioInicio, horarioFin, serviceId, userId, animal, precio }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!fecha || !horarioInicio || !horarioFin || !serviceId || !userId) {
      alert('Faltan datos para procesar el pago.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha,
          horarioInicio,
          horarioFin,
          serviceId,
          userId,
          animal,
          precio,
        }),
      });

      const data = await response.json();

      if (data.preferenceId) {
        setPreferenceId(data.preferenceId);
      } else {
        alert('No se pudo generar la preferencia de pago.');
      }
    } catch (error) {
      console.error('Error al generar la preferencia:', error);
      alert('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!preferenceId ? (
        <button
          onClick={handleClick}
          disabled={loading}
          style={{
            backgroundColor: '#009EE3',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Cargando...' : 'Pagar con Mercado Pago'}
        </button>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Wallet initialization={{ preferenceId }} />
        </div>
      )}
    </div>
  );
};

export default ButtonPago;
