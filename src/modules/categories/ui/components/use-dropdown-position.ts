import { RefObject } from "react";
export const useDropDownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240;

    // tính vị trí top (dưới parent)
    const top = rect.bottom + window.scrollY;

    // căn giữa dropdown với parent
    let left =
      rect.left + window.scrollX + rect.width / 2 - dropdownWidth / 2;

    // check tràn bên phải
    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth;
    }

    // check tràn bên trái
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
