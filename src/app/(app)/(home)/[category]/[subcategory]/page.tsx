import React from "react";

interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const pages = async ({ params }: Props) => {
  const { category, subcategory } = await params;
  console.log("!!!!subcategory:", params);
  return (
    <div>
      Category: {category} <br />
      Subcategory: {subcategory}
    </div>
  );
};

export default pages;
