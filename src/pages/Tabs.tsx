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
  IonChip,
  IonBadge,
  IonButtons,
  IonMenuButton,
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
              {tabs.map((tab) => (
                <IonCol size="12" size-md="6" size-lg="4" key={tab.id}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{tab.client_name}</IonCardTitle>
                      <IonCardSubtitle>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <IonChip color={tab.is_closed ? "success" : "primary"}>{tab.is_closed ? "Encerrada" : "Aberta"}</IonChip>
                          {tab.is_closed && tab.closed_at && (
                            <IonText color="medium" style={{ fontSize: "0.8rem" }}>
                              {formatDate(tab.closed_at)}
                            </IonText>
                          )}
                        </div>
                      </IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <IonText color="primary">
                          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{formatPrice(tab.total_value)}</h2>
                        </IonText>
                        <IonBadge color="medium">
                          {tab.total_items} {tab.total_items === 1 ? "item" : "itens"}
                        </IonBadge>
                      </div>

                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <IonText color="success" style={{ fontSize: "0.9rem" }}>
                            <strong>Pago: {formatPrice(tab.total_paid)}</strong>
                          </IonText>
                          <IonText color={tab.remaining_amount > 0 ? "warning" : "success"} style={{ fontSize: "0.9rem" }}>
                            <strong>Restante: {formatPrice(tab.remaining_amount)}</strong>
                          </IonText>
                        </div>
                      </div>

                      <IonText color="medium" style={{ fontSize: "0.9rem" }}>
                        Criada em: {formatDate(tab.created_at)}
                      </IonText>
                    </IonCardContent>

                    <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
                      <IonButton fill="outline" size="small" onClick={() => handleViewTab(tab)}>
                        <IonIcon icon={eye} slot="start" />
                        Ver
                      </IonButton>

                      {!tab.is_closed && (
                        <IonButton fill="outline" color="danger" size="small" onClick={() => handleDeleteTab(tab)}>
                          <IonIcon icon={trash} slot="start" />
                          Excluir
                        </IonButton>
                      )}
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
