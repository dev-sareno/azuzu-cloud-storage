import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthInitPage from "./pages/auth-init/AuthInitPage";
import HomePage from "./pages/home/HomePage";
import { AuthProvider } from "./hooks/useAuth";
import LoginPage from "./pages/login/LoginPage";
import AuthLogoutPage from "./pages/auth-logout/AuthLogoutPage";
import Main from "./components/main/Main";
import { AwsS3Provider } from "./hooks/useAwsS3";
import { AwsCognitoProvider } from "./hooks/useAwsCognito";
import UploadPage from "./pages/upload/UploadPage";
import UploadStatusPage from "./pages/upload-status/UploadStatusPage";
import { AwsDynamoDbProvider } from "./hooks/useAwsDynamoDb";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AwsS3Provider>
        <AwsCognitoProvider>
          <AwsDynamoDbProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <Main>
                  <Routes>
                    <Route path={"login"} element={<LoginPage />} />
                    <Route path={"auth-init/"} element={<AuthInitPage />} />
                    <Route path={"auth-logout/"} element={<AuthLogoutPage />} />
                    <Route path={"upload"} element={<UploadPage />} />
                    <Route path={"upload-status"} element={<UploadStatusPage />} />
                    <Route path={"/"} element={<HomePage />} />
                    <Route path={"*"} element={(<div>Page not found</div>)} />
                  </Routes>
                </Main>
              </AuthProvider>
            </QueryClientProvider>
          </AwsDynamoDbProvider>
        </AwsCognitoProvider>
      </AwsS3Provider>
    </BrowserRouter>
  );
}

export default App;
