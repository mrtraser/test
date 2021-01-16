import React, {useCallback} from "react";

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

  return <div onClick={handleOnClick}>
    <img src={url} alt={url}/>
  </div>
}