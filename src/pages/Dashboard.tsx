import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface DashboardProps {
  teste: string;
}

const Dashboard: React.FC<DashboardProps> = ({ teste }) => {
  const title = "Dashboard";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Repetindo header dentro do conteúdo, para renderização ios */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div id="container">
          <strong>Bem vindo</strong>
          <p>Selecione uma opção no menu lateral</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
