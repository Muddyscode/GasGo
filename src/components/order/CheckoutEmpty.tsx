import { OrderHeader } from "@/components/order/OrderHeader";
import { PressableLink } from "@/components/ui/Pressable";
import { OrderFlowShell } from "@/components/ui/PageShell";

export function CheckoutEmpty() {
  return (
    <OrderFlowShell
      imageSrc="/images/cooking-gas-cylinders.png"
      imageAlt="Cooking gas cylinders"
      imagePosition="50% 70%"
    >
      <OrderHeader
        title="Checkout"
        backHref="/order/address"
        backLabel="Back to delivery details"
      />
      <main className="flex flex-1 flex-col px-5 pt-10">
        <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          A few details first
        </p>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
          Choose a cylinder and where to deliver it before you pay. Nothing has been charged.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <PressableLink href="/order/address">Delivery details</PressableLink>
          <PressableLink href="/order/cylinder" variant="secondary">
            Choose a cylinder
          </PressableLink>
        </div>
      </main>
    </OrderFlowShell>
  );
}
