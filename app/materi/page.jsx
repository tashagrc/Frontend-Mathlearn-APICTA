import { getMateri } from '../../server/api';
import { MaterialPage } from '../../components/Material/MaterialPage'
import React from 'react'
import "./style.css";

const fetchMaterialData = async () => {
  try {
    const response = await getMateri("", "desc,createdAt", 0);

    return response;
  } catch (error) {
    console.error("Error fetching material data:", error);
    return [];
  }
}

export const Material = async () => {
  const materialData = await fetchMaterialData();

  return (
    <>
      <MaterialPage materialData={materialData} />
    </>
  )
}

export default Material;
