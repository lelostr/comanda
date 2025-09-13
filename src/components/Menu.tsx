import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import {
  fastFoodOutline,
  fastFoodSharp,
  homeOutline,
  homeSharp,
  peopleOutline,
  peopleSharp,
  printOutline,
  printSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Painel",
    url: "/dashboard",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Comandas",
    url: "/tabs",
    iosIcon: peopleOutline,
    mdIcon: peopleSharp,
  },
  {
    title: "Produtos",
    url: "/products",
    iosIcon: fastFoodOutline,
    mdIcon: fastFoodSharp,
  },
  {
    title: "Relatórios",
    url: "/reports",
    iosIcon: printOutline,
    mdIcon: printSharp,
  },
  {
    title: "Configurações",
    url: "/settings",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
  // Deixando este exemplo abaixo para ver como é utilizado o hook do router
  // {
  //   title: "Inbox",
  //   url: "/folder/Inbox",
  //   iosIcon: mailOutline,
  //   mdIcon: mailSharp,
  // },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="reveal">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Comanda</IonListHeader>
          <IonNote>user@mail.com</IonNote>

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />

                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
