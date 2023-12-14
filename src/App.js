import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

import UploadPDF from "./components/UploadPDF";

const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <UploadPDF />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
