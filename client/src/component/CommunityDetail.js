import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CommunityId = () => {
  let { id } = useParams();

  useEffect(() => {
    console.log(id);
  }, []);

  return <div>{id}</div>;
};

export default CommunityId;
