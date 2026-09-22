export type RouteNav = {
  title: string;
  backHref: string;
  backLabel: string;
};

export function navForPathname(pathname: string): RouteNav | null {
  if (pathname === "/" || pathname === "/app") return null;
  if (pathname === "/how-it-works") {
    return { title: "How it works", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/zones") {
    return { title: "Zones", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/why") {
    return { title: "Why GasGo", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/login") {
    return { title: "Sign in", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/signup") {
    return { title: "Sign up", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/order/cylinder") {
    return { title: "Your fill", backHref: "/", backLabel: "Go back" };
  }
  if (pathname === "/order/address") {
    return {
      title: "Delivery details",
      backHref: "/order/cylinder",
      backLabel: "Back to your fill",
    };
  }
  if (pathname === "/order/checkout") {
    return {
      title: "Checkout",
      backHref: "/order/address",
      backLabel: "Back to delivery details",
    };
  }
  if (pathname === "/order/success") {
    return {
      title: "Confirmed",
      backHref: "/order/checkout",
      backLabel: "Back to checkout",
    };
  }
  if (pathname.startsWith("/order/tracking/")) {
    return { title: "Track order", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/profile") {
    return { title: "Profile", backHref: "/", backLabel: "Back home" };
  }
  if (pathname === "/profile/addresses") {
    return { title: "Addresses", backHref: "/profile", backLabel: "Back to profile" };
  }
  if (pathname.startsWith("/profile/orders/")) {
    return { title: "Order", backHref: "/profile", backLabel: "Back to profile" };
  }
  return { title: "GasGo", backHref: "/", backLabel: "Back home" };
}
