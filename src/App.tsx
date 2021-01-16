import React, { useCallback, useEffect, useState } from 'react';
import { client, Page } from './api';
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
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedPicture, setSelectedPicture] = useState<string>();
  const initCall = async () => {
    await client.auth();
    const {pictures, hasMore, page, pageCount} = await client.getPage();

    setPageState({pictures, hasMore, pageCount, page});
  }
  const loadMore = async () => {
    setLoading(true);
    const {pictures, hasMore, page, pageCount} = await client.getPage(state.page + 1);

    setPageState({
      hasMore,
      pageCount,
      page,
      pictures: [...state.pictures, ...pictures],
    });
    setLoading(false);
  }

  const onPictureClick = useCallback((id: string) => {
    setSelectedPicture(id);
  }, []);

  const onPictureModalClose = useCallback(() => {
    setSelectedPicture(undefined);
  }, []);

  const onKeyPress = (e: KeyboardEvent) => {
    if (!selectedPicture) return;

    switch (e.key) {
      case 'ArrowRight':
        const nextPictureIndex = state.pictures
          .findIndex(picture => picture.id === selectedPicture) + 1;
        if (nextPictureIndex !== 0 && nextPictureIndex !== state.pictures.length) {
          setSelectedPicture(state.pictures[nextPictureIndex].id)
        }
        break;
      case 'ArrowLeft':
        const prevPictureIndex = state.pictures
          .findIndex(picture => picture.id === selectedPicture) - 1;
        if (prevPictureIndex >= 0) {
          setSelectedPicture(state.pictures[prevPictureIndex].id)
        }
        break;
      default:
        return
    }
  }

  useEffect(() => {
    initCall();
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress)
    }
  }, [selectedPicture]);


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
        <ActionsWrapper>
          <ActionButton disabled={loading} onClick={loadMore}>Load More</ActionButton>
        </ActionsWrapper>
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
  display: flex;
  flex: 0;
  justify-content: center;
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

const ActionsWrapper = styled.div`
  width: 100%;
  padding: 50px;
  display: flex;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  cursor: pointer;
`;
