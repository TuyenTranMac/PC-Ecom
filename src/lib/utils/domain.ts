"use client";

/**
 * Utility để redirect về main domain (loại bỏ subdomain)
 * Sử dụng khi logout hoặc chuyển đổi tài khoản
 */
export function redirectToMainDomain(path: string = "/") {
  if (typeof window === "undefined") return;

  const { hostname, protocol } = window.location;
  const isLocalhost = hostname.includes("localhost");

  // Kiểm tra xem có phải subdomain không
  const hostParts = hostname.split(".");
  const hasSubdomain = isLocalhost
    ? hostParts.length > 1 && hostParts[0] !== "localhost"
    : hostParts.length > 2;

  if (hasSubdomain) {
    // Xây dựng main domain URL
    const baseDomain = isLocalhost ? "localhost:3000" : "gear.org";
    const mainDomainUrl = `${protocol}//${baseDomain}${path}`;

    console.log("🔄 Redirecting to main domain:", mainDomainUrl);
    window.location.href = mainDomainUrl;
  } else {
    // Đã ở main domain rồi, chỉ cần navigate
    window.location.href = path;
  }
}

/**
 * Redirect về store của vendor (username subdomain)
 */
export function redirectToVendorStore(storeSlug: string, path: string = "/dashboard") {
  if (typeof window === "undefined") return;

  const { protocol } = window.location;
  const hostname = window.location.hostname;
  const isLocalhost = hostname.includes("localhost");

  const baseDomain = isLocalhost ? "localhost:3000" : "gear.org";
  const vendorUrl = `${protocol}//${storeSlug}.${baseDomain}${path}`;

  console.log("🏪 Redirecting to vendor store:", vendorUrl);
  window.location.href = vendorUrl;
}

/**
 * Lấy subdomain hiện tại (nếu có)
 */
export function getCurrentSubdomain(): string | null {
  if (typeof window === "undefined") return null;

  const { hostname } = window.location;
  const isLocalhost = hostname.includes("localhost");
  const hostParts = hostname.split(".");

  if (isLocalhost && hostParts.length > 1 && hostParts[0] !== "localhost") {
    return hostParts[0];
  } else if (!isLocalhost && hostParts.length > 2) {
    return hostParts[0];
  }

  return null;
}
