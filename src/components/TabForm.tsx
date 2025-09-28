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
  IonSpinner,
  IonAlert,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { TabFormData } from "../types/tab";
import { tabService } from "../services/tabService";

interface TabFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

const TabForm: React.FC<TabFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TabFormData>({
    client_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleInputChange = (field: keyof TabFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.client_name.trim()) {
      setAlertMessage("Nome do cliente é obrigatório");
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

      const tabData = {
        client_name: formData.client_name.trim(),
      };

      await tabService.createTab(tabData);
      onSubmit();
    } catch (err) {
      console.error("Erro ao criar comanda:", err);
      setError(err instanceof Error ? err.message : "Erro ao criar comanda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs" />
          </IonButtons>
          <IonTitle>Nova Comanda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Nome do Cliente *</IonLabel>
              <IonInput
                value={formData.client_name}
                onIonInput={(e) => handleInputChange("client_name", e.detail.value!)}
                placeholder="Digite o nome do cliente"
                required
              />
            </IonItem>

            {error && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                <IonLabel color="danger">{error}</IonLabel>
              </div>
            )}

            <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                  Criando...
                </>
              ) : (
                "Criar comanda"
              )}
            </IonButton>

            <IonButton expand="block" fill="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header="Validação" message={alertMessage} buttons={["OK"]} />
      </IonContent>
    </IonPage>
  );
};

export default TabForm;
