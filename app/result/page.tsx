import { ResultPage } from "@/components/result-page";
import { getOrder } from "@/lib/orders";

export default async function Result({
  searchParams
}: {
  searchParams: Promise<{
    orderId?: string;
    service?: string;
    name?: string;
    phone?: string;
    question?: string;
    payMethod?: string;
    birthDate?: string;
    birthTime?: string;
    calendarType?: string;
    gender?: string;
  }>;
}) {
  const params = await searchParams;
  const order = await getOrder(params.orderId);

  return (
    <ResultPage
      serviceSlug={params.service}
      customerName={params.name}
      customerPhone={params.phone}
      question={params.question}
      payMethod={params.payMethod}
      birthDate={params.birthDate}
      birthTime={params.birthTime}
      calendarType={params.calendarType}
      gender={params.gender}
      order={order}
    />
  );
}
