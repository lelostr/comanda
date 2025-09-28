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
  IonButtons,
  IonMenuButton,
  IonItem,
  IonList,
  IonLabel,
} from "@ionic/react";
import { add, create, trash } from "ionicons/icons";
import { Product } from "../types/product";
import { productService } from "../services/productService";
import ProductForm from "../components/ProductForm";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    await loadProducts();
    event.detail.complete();
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      await loadProducts();
      setShowDeleteAlert(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      setError("Erro ao deletar produto");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async () => {
    await loadProducts();
    setShowForm(false);
    setEditingProduct(null);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (showForm) {
    return <ProductForm product={editingProduct} onClose={handleFormClose} onSubmit={handleFormSubmit} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>Produtos</IonTitle>
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
            <IonButton onClick={loadProducts}>Tentar Novamente</IonButton>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <IonText color="medium">
              <p>Nenhum produto encontrado</p>
            </IonText>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {products.map((product) => (
                <IonCol size="12" size-md="6" size-lg="4" key={product.id}>
                  <IonCard>
                    <IonCardHeader color="primary">
                      <IonCardTitle>{product.name}</IonCardTitle>
                      <IonCardSubtitle>{product.category}</IonCardSubtitle>
                    </IonCardHeader>

                    {product.description && (
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
                        {product.description}
                      </div>
                    )}

                    <IonCardContent>
                      <IonList>
                        <IonItem lines="none">
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <IonLabel>Preço</IonLabel>
                            <IonLabel>{formatPrice(product.price)}</IonLabel>
                          </div>
                        </IonItem>
                      </IonList>
                    </IonCardContent>

                    <IonButton expand="block" fill="outline" onClick={() => handleEditProduct(product)}>
                      <IonIcon icon={create} slot="start" />
                      Editar
                    </IonButton>

                    <IonButton expand="block" fill="outline" color="danger" onClick={() => handleDeleteProduct(product)}>
                      <IonIcon icon={trash} slot="start" />
                      Excluir
                    </IonButton>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleCreateProduct}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"?`}
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

export default Products;
