import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonAlert,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import { lockClosedOutline, mailOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import { Redirect, useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { isAuthenticated, login, isLoading } = useAuth();
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage("Por favor, preencha todos os campos");
      setShowAlert(true);
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        history.push("/");
      } else {
        setAlertMessage("Email ou senha incorretos");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setAlertMessage("Erro de conexão. Verifique sua internet e tente novamente.");
      setShowAlert(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <IonPage>
      <IonContent>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <IonIcon icon={lockClosedOutline} style={{ fontSize: "48px", color: "var(--ion-color-primary)" }} />
                <h2 style={{ marginTop: "10px" }}>Comanda</h2>
                <IonText color="medium">
                  <p>Faça login para continuar</p>
                </IonText>
              </div>

              <IonItem>
                <IonInput
                  label="Email"
                  labelPlacement="floating"
                  onIonInput={(e) => setEmail(e.detail.value!)}
                  placeholder="Digite seu email"
                  type="email"
                  value={email}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  label="Senha"
                  labelPlacement="floating"
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  placeholder="Digite sua senha"
                  type={showPassword ? "text" : "password"}
                  value={password}
                />

                <IonButton fill="clear" slot="end" onClick={togglePasswordVisibility}>
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </IonItem>

              <IonButton expand="block" onClick={handleLogin} disabled={isLoading} style={{ marginTop: "20px" }}>
                {isLoading ? (
                  <>
                    <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header="Erro" message={alertMessage} buttons={["OK"]} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
