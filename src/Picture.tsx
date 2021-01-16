import { useCallback, useEffect, useState } from "react";
import { client, FullPicture } from "./api";
import styled from "styled-components";

export interface PictureProps {
  id: string;
  onClose: (id: string) => void
}

const transformTagsString = (tags: string) => {
  return tags.split(' ')
    .filter(Boolean)
    .map((tag => <StyledAlias key={tag} href="#">{tag}</StyledAlias>));
}

const renderPictureInfo = (picture: FullPicture) => {
  const { author, camera, tags } = picture;

  return (<InfoView>
    <InfoViewRow>
      <InfoViewCol>Author:</InfoViewCol>
      <InfoViewCol> {author}</InfoViewCol>
    </InfoViewRow>
    <InfoViewRow>
      <InfoViewCol>Camera:</InfoViewCol>
      <InfoViewCol> {camera}</InfoViewCol>
    </InfoViewRow>
    <InfoViewRow>
      <InfoViewCol>Tags: </InfoViewCol>
      <InfoViewCol> {transformTagsString(tags)}</InfoViewCol>
    </InfoViewRow>
  </InfoView>)
};

export function PictureModal({id, onClose}: PictureProps) {
  const [picture, setPicture] = useState<FullPicture>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const getFullPicture = async () => {
    const pic = await client.getImage(id);

    setPicture(pic);
  }
  const onCloseHandler = useCallback((e) => {
    e.preventDefault();

    onClose(id);
  }, [id, onClose]);

  const onShare = useCallback(async (e) => {
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(picture?.full_picture || 'dude');
    } catch {
      return
    }

    setIsCopied(true);
  },[picture]);

  useEffect(() => {
    getFullPicture()
  }, [id])

  return <PictureDrop>
    { picture
      ? (<PictureWrapper>
          <div>
            <Img src={picture!.full_picture} alt=""/>
          </div>
          <PictureInfo>{
            renderPictureInfo(picture)
          }</PictureInfo>
          <PictureActions>
            <button onClick={onShare}>Share</button>
            <button onClick={onCloseHandler}>Close</button>
          </PictureActions>
          <SharedInfo>{isCopied
            ? `Image URL has been copied to the clipboard`
            : `Use arrow keys for Prev/Next image`}
          </SharedInfo>
        </PictureWrapper>)
     : null }
  </PictureDrop>
}

const PictureDrop = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.5);
  justify-content: center;
  align-items: center;
`;

const PictureWrapper = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
`;

const PictureInfo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.5);
  padding: 20px;
  color: #ffffff;
  max-width: 200px;
`;

const InfoView = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoViewRow = styled.div`
  display: flex;
`;
const InfoViewCol = styled.div`
  min-width: 70px;
  max-width: 200px;
  display: flex;
  flex-wrap: wrap;
`;

const PictureActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0,0,0,.5);
  padding: 20px;
  color: #ffffff;
`;

const StyledAlias = styled.a`
  color: #dddddd;
  margin-right: 5px;
  &:after {
    content: ',';
  }
  &:last-child {
    &:after {
      content: '';
    }
  }
`;
const SharedInfo = styled.div`
  background: rgba(0,0,0,.5);
  position: absolute;
  bottom: 0;
  padding: 10px;
  color: #fff;
  left: 50%;
  transform: translate(-50%);
`;
const Img = styled.img`
  display: block;
`;