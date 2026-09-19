"use client";

import { useCustomerNav } from "@/components/nav/customer-nav";

type OrderHeaderProps = {
  title: string;
  backHref: string;
  backLabel: string;
};

export function OrderHeader({ title, backHref, backLabel }: OrderHeaderProps) {
  useCustomerNav({ title, backHref, backLabel });
  return null;
}
