import React from "react";

interface Props {
  params: {
    category: string;
  };
}
const page = ({ params }: Props) => {
  const { category } = params;
  return <div>Category: {category}</div>;
};

export default page;
