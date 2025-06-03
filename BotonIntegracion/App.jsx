import React from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import ButtonPago from './ButtonPago';

// Inicializa Mercado Pago con tu public key (¡nunca compartas la private key!)
// initMercadoPago('APP_USR-74dc3ef6-5f94-4462-99f2-137c635aed05');
// initMercadoPago("TEST-5391a271-0364-4c10-8052-913b51831bf7")
initMercadoPago("APP_USR-aa2ecee4-09db-468d-b8f9-dfd171365041")

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Botón de Pago</h1>
      <p>Haz clic en el botón para realizar el pago.</p>

      <ButtonPago
        fecha="2025-06-10"
        horarioInicio="10:00"
        horarioFin="11:00"
        serviceId="68352475a2e4fa2f231c5caa"
        userId="6834f8b7b8b951fe3a19de92"          // ⚠️ Asegurate de que este userId exista en tu base de datos
        animal="683f7e908db36cbeb1c411c4"               // ⚠️ Esto lo usás en metadata
        precio={1500}                // ⚠️ Este es el precio real a cobrar
      />
    </div>
  );
};

export default App;
