import { AppNavbar } from "@/components/nav/AppNavbar";

type OrderHeaderProps = {
  title: string;
  backHref: string;
  backLabel: string;
};

export function OrderHeader({ title, backHref, backLabel }: OrderHeaderProps) {
  return (
    <AppNavbar
      variant="flow"
      title={title}
      backHref={backHref}
      backLabel={backLabel}
      showProfile
      showStatusChip={false}
    />
  );
}
