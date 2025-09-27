import React, { useState, useEffect } from "react";
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
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonAlert,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { Product, ProductFormData, PRODUCT_CATEGORIES } from "../types/product";
import { productService } from "../services/productService";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSubmit: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setAlertMessage("Nome é obrigatório");
      setShowAlert(true);
      return false;
    }

    if (!formData.category) {
      setAlertMessage("Categoria é obrigatória");
      setShowAlert(true);
      return false;
    }

    if (!formData.price.trim()) {
      setAlertMessage("Preço é obrigatório");
      setShowAlert(true);
      return false;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setAlertMessage("Preço deve ser um valor válido maior que zero");
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

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
      };

      if (isEditing && product) {
        await productService.updateProduct(product.id, productData);
      } else {
        await productService.createProduct(productData);
      }

      onSubmit();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/products" />
          </IonButtons>
          <IonTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Nome *</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={(e) => handleInputChange("name", e.detail.value!)}
                placeholder="Digite o nome do produto"
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Categoria *</IonLabel>
              <IonSelect
                value={formData.category}
                onIonChange={(e) => handleInputChange("category", e.detail.value)}
                placeholder="Selecione a categoria"
                interface="popover"
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <IonSelectOption key={category} value={category}>
                    {category}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Preço *</IonLabel>
              <IonInput
                type="number"
                value={formData.price}
                onIonInput={(e) => handleInputChange("price", e.detail.value!)}
                placeholder="0,00"
                step="0.01"
                min="0"
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Descrição</IonLabel>
              <IonTextarea
                value={formData.description}
                onIonInput={(e) => handleInputChange("description", e.detail.value!)}
                placeholder="Descrição do produto (opcional)"
                rows={3}
              />
            </IonItem>

            {error && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                <IonLabel color="danger">{error}</IonLabel>
              </div>
            )}

            <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
              <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                    Salvando...
                  </>
                ) : isEditing ? (
                  "Atualizar"
                ) : (
                  "Criar"
                )}
              </IonButton>

              <IonButton expand="block" fill="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header="Validação" message={alertMessage} buttons={["OK"]} />
      </IonContent>
    </IonPage>
  );
};

export default ProductForm;
