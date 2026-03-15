import { PaymentPage } from "@/components/payment-page";

export default async function Payment({
  searchParams
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;

  return <PaymentPage initialServiceSlug={params.service} />;
}
