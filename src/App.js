import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import UploadPDF from "./components/UploadPDF";
import DisplayPDF from './components/DisplayPDF'

const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<UploadPDF />} />
              <Route path='/display-pdf' element={<DisplayPDF />} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
