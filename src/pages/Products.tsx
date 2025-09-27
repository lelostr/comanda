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
                    <IonCardHeader>
                      <IonCardTitle>{product.name}</IonCardTitle>
                      <IonCardSubtitle>
                        <IonChip color="primary">{product.category}</IonChip>
                      </IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                      <IonText color="primary">
                        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{formatPrice(product.price)}</h2>
                      </IonText>
                      {product.description && <p style={{ marginTop: "10px", color: "var(--ion-color-medium)" }}>{product.description}</p>}
                    </IonCardContent>

                    <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
                      <IonButton fill="outline" size="small" onClick={() => handleEditProduct(product)}>
                        <IonIcon icon={create} slot="start" />
                        Editar
                      </IonButton>
                      <IonButton fill="outline" color="danger" size="small" onClick={() => handleDeleteProduct(product)}>
                        <IonIcon icon={trash} slot="start" />
                        Excluir
                      </IonButton>
                    </div>
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
