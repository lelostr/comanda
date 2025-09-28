import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  IonFooter,
  IonFabList,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonTab,
  IonAvatar,
} from "@ionic/react";
import { add, remove, checkmarkCircle, trash, card, fastFoodSharp } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import { Tab, TabProduct, TabPayment, PaymentFormData } from "../types/tab";
import { Product } from "../types/product";
import { tabService } from "../services/tabService";
import { productService } from "../services/productService";
import PaymentForm from "../components/PaymentForm";

// Cache global para produtos disponíveis (todos os produtos do sistema)
let availableProductsCache: Product[] = [];
let availableProductsCacheTimestamp: number = 0;
const PRODUCTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const TabDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [tab, setTab] = useState<Tab | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState<string>("");

  const loadTab = useCallback(async () => {
    if (!id) return;

    if (tab && tab.id === id) return;

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
  }, [id]);

  useEffect(() => {
    loadTab();
  }, [loadTab]);

  const handleRefresh = async (event: CustomEvent) => {
    await loadTab();
    event.detail.complete();
  };

  const handleAddProduct = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (!tab || tab.is_closed) return;

      try {
        const updatedTab = await tabService.addProductToTab(tab.id, {
          product_id: product.id,
          quantity: quantity,
        });
        setTab(updatedTab); // Atualiza o estado local em vez de recarregar
        setShowProductsModal(false);
      } catch (err) {
        console.error("Erro ao adicionar produto:", err);
        setError("Erro ao adicionar produto");
      }
    },
    [tab]
  );

  const handleRemoveProduct = useCallback(
    async (productId: string) => {
      if (!tab || tab.is_closed) return;

      try {
        const updatedTab = await tabService.removeProductFromTab(tab.id, {
          product_id: productId,
        });
        setTab(updatedTab); // Atualiza o estado local em vez de recarregar
      } catch (err) {
        console.error("Erro ao remover produto:", err);
        setError("Erro ao remover produto");
      }
    },
    [tab]
  );

  const handleCloseTab = useCallback(async () => {
    if (!tab || tab.is_closed) return;

    try {
      const updatedTab = await tabService.closeTab(tab.id);
      setTab(updatedTab); // Atualiza o estado local em vez de recarregar
      setShowCloseAlert(false);
    } catch (err) {
      console.error("Erro ao encerrar comanda:", err);
      setError("Erro ao encerrar comanda");
    }
  }, [tab]);

  const handleAddPayment = useCallback(
    async (paymentData: PaymentFormData) => {
      if (!tab) return;

      try {
        const updatedTab = await tabService.addPaymentToTab(tab.id, {
          payer_name: paymentData.payer_name || undefined,
          payment_value: parseFloat(paymentData.payment_value),
          payment_method: paymentData.payment_method,
        });
        setTab(updatedTab); // Atualiza o estado local em vez de recarregar
        setShowPaymentForm(false);
      } catch (err) {
        console.error("Erro ao adicionar pagamento:", err);
        setError("Erro ao adicionar pagamento");
      }
    },
    [tab]
  );

  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Carrega produtos disponíveis apenas quando o modal é aberto
  const loadAvailableProducts = useCallback(async () => {
    const now = Date.now();

    // Verificar se o cache ainda é válido
    if (availableProductsCache.length > 0 && now - availableProductsCacheTimestamp < PRODUCTS_CACHE_DURATION) {
      setAvailableProducts(availableProductsCache);
      return;
    }

    try {
      const productsData = await productService.getProducts();
      availableProductsCache = productsData;
      availableProductsCacheTimestamp = now;
      setAvailableProducts(productsData);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }, []);

  // Abre o modal de produtos e carrega produtos disponíveis
  const handleOpenProductsModal = useCallback(() => {
    setShowProductsModal(true);
    loadAvailableProducts(); // Carrega produtos disponíveis apenas quando necessário
  }, [loadAvailableProducts]);

  if (showPaymentForm && tab) {
    return <PaymentForm remainingAmount={tab.remaining_amount} onClose={() => setShowPaymentForm(false)} onSubmit={handleAddPayment} />;
  }

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
        <div
          style={{
            padding: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            backgroundColor: tab.is_closed ? "var(--ion-color-success)" : "var(--ion-color-primary)",
          }}
        >
          {tab.is_closed ? "Encerrada" : "Aberta"}
        </div>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonTabs>
          <IonTabBar slot="top">
            <IonTabButton tab="products">
              <IonIcon icon={fastFoodSharp} />
            </IonTabButton>

            <IonTabButton tab="payments">
              <IonIcon icon={card} />
            </IonTabButton>
          </IonTabBar>

          <IonTab tab="products">
            <IonContent>
              <div
                style={{
                  padding: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "var(--ion-color-light)",
                }}
              >
                {tab.products && tab.products.length > 0 ? tab.products.length : "Nenhum"}{" "}
                {tab.products && tab.products.length <= 1 ? "item" : "itens"}
              </div>

              <IonList style={{ margin: "16px" }}>
                {tab.products && tab.products.length > 0 ? (
                  tab.products.map((product, index) => (
                    <IonItemSliding key={index}>
                      <IonItem button={true} lines="none">
                        <IonAvatar aria-hidden="true" slot="start">
                          <img alt="" src="https://picsum.photos/256/256" />
                        </IonAvatar>
                        <IonLabel>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <IonLabel>{product.name}</IonLabel>
                            <IonLabel>{formatPrice(product.price)}</IonLabel>
                          </div>
                          <IonLabel color="medium" style={{ fontSize: "0.8rem" }}>
                            {product.quantity} {product.quantity === 1 ? "item" : "itens"}
                          </IonLabel>
                        </IonLabel>
                      </IonItem>
                      {!tab.is_closed && (
                        <IonItemOptions slot="end">
                          <IonItemOption color="danger" expandable={true} onClick={() => handleRemoveProduct(product.id)}>
                            <IonIcon slot="icon-only" icon={trash}></IonIcon>
                          </IonItemOption>
                        </IonItemOptions>
                      )}
                    </IonItemSliding>
                  ))
                ) : (
                  <IonItem button={true} lines="none">
                    Nenhum produto adicionado
                  </IonItem>
                )}
              </IonList>
            </IonContent>
          </IonTab>

          <IonTab tab="payments">
            <IonContent>
              <div
                style={{
                  padding: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "var(--ion-color-light)",
                }}
              >
                {tab.payments && tab.payments.length > 0 ? tab.payments.length : "Nenhum"}{" "}
                {tab.payments && tab.payments.length <= 1 ? "pagamento" : "pagamentos"}
              </div>

              <IonList style={{ margin: "16px" }}>
                {tab.payments && tab.payments.length > 0 ? (
                  tab.payments.map((payment, index) => (
                    <IonItem key={index} button={true} lines="none">
                      <IonAvatar
                        aria-hidden="true"
                        slot="start"
                        style={{ alignItems: "center", justifyContent: "center", backgroundColor: "var(--ion-color-primary)" }}
                      >
                        <img alt="" src="https://picsum.photos/256/256" />
                      </IonAvatar>
                      <IonLabel>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <IonLabel>{payment.payment_method}</IonLabel>
                          <IonLabel>{formatPrice(payment.payment_value)}</IonLabel>
                        </div>
                        <IonLabel color="medium" style={{ fontSize: "0.8rem" }}>
                          {formatDate(payment.created_at)}
                        </IonLabel>
                      </IonLabel>
                    </IonItem>
                  ))
                ) : (
                  <IonItem button={true} lines="none">
                    Nenhum pagamento adicionado
                  </IonItem>
                )}
              </IonList>
            </IonContent>
          </IonTab>
        </IonTabs>

        {!tab.is_closed && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton>
              <IonIcon icon={add} />
            </IonFabButton>
            <IonFabList side="top">
              {/* Novo produto */}
              <IonFabButton color="success" onClick={handleOpenProductsModal}>
                <IonIcon icon={fastFoodSharp} />
              </IonFabButton>

              {/* Novo pagamento */}
              {!tab.is_fully_paid && (
                <IonFabButton color="warning" onClick={() => setShowPaymentForm(true)}>
                  <IonIcon icon={card} />
                </IonFabButton>
              )}

              {/* Encerrar comanda */}
              {tab.is_fully_paid && (
                <IonFabButton color="danger" onClick={() => setShowCloseAlert(true)}>
                  <IonIcon icon={checkmarkCircle} />
                </IonFabButton>
              )}
            </IonFabList>
          </IonFab>
        )}

        <IonModal isOpen={showProductsModal} onDidDismiss={() => setShowProductsModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Adicionar produto</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowProductsModal(false)}>Fechar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {availableProducts.map((product) => (
                <IonItem key={product.id} button onClick={() => handleAddProduct(product)}>
                  <IonLabel>
                    <h3>{product.name}</h3>
                    <p>
                      {product.category} - {formatPrice(product.price)}
                    </p>
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

      <IonFooter>
        <IonToolbar>
          <div
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IonBadge color="primary">Total: {formatPrice(tab.total_value)}</IonBadge>
            <IonBadge color="success">Pago: {formatPrice(tab.total_paid)}</IonBadge>
            <IonBadge color="warning">Restante: {formatPrice(tab.remaining_amount)}</IonBadge>
          </div>
          {/* <IonItem lines="none">
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
          </IonItem> */}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default TabDetail;
