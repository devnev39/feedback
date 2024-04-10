import React from 'react'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {UserContextProvider} from './context/UserContext';
import {AlertContextProvider} from './context/AlertContext';
import {Provider} from 'react-redux';
import store from './store/store.js';
import './index.css'
import Alert from './components/Alert.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <AlertContextProvider>
      <UserContextProvider>
          <App />
          <Alert />
      </UserContextProvider>
      </AlertContextProvider>
    </Provider>
  </React.StrictMode>,
)
