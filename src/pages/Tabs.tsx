import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSpinner,
  IonAlert,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { add, eye, trash, checkmarkCircle } from "ionicons/icons";
import { Tab } from "../types/tab";
import { tabService } from "../services/tabService";
import TabForm from "../components/TabForm";
import { useHistory } from "react-router-dom";

const TabsPage: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<Tab | null>(null);
  const [error, setError] = useState<string>("");
  const history = useHistory();

  const loadTabs = async () => {
    try {
      setLoading(true);
      setError("");
      const tabsData = await tabService.getTabs();
      setTabs(tabsData);
    } catch (err) {
      console.error("Erro ao carregar comandas:", err);
      setError("Erro ao carregar comandas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabs();
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    await loadTabs();
    event.detail.complete();
  };

  const handleCreateTab = () => {
    setShowForm(true);
  };

  const handleViewTab = (tab: Tab) => {
    history.push(`/tabs/${tab.id}`);
  };

  const handleDeleteTab = (tab: Tab) => {
    setTabToDelete(tab);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!tabToDelete) return;

    try {
      await tabService.deleteTab(tabToDelete.id);
      await loadTabs();
      setShowDeleteAlert(false);
      setTabToDelete(null);
    } catch (err) {
      console.error("Erro ao deletar comanda:", err);
      setError("Erro ao deletar comanda");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async () => {
    await loadTabs();
    setShowForm(false);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showForm) {
    return <TabForm onClose={handleFormClose} onSubmit={handleFormSubmit} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>Comandas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton onClick={loadTabs}>Tentar Novamente</IonButton>
          </div>
        ) : tabs.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <IonText color="medium">
              <p>Nenhuma comanda encontrada</p>
            </IonText>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {tabs.map((tab, index) => (
                <IonCol size="12" size-md="6" size-lg="4" key={index}>
                  <IonCard>
                    <div
                      style={{
                        padding: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: tab.is_closed ? "var(--ion-color-success-contrast)" : "var(--ion-color-primary-contrast)",
                        backgroundColor: tab.is_closed ? "var(--ion-color-success)" : "var(--ion-color-primary)",
                      }}
                    >
                      {tab.is_closed ? "Encerrada" : "Aberta"}
                    </div>
                    <IonCardHeader>
                      <IonCardTitle>{tab.client_name}</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                      <IonList>
                        <IonItem>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <IonLabel>Itens</IonLabel>
                            <IonLabel>{tab.total_items}</IonLabel>
                          </div>
                        </IonItem>
                        <IonItem>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: "var(--ion-color-primary)",
                            }}
                          >
                            <IonLabel>Total</IonLabel>
                            <IonLabel>{formatPrice(tab.total_value)}</IonLabel>
                          </div>
                        </IonItem>
                        <IonItem>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: "var(--ion-color-success)",
                            }}
                          >
                            <IonLabel>Pago</IonLabel>
                            <IonLabel>{formatPrice(tab.total_paid)}</IonLabel>
                          </div>
                        </IonItem>
                        <IonItem>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: tab.remaining_amount > 0 ? "var(--ion-color-warning)" : "var(--ion-color-success)",
                            }}
                          >
                            <IonLabel>Restante</IonLabel>
                            <IonLabel>{formatPrice(tab.remaining_amount)}</IonLabel>
                          </div>
                        </IonItem>
                      </IonList>
                    </IonCardContent>

                    <IonButton fill="outline" expand="block" onClick={() => handleViewTab(tab)}>
                      <IonIcon icon={eye} slot="start" />
                      Ver
                    </IonButton>

                    {!tab.is_closed && (
                      <IonButton fill="outline" expand="block" color="danger" onClick={() => handleDeleteTab(tab)}>
                        <IonIcon icon={trash} slot="start" />
                        Excluir
                      </IonButton>
                    )}

                    <div
                      style={{
                        padding: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "var(--ion-color-medium)",
                        color: "var(--ion-color-medium-contrast)",
                      }}
                    >
                      {tab.is_closed && tab.closed_at ? `Encerrada em: ${formatDate(tab.closed_at)}` : `Criada em: ${formatDate(tab.created_at)}`}
                    </div>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleCreateTab}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a comanda de "${tabToDelete?.client_name}"?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Excluir",
              role: "destructive",
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default TabsPage;
