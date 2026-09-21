import Link from "next/link";
import { OrderHeader } from "@/components/order/OrderHeader";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageBody, PageFrame } from "@/components/ui/page";

export function CheckoutEmpty() {
  return (
    <PageFrame>
      <OrderHeader
        title="Checkout"
        backHref="/order/address"
        backLabel="Back to delivery details"
      />
      <PageBody className="pt-6">
        <EmptyState
          image="/images/cooking-gas-station.png"
          alt="Cooking gas station waiting for an order"
          title="A few details first"
          body="Choose a cylinder and where to deliver it before you pay. Nothing has been charged."
          action={
            <div className="flex flex-col gap-3">
              <Link
                href="/order/address"
                className={buttonClassName({ variant: "primary", size: "lg" })}
              >
                Delivery details
              </Link>
              <Link
                href="/order/cylinder"
                className={buttonClassName({ variant: "secondary", size: "lg" })}
              >
                Choose a cylinder
              </Link>
            </div>
          }
        />
      </PageBody>
    </PageFrame>
  );
}
