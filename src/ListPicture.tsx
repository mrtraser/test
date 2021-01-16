import React, { useCallback } from "react";
import styled from "styled-components";

export interface ListPictureProps {
  id: string;
  url: string;
  onClick: (id: string) => void;
}

export function ListPicture({id, url, onClick}: ListPictureProps) {
  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    return onClick ? onClick(id) : null;
  }, [id, onClick]);

  return <ListPictureWrapper onClick={handleOnClick}>
    <Img src={url} alt={url}/>
  </ListPictureWrapper>
}

const ListPictureWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  box-sizing: border-box;
  width: 25%;
  cursor: pointer;
  
  @media (max-width: 1024px) {
    width: 33.333334%;
  }

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 400px) {
    width: 100%;
  }
`;
const Img = styled.img`
  max-width: 100%;
`;