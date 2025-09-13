import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface TabsProps {
  title: string;
  dumbString: string;
}

const Tabs: React.FC<TabsProps> = ({ title, dumbString }) => {
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

        <IonCard>
          <IonCardContent>{dumbString}</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tabs;
