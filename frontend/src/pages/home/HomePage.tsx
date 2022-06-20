import React, { useState } from 'react';
import { Root } from "./HomePage.styled";
import Page from "../page/Page";
import { useAuth } from "../../hooks/useAuth";
import Photos from "../../components/photos/Photos";
import AllFiles from "../../components/all-files/AllFiles";

type TTab = 'photos' | 'all';

const HomePage = () => {
  const {authData, isInitialized} = useAuth();

  const [selectedTab, setSelectedTab] = useState<TTab>('photos');

  const onSelectedTabChangedHandler = (tab: TTab) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
    }
  };

  return (
    <Page hasHeader={isInitialized && !!authData} hasHomeButton={false}>
      {isInitialized && authData && (
        <Root>
          <div className="flex flex-row">
            <div
              className={['tab-btn', selectedTab === "photos" ? 'tab-btn-selected' : ''].join(' ')}
              onClick={() => onSelectedTabChangedHandler('photos')}>Images</div>
            <div
              className={['tab-btn', selectedTab === "all" ? 'tab-btn-selected' : ''].join(' ')}
              onClick={() => onSelectedTabChangedHandler('all')}>All files</div>
          </div>
          {selectedTab === "photos" && <Photos />}
          {selectedTab === "all" && <AllFiles />}
        </Root>
      )}
    </Page>
  );
};

export default HomePage;
