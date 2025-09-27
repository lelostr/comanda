import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonButton,
  IonFooter,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonItemSliding,
  IonAvatar,
  IonItemOptions,
  IonItemOption,
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
  logOutOutline,
} from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

interface AppMenu {
  title: string;
  pages: AppPage[];
}

const appMenus: AppMenu[] = [
  {
    title: "Principal",
    pages: [
      {
        title: "Painel",
        url: "/dashboard",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
    ],
  },
  {
    title: "Operacional",
    pages: [
      {
        title: "Comandas",
        url: "/tabs",
        iosIcon: peopleOutline,
        mdIcon: peopleSharp,
      },
    ],
  },
  {
    title: "Administrativo",
    pages: [
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
    ],
  },
  {
    title: "Outros",
    pages: [
      {
        title: "Configurações",
        url: "/settings",
        iosIcon: settingsOutline,
        mdIcon: settingsSharp,
      },
    ],
  },
];

const appPages: AppPage[] = [
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
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <IonMenu contentId="main" type="reveal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comanda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList id="inbox-list" lines="none">
          {appMenus.map((appMenu, index) => {
            return (
              <IonItemGroup key={index}>
                <IonItemDivider>
                  <IonLabel>{appMenu.title}</IonLabel>
                </IonItemDivider>

                {appMenu.pages.map((appPage, index) => {
                  return (
                    <IonMenuToggle key={index} autoHide={false}>
                      <IonItem
                        className={location.pathname === appPage.url ? "selected" : ""}
                        routerLink={appPage.url}
                        routerDirection="none"
                        lines="none"
                        detail={false}
                      >
                        <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />

                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                  );
                })}
              </IonItemGroup>
            );
          })}
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonItemSliding>
            <IonItem button={true}>
              <IonAvatar aria-hidden="true" slot="start">
                <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </IonAvatar>
              <IonLabel>{user?.email || "user@mail.com"}</IonLabel>
            </IonItem>
            <IonItemOptions slot="end">
              <IonItemOption color="danger" expandable={true} onClick={handleLogout}>
                <IonIcon slot="icon-only" icon={logOutOutline}></IonIcon>
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
