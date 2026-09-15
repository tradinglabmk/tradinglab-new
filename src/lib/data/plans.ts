// Client-safe plan metadata. Real Stripe Price IDs live in env vars and are
// resolved on the server only (see src/lib/server/stripePrices.ts).

export type PlanCategory = "group" | "signals";
export type PlanMode = "subscription" | "payment";

export interface Plan {
  id: string;
  category: PlanCategory;
  title: string;
  description: string;
  priceEUR: number;
  billingLabel: string;
  intervalLabel: string;
  mode: PlanMode;
  features: string[];
  badge?: string;
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "group_monthly",
    category: "group",
    title: "Group Coaching — месечно",
    description:
      "Континуирана поддршка и едукација во мала група, со автоматско месечно обновување.",
    priceEUR: 67,
    billingLabel: "€67 / месечно",
    intervalLabel: "/ месечно",
    mode: "subscription",
    features: [
      "Group Coaching во мала група",
      "Пристап до неделни сесии",
      "Приватна заедница",
      "Автоматско месечно обновување",
      "Откажување во било кое време",
    ],
  },
  {
    id: "group_3m",
    category: "group",
    title: "Group Coaching — 3 месеци",
    description:
      "Иста програма по поповолна цена, со автоматско обновување на секои 3 месеци.",
    priceEUR: 150,
    billingLabel: "€150 на секои 3 месеци",
    intervalLabel: "на секои 3 месеци",
    mode: "subscription",
    badge: "Најпопуларно",
    highlighted: true,
    features: [
      "Сè од месечниот план",
      "Заклучена цена за 3 месеци",
      "Заштеда од €51 споредено со месечно",
      "Автоматско обновување на секои 3 месеци",
    ],
  },
  {
    id: "group_6m",
    category: "group",
    title: "Group Coaching — 6 месеци",
    description:
      "Најголема заштеда со еднократна уплата за 6 месеци пристап, без автоматско обновување.",
    priceEUR: 300,
    billingLabel: "€300 еднократно · 6 месеци",
    intervalLabel: "еднократно",
    mode: "payment",
    features: [
      "Сè од месечниот план",
      "Заклучена цена за 6 месеци",
      "Заштеда од €102 споредено со месечно",
    ],
  },
  {
    id: "signals_monthly",
    category: "signals",
    title: "Trading Signals — месечно",
    description:
      "Дневни trading сигнали директно во вашиот инбокс, со автоматско месечно обновување.",
    priceEUR: 50,
    billingLabel: "€50 / месечно",
    intervalLabel: "/ месечно",
    mode: "subscription",
    features: [
      "Дневни trading signals",
      "Точки за влез, стоп и цел",
      "Достапни преку Telegram",
      "Автоматско месечно обновување",
      "Откажување во било кое време",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
