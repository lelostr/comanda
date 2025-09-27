import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Menu from "./components/Menu";
import Page from "./pages/Page";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Tabs from "./pages/Tabs";

setupIonicReact();

const dumbString = "Será disponibilizado em breve!";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              {/* Rota pública - Login */}
              <Route path="/login" exact={true}>
                <Login />
              </Route>

              {/* Rotas protegidas */}
              <Route path="/" exact={true}>
                <ProtectedRoute>
                  <Redirect to="/dashboard" />
                </ProtectedRoute>
              </Route>

              <Route path="/dashboard" exact={true}>
                <ProtectedRoute>
                  <IonRouterOutlet id="main">
                    <Dashboard teste="PARAMETRO DO DASH" />
                  </IonRouterOutlet>
                </ProtectedRoute>
              </Route>

              <Route path="/tabs" exact={true}>
                <ProtectedRoute>
                  <IonRouterOutlet id="main">
                    <Tabs title="Comandas" dumbString={dumbString} />
                  </IonRouterOutlet>
                </ProtectedRoute>
              </Route>

              <Route path="/products" exact={true}>
                <ProtectedRoute>
                  <IonRouterOutlet id="main">
                    <Tabs title="Produtos" dumbString={dumbString} />
                  </IonRouterOutlet>
                </ProtectedRoute>
              </Route>

              <Route path="/reports" exact={true}>
                <ProtectedRoute>
                  <IonRouterOutlet id="main">
                    <Tabs title="Relatórios" dumbString={dumbString} />
                  </IonRouterOutlet>
                </ProtectedRoute>
              </Route>

              <Route path="/settings" exact={true}>
                <ProtectedRoute>
                  <IonRouterOutlet id="main">
                    <Tabs title="Configurações" dumbString={dumbString} />
                  </IonRouterOutlet>
                </ProtectedRoute>
              </Route>

              {/* Deixando este exemplo abaixo para ver como é utilizado o hook do router */}
              {/* <Route path="/folder/:name" exact={true}>
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            </Route> */}
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
