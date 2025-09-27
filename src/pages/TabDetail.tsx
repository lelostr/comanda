import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
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
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonBackButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonModal,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";
import { add, remove, checkmarkCircle, trash } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import { Tab, TabProduct } from "../types/tab";
import { Product } from "../types/product";
import { tabService } from "../services/tabService";
import { productService } from "../services/productService";

const TabDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [tab, setTab] = useState<Tab | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [error, setError] = useState<string>("");

  const loadTab = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      const tabData = await tabService.getTab(id);
      setTab(tabData);
    } catch (err) {
      console.error("Erro ao carregar comanda:", err);
      setError("Erro ao carregar comanda");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  useEffect(() => {
    loadTab();
    loadProducts();
  }, [id]);

  const handleRefresh = async (event: CustomEvent) => {
    await loadTab();
    event.detail.complete();
  };

  const handleAddProduct = async (product: Product, quantity: number = 1) => {
    if (!tab || tab.is_closed) return;

    try {
      await tabService.addProductToTab(tab.id, {
        product_id: product.id,
        quantity: quantity,
      });
      await loadTab();
      setShowProductsModal(false);
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      setError("Erro ao adicionar produto");
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!tab || tab.is_closed) return;

    try {
      await tabService.removeProductFromTab(tab.id, {
        product_id: productId,
      });
      await loadTab();
    } catch (err) {
      console.error("Erro ao remover produto:", err);
      setError("Erro ao remover produto");
    }
  };

  const handleCloseTab = async () => {
    if (!tab || tab.is_closed) return;

    try {
      await tabService.closeTab(tab.id);
      await loadTab();
      setShowCloseAlert(false);
    } catch (err) {
      console.error("Erro ao encerrar comanda:", err);
      setError("Erro ao encerrar comanda");
    }
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

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs" />
            </IonButtons>
            <IonTitle>Carregando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
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
        </IonContent>
      </IonPage>
    );
  }

  if (error || !tab) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs" />
            </IonButtons>
            <IonTitle>Erro</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <IonText color="danger">
              <p>{error || "Comanda não encontrada"}</p>
            </IonText>
            <IonButton onClick={() => history.push("/tabs")}>Voltar</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs" />
          </IonButtons>
          <IonTitle>{tab.client_name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{tab.client_name}</IonCardTitle>
            <IonCardSubtitle>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IonChip color={tab.is_closed ? "success" : "primary"}>
                  {tab.is_closed ? "Encerrada" : "Aberta"}
                </IonChip>
                {tab.is_closed && tab.closed_at && (
                  <IonText color="medium" style={{ fontSize: "0.8rem" }}>
                    Encerrada em: {formatDate(tab.closed_at)}
                  </IonText>
                )}
              </div>
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <IonText color="primary">
                <h2 style={{ margin: 0, fontSize: "1.8rem" }}>{formatPrice(tab.total_value)}</h2>
              </IonText>
              <IonBadge color="medium">
                {tab.total_items} {tab.total_items === 1 ? "item" : "itens"}
              </IonBadge>
            </div>
            
            <IonText color="medium" style={{ fontSize: "0.9rem" }}>
              Criada em: {formatDate(tab.created_at)}
            </IonText>
          </IonCardContent>
        </IonCard>

        {tab.products && tab.products.length > 0 ? (
          <IonGrid>
            <IonRow>
              {tab.products.map((product) => (
                <IonCol size="12" key={product.id}>
                  <IonCard>
                    <IonCardContent>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: "0 0 4px 0" }}>{product.name}</h3>
                          <IonChip color="medium" style={{ fontSize: "0.8rem" }}>
                            {product.category}
                          </IonChip>
                          <div style={{ marginTop: "8px" }}>
                            <IonText color="primary">
                              <strong>{formatPrice(product.subtotal)}</strong>
                            </IonText>
                            <IonText color="medium" style={{ marginLeft: "8px" }}>
                              ({product.quantity}x {formatPrice(product.price)})
                            </IonText>
                          </div>
                        </div>
                        
                        {!tab.is_closed && (
                          <IonButton
                            fill="outline"
                            color="danger"
                            size="small"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <IonIcon icon={remove} />
                          </IonButton>
                        )}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <IonText color="medium">
              <p>Nenhum produto adicionado</p>
            </IonText>
          </div>
        )}

        {!tab.is_closed && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowProductsModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        {!tab.is_closed && tab.total_items > 0 && (
          <div style={{ padding: "16px" }}>
            <IonButton
              expand="block"
              color="success"
              onClick={() => setShowCloseAlert(true)}
            >
              <IonIcon icon={checkmarkCircle} slot="start" />
              Encerrar Comanda
            </IonButton>
          </div>
        )}

        <IonModal isOpen={showProductsModal} onDidDismiss={() => setShowProductsModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Adicionar Produto</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowProductsModal(false)}>Fechar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {products.map((product) => (
                <IonItem key={product.id} button onClick={() => handleAddProduct(product)}>
                  <IonLabel>
                    <h3>{product.name}</h3>
                    <p>{product.category} - {formatPrice(product.price)}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showCloseAlert}
          onDidDismiss={() => setShowCloseAlert(false)}
          header="Encerrar Comanda"
          message={`Tem certeza que deseja encerrar a comanda de "${tab.client_name}"?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Encerrar",
              handler: handleCloseTab,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default TabDetail;
