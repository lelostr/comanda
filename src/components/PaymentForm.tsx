import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonAlert,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonText,
} from "@ionic/react";
import { PaymentFormData, PAYMENT_METHODS } from "../types/tab";

interface PaymentFormProps {
  remainingAmount: number;
  onClose: () => void;
  onSubmit: (paymentData: PaymentFormData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ remainingAmount, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    payer_name: "",
    payment_value: "",
    payment_method: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.payment_value.trim()) {
      setAlertMessage("Valor do pagamento é obrigatório");
      setShowAlert(true);
      return false;
    }

    const paymentValue = parseFloat(formData.payment_value);
    if (isNaN(paymentValue) || paymentValue <= 0) {
      setAlertMessage("Valor do pagamento deve ser maior que zero");
      setShowAlert(true);
      return false;
    }

    if (paymentValue > remainingAmount) {
      setAlertMessage(`Valor do pagamento não pode exceder o valor restante (${formatPrice(remainingAmount)})`);
      setShowAlert(true);
      return false;
    }

    if (!formData.payment_method) {
      setAlertMessage("Método de pagamento é obrigatório");
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      onSubmit(formData);
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      setError(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs" />
          </IonButtons>
          <IonTitle>Adicionar Pagamento</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardContent>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <IonText color="primary">
                <h3>Valor Restante: {formatPrice(remainingAmount)}</h3>
              </IonText>
            </div>

            <IonItem>
              <IonLabel position="stacked">Nome do Pagador (Opcional)</IonLabel>
              <IonInput
                value={formData.payer_name}
                onIonInput={(e) => handleInputChange("payer_name", e.detail.value!)}
                placeholder="Digite o nome do pagador"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Valor do Pagamento *</IonLabel>
              <IonInput
                type="number"
                value={formData.payment_value}
                onIonInput={(e) => handleInputChange("payment_value", e.detail.value!)}
                placeholder="0,00"
                step="0.01"
                min="0.01"
                max={remainingAmount}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Método de Pagamento *</IonLabel>
              <IonSelect
                value={formData.payment_method}
                onIonChange={(e) => handleInputChange("payment_method", e.detail.value)}
                placeholder="Selecione o método"
                interface="popover"
              >
                {PAYMENT_METHODS.map((method) => (
                  <IonSelectOption key={method} value={method}>
                    {method}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {error && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                <IonText color="danger">{error}</IonText>
              </div>
            )}

            <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
              <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                    Processando...
                  </>
                ) : (
                  "Adicionar Pagamento"
                )}
              </IonButton>

              <IonButton expand="block" fill="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header="Validação" message={alertMessage} buttons={["OK"]} />
      </IonContent>
    </IonPage>
  );
};

export default PaymentForm;
