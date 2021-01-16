import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {client, Page} from './api';
import styled from 'styled-components';
import { PictureModal } from "./Picture";
import { ListPicture } from "./ListPicture";

export function App() {
  const [state, setPageState] = useState<Page>({
    page: 1,
    pageCount: 1,
    hasMore: false,
    pictures: []
  });
  const [selectedPicture, setSelectedPicture] = useState<string>();
  const initCall = async () => {
    await client.auth();
    const {pictures, hasMore, page, pageCount} = await client.getPage();

    setPageState({pictures, hasMore, pageCount, page});
  }
  const loadMore = async () => {
    const {pictures, hasMore, page, pageCount} = await client.getPage(state.page + 1);

    setPageState({
      hasMore,
      pageCount,
      page,
      pictures: [...state.pictures, ...pictures],
    })
  }

  const onPictureClick = useCallback((id: string) => {
    setSelectedPicture(id);
  }, []);

  const onPictureModalClose = useCallback(() => {
    setSelectedPicture(undefined);
  }, []);

  useEffect(() => {
    initCall();
  }, []);


  return (
    <AppWrapper>
      <AppHeader>Photos (Page { state.page }/{ state.pageCount })</AppHeader>
      <AppContent>
        <PictureList>
          {
            state.pictures
              .map(({id, cropped_picture }) =>
                <ListPicture
                  id={id}
                  url={cropped_picture}
                  key={id}
                  onClick={onPictureClick}
                />)
          }
        </PictureList>
        { selectedPicture ? <PictureModal id={selectedPicture} onClose={onPictureModalClose}/> : null}
        <button onClick={loadMore}>Load More</button>
      </AppContent>
    </AppWrapper>
  );
}
const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: nowrap;
`;
const AppHeader = styled.header`
  padding: 10px;
  width: 100%;
  text-align: center;
  display: flex;
  flex: 0;
`
const AppContent = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
`
const PictureList = styled.div`
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
`;
