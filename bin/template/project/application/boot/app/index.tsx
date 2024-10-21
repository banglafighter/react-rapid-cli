import {RapidPageManager, React, createRoot} from "react-rapid-app";
import AppRegistry from "./config/app-registry";

const registry = new AppRegistry();
const viewHolder = document.getElementById('bismillah-sw')
const renderEngine = createRoot(viewHolder!);
renderEngine.render(<RapidPageManager
    appConfig={registry.getAppConfig()}
    urlMapping={registry.getURLMapping()}
    contextProps={registry.getContextProps()}
/>)