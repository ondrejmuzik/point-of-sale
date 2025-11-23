import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { generateSPAYD, paymentConfig } from '../constants/payment';

const PaymentQRCode = ({ amount, orderNumber, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && amount > 0) {
      const spaydString = generateSPAYD(amount, orderNumber);

      QRCode.toCanvas(
        canvasRef.current,
        spaydString,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) {
            console.error('Error generating QR code:', error);
          }
        }
      );
    }
  }, [amount, orderNumber]);

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-success">
          <p className="modal-card-title has-text-white">
            Platba QR kódem
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body has-text-centered">
          <div className="mb-4">
            <h3 className="title is-4">Objednávka #{orderNumber}</h3>
            <p className="title is-2 has-text-success">{amount.toFixed(0)},-</p>
          </div>

          <div className="box has-background-light" style={{ display: 'inline-block', padding: '1rem' }}>
            <canvas ref={canvasRef}></canvas>
          </div>

          <div className="content mt-4">
            {/* <p className="has-text-grey">
              Naskenujte QR kód v mobilní aplikaci vaší banky pro okamžitou platbu.
            </p> */}
            <div className="box has-background-white-ter">
              <p><strong>Částka:</strong> {amount.toFixed(0)},- Kč</p>
              <p><strong>Variabilní symbol:</strong> {orderNumber}</p>
              <p><strong>Příjemce:</strong> {paymentConfig.beneficiary}</p>
            </div>
          </div>
        </section>

        <footer className="modal-card-foot" style={{ justifyContent: 'center' }}>
          <button onClick={onClose} className="button is-success is-large">
            Zavřít
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentQRCode;
