import {useEffect, useState} from "react";
import {client} from "./api";

export interface PictureProps {
  id: string;
}

export function PictureModal({id}: PictureProps) {
  const [picture, setPicture] = useState();

  const init = async () => {
    const pic = await client.getImage(id);
    setPicture(pic);

    console.log(pic);
  }

  useEffect(() => {
    init();
  }, []);

  return <div>
    <div>
      <img src="" alt=""/>
    </div>
    <div>data</div>
    <div>actions</div>
  </div>
}