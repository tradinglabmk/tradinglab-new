import { useState } from "react";
import { toast } from "sonner";
import {
  RadioField,
  CheckboxGroupField,
  SliderField,
  TextAreaField,
  ConfirmField,
  StepProgress,
} from "./formFields";

export interface MentorshipData {
  tradingDuration: string;
  knowledgeLevel: number;
  markets: string[];
  tradingStyle: string;
  accountType: string;
  concepts: string[];
  tradingPlan: string;
  problems: string[];
  currentSituation: string;
  expectations: string[];
  importantResult: string;
  successDefinition: string;
  progressTime: string;
  weeklyTime: string;
  availability: string[];
  commitment: string;
  journalReadiness: string;
  responsibilityLevel: number;
  whyIndividual: string;
  sessionDuration: string;
  sessionFrequency: string;
  format: string;
  investment: string;
  paymentMethod: string;
  groupAlternative: string;
  startTime: string;
  mentorExpectations: string;
  additionalInfo: string;
  confirmRealistic: boolean;
  confirmResponsibility: boolean;
  confirmContact: boolean;
}

const initialData: MentorshipData = {
  tradingDuration: "",
  knowledgeLevel: 5,
  markets: [],
  tradingStyle: "",
  accountType: "",
  concepts: [],
  tradingPlan: "",
  problems: [],
  currentSituation: "",
  expectations: [],
  importantResult: "",
  successDefinition: "",
  progressTime: "",
  weeklyTime: "",
  availability: [],
  commitment: "",
  journalReadiness: "",
  responsibilityLevel: 5,
  whyIndividual: "",
  sessionDuration: "",
  sessionFrequency: "",
  format: "",
  investment: "",
  paymentMethod: "",
  groupAlternative: "",
  startTime: "",
  mentorExpectations: "",
  additionalInfo: "",
  confirmRealistic: false,
  confirmResponsibility: false,
  confirmContact: false,
};

interface Props {
  onSubmit: (data: MentorshipData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function MentorshipForm({ onSubmit, onBack, isSubmitting }: Props) {
  const [section, setSection] = useState(1);
  const [data, setData] = useState<MentorshipData>(initialData);
  const set = <K extends keyof MentorshipData>(key: K, value: MentorshipData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const validateSection = (): boolean => {
    if (section === 1) {
      return Boolean(
        data.tradingDuration &&
          data.markets.length &&
          data.tradingStyle &&
          data.accountType &&
          data.concepts.length &&
          data.tradingPlan,
      );
    }
    if (section === 2) {
      return Boolean(
        data.problems.length &&
          data.currentSituation.trim() &&
          data.expectations.length &&
          data.importantResult.trim() &&
          data.successDefinition.trim() &&
          data.progressTime,
      );
    }
    if (section === 3) {
      return Boolean(
        data.weeklyTime && data.availability.length && data.commitment && data.journalReadiness,
      );
    }
    if (section === 4) {
      return Boolean(
        data.whyIndividual.trim() &&
          data.sessionDuration &&
          data.sessionFrequency &&
          data.format &&
          data.investment &&
          data.paymentMethod &&
          data.groupAlternative,
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!validateSection()) {
      toast.error("Ве молиме пополнете ги задолжителните полиња.");
      return;
    }
    setSection((s) => s + 1);
  };

  const handleFinalSubmit = () => {
    if (!data.startTime || !data.mentorExpectations.trim()) {
      toast.error("Ве молиме пополнете ги задолжителните полиња.");
      return;
    }
    if (!data.confirmRealistic || !data.confirmResponsibility || !data.confirmContact) {
      toast.error("Ве молиме потврдете ги сите изјави подолу.");
      return;
    }
    onSubmit(data);
  };

  return (
    <div>
      <StepProgress step={section} total={5} />

      {section === 1 && (
        <div className="join-form">
          <h3 className="form-section-title">Моментално искуство</h3>
          <RadioField
            label="А1. Колку долго се занимавате со trading?"
            value={data.tradingDuration}
            onChange={(v) => set("tradingDuration", v)}
            options={[
              "Немам претходно искуство",
              "Помалку од 3 месеци",
              "Од 3 до 6 месеци",
              "Од 6 до 12 месеци",
              "Од 1 до 2 години",
              "Од 2 до 5 години",
              "Повеќе од 5 години",
            ]}
          />
          <SliderField
            label="А2. Како би го оцениле вашето моментално знаење?"
            value={data.knowledgeLevel}
            onChange={(v) => set("knowledgeLevel", v)}
            minLabel="Целосен почетник"
            maxLabel="Напредно знаење"
          />
          <CheckboxGroupField
            label="А3. Со кои пазари имате искуство?"
            values={data.markets}
            onChange={(v) => set("markets", v)}
            options={["Forex", "Indices", "Commodities", "Stocks", "Futures", "Crypto", "Немам практично искуство", "Друго"]}
          />
          <RadioField
            label="А4. Кој trading стил најмногу го користите?"
            value={data.tradingStyle}
            onChange={(v) => set("tradingStyle", v)}
            options={[
              "Scalping",
              "Day Trading",
              "Swing Trading",
              "Position Trading",
              "Комбинирам повеќе стилови",
              "Сè уште немам дефиниран стил",
              "Не сум сигурен што најмногу ми одговара",
            ]}
          />
          <RadioField
            label="А5. На каква сметка моментално тргувате?"
            value={data.accountType}
            onChange={(v) => set("accountType", v)}
            options={[
              "Не тргувам во моментов",
              "Demo сметка",
              "Лична Live сметка",
              "Prop Firm Challenge",
              "Funded Prop Firm сметка",
              "Комбинирам повеќе видови сметки",
            ]}
          />
          <CheckboxGroupField
            label="А6. Кои концепти моментално ги познавате или користите?"
            values={data.concepts}
            onChange={(v) => set("concepts", v)}
            options={[
              "Supply and Demand",
              "Market Structure",
              "Support and Resistance",
              "Price Action",
              "COT Report",
              "Open Interest",
              "Fundamental и Macro анализа",
              "Seasonality",
              "Valuation",
              "Risk Management",
              "Trading Psychology",
              "Trading Journal",
              "Немам изграден trading систем",
              "Друго",
            ]}
          />
          <RadioField
            label="А7. Дали имате јасно дефиниран Trading Plan?"
            value={data.tradingPlan}
            onChange={(v) => set("tradingPlan", v)}
            options={[
              "Да, имам целосно дефиниран систем",
              "Имам основа, но системот не е целосно разработен",
              "Имам стратегија, но не ја следам доследно",
              "Немам јасно дефиниран Trading Plan",
              "Не знам како правилно да изградам Trading Plan",
            ]}
          />
          <div className="form-nav">
            <button className="form-back" type="button" onClick={onBack}>
              Назад
            </button>
            <button className="form-submit" type="button" onClick={handleNext}>
              СЛЕДНО
            </button>
          </div>
        </div>
      )}

      {section === 2 && (
        <div className="join-form">
          <h3 className="form-section-title">Проблеми, цели и очекувања</h3>
          <CheckboxGroupField
            label="А8. Кои се вашите најголеми проблеми во trading?"
            values={data.problems}
            onChange={(v) => set("problems", v)}
            options={[
              "Немам јасна стратегија",
              "Немам дефинирана насока за анализа",
              "Не знам кога да влезам во позиција",
              "Не знам кога да излезам од позиција",
              "Имам проблем со Risk Management",
              "Отворам премногу позиции",
              "Имам проблем со FOMO",
              "Имам проблем со Revenge Trading",
              "Емоциите влијаат врз моите одлуки",
              "Немам доволно дисциплина",
              "Не знам како да анализирам Fundamentals",
              "Не знам како да го користам COT Report",
              "Не можам да бидам конзистентен",
              "Имам стратегија, но немам доверба во неа",
              "Не водам Trading Journal",
              "Не знам како правилно да направам backtesting",
              "Друго",
            ]}
          />
          <TextAreaField
            label="А9. Објаснете ја вашата моментална ситуација."
            hint="Што сте учеле досега, што сте пробале, какви резултати сте имале и каде сметате дека најмногу заглавувате?"
            value={data.currentSituation}
            onChange={(v) => set("currentSituation", v)}
          />
          <CheckboxGroupField
            label="А10. Што очекувате да добиете од 1-на-1 Mentorship?"
            values={data.expectations}
            onChange={(v) => set("expectations", v)}
            options={[
              "Изградба на целосен Trading Plan",
              "Подобро разбирање на Supply and Demand",
              "Правилно читање на Market Structure",
              "Подобри Entries и Confirmations",
              "COT и позиционирање на пазарните учесници",
              "Fundamental и Macro анализа",
              "Risk Management",
              "Trading Psychology",
              "Анализа на моите претходни trades",
              "Индивидуален feedback",
              "Подготовка за Prop Firm",
              "Trading Journal и Review процес",
              "Подобра дисциплина и конзистентност",
              "Долгорочна насока и структура",
              "Друго",
            ]}
          />
          <TextAreaField
            label="А11. Кој е најважниот резултат што сакате да го постигнете?"
            hint="Наведете конкретно што би сакале да биде променето или подобрено по завршувањето на менторството."
            value={data.importantResult}
            onChange={(v) => set("importantResult", v)}
          />
          <TextAreaField
            label="А12. Што за вас би претставувало успешно менторство?"
            value={data.successDefinition}
            onChange={(v) => set("successDefinition", v)}
          />
          <RadioField
            label="А13. Во кој период очекувате да забележите напредок?"
            value={data.progressTime}
            onChange={(v) => set("progressTime", v)}
            options={[
              "Во следните 1–3 месеци",
              "Во следните 3–6 месеци",
              "Во следните 6–12 месеци",
              "Немам фиксен рок и сакам правилно да го научам процесот",
              "Не сум сигурен",
            ]}
          />
          <div className="form-nav">
            <button className="form-back" type="button" onClick={() => setSection(1)}>
              Назад
            </button>
            <button className="form-submit" type="button" onClick={handleNext}>
              СЛЕДНО
            </button>
          </div>
        </div>
      )}

      {section === 3 && (
        <div className="join-form">
          <h3 className="form-section-title">Време и посветеност</h3>
          <RadioField
            label="А14. Колку време неделно можете реално да посветите на учење, анализа и задачи?"
            value={data.weeklyTime}
            onChange={(v) => set("weeklyTime", v)}
            options={["Помалку од 2 часа", "Од 2 до 4 часа", "Од 5 до 7 часа", "Од 8 до 10 часа", "Повеќе од 10 часа"]}
          />
          <CheckboxGroupField
            label="А15. Во кој период најчесто сте слободни за индивидуални сесии?"
            values={data.availability}
            onChange={(v) => set("availability", v)}
            options={[
              "Работни денови претпладне",
              "Работни денови попладне",
              "Работни денови навечер",
              "Сабота",
              "Недела",
              "Имам флексибилен распоред",
            ]}
          />
          <RadioField
            label="А16. Дали сте подготвени да учите и да работите на процесот најмалку 5–6 месеци?"
            value={data.commitment}
            onChange={(v) => set("commitment", v)}
            options={[
              "Да, целосно сум подготвен",
              "Да, доколку имам јасна структура и насока",
              "Не сум сигурен",
              "Барам побрз резултат",
              "Не можам да се обврзам во овој период",
            ]}
          />
          <RadioField
            label="А17. Дали сте подготвени да водите Trading Journal, да извршувате задачи и да ги следите договорените правила?"
            value={data.journalReadiness}
            onChange={(v) => set("journalReadiness", v)}
            options={["Да, целосно", "Да, но ќе ми биде потребна насока", "Не сум сигурен", "Не"]}
          />
          <SliderField
            label="А18. Колку сте подготвени да преземете лична одговорност за сопствениот напредок?"
            value={data.responsibilityLevel}
            onChange={(v) => set("responsibilityLevel", v)}
            minLabel="Не сум подготвен"
            maxLabel="Целосно сум подготвен"
          />
          <div className="form-nav">
            <button className="form-back" type="button" onClick={() => setSection(2)}>
              Назад
            </button>
            <button className="form-submit" type="button" onClick={handleNext}>
              СЛЕДНО
            </button>
          </div>
        </div>
      )}

      {section === 4 && (
        <div className="join-form">
          <h3 className="form-section-title">Формат и инвестиција</h3>
          <TextAreaField
            label="А19. Зошто сметате дека ви е потребен индивидуален пристап?"
            value={data.whyIndividual}
            onChange={(v) => set("whyIndividual", v)}
          />
          <RadioField
            label="А20. Колкаво времетраење на една индивидуална сесија најмногу би ви одговарало?"
            value={data.sessionDuration}
            onChange={(v) => set("sessionDuration", v)}
            options={["60 минути", "90 минути", "120 минути", "Не сум сигурен и би сакал препорака"]}
          />
          <RadioField
            label="А21. Колку често би сакале да имате индивидуални сесии?"
            value={data.sessionFrequency}
            onChange={(v) => set("sessionFrequency", v)}
            options={["Еднаш неделно", "Двапати неделно", "Двапати месечно", "Еднаш месечно", "Според индивидуално договорен план"]}
          />
          <RadioField
            label="А22. Кој формат најмногу би ви одговарал?"
            value={data.format}
            onChange={(v) => set("format", v)}
            options={[
              "Една индивидуална консултација",
              "Пакет од 4 сесии",
              "Пакет од 8 сесии",
              "Месечно 1-на-1 Mentorship",
              "Програма од 3 месеци",
              "Програма од 6 месеци",
              "Не сум сигурен и би сакал препорака",
            ]}
          />
          <RadioField
            label="А23. Колку сте подготвени да инвестирате во 1-на-1 Mentorship програма?"
            value={data.investment}
            onChange={(v) => set("investment", v)}
            options={[
              "Од 200 до 500 € за неколку сесии",
              "Од 1.000 до 2.500 € за целосна едукација + сите индикатори што се потребни",
              "Зависи од времетраењето, бројот на сесии и поддршката",
            ]}
          />
          <RadioField
            label="А24. Кој начин на плаќање најмногу би ви одговарал?"
            value={data.paymentMethod}
            onChange={(v) => set("paymentMethod", v)}
            options={["Целосна уплата", "Месечна уплата", "Плаќање по сесија", "Плаќање на рати", "Зависи од понудата"]}
          />
          <RadioField
            label="А25. Доколку индивидуалната програма е над вашиот моментален буџет, дали би избрале Group Coaching?"
            value={data.groupAlternative}
            onChange={(v) => set("groupAlternative", v)}
            options={[
              "Да",
              "Најверојатно да",
              "Зависи од програмата и големината на групата",
              "Не, заинтересиран сум само за 1-на-1",
              "Не сум сигурен",
            ]}
          />
          <div className="form-nav">
            <button className="form-back" type="button" onClick={() => setSection(3)}>
              Назад
            </button>
            <button className="form-submit" type="button" onClick={handleNext}>
              СЛЕДНО
            </button>
          </div>
        </div>
      )}

      {section === 5 && (
        <div className="join-form">
          <h3 className="form-section-title">Завршна процена</h3>
          <RadioField
            label="А26. Кога би биле подготвени да започнете?"
            value={data.startTime}
            onChange={(v) => set("startTime", v)}
            options={["Веднаш", "Во следните 7 дена", "Во следните 30 дена", "Во следните 2–3 месеци", "Не сум сигурен"]}
          />
          <TextAreaField
            label="А27. Што очекувате од менторот, а што сте подготвени вие да направите?"
            value={data.mentorExpectations}
            onChange={(v) => set("mentorExpectations", v)}
          />
          <TextAreaField
            label="А28. Дали има нешто дополнително што треба да знаеме за вас?"
            value={data.additionalInfo}
            onChange={(v) => set("additionalInfo", v)}
            placeholder="Опционално"
          />
          <ConfirmField
            id="mentorship-confirm-1"
            label="Разбирам дека менторството е едукативен процес и дека не постои гаранција за заработка, профитабилност или успешно поминување на Prop Firm Challenge."
            checked={data.confirmRealistic}
            onChange={(v) => set("confirmRealistic", v)}
          />
          <ConfirmField
            id="mentorship-confirm-2"
            label="Разбирам дека моите резултати зависат од мојата работа, дисциплина, Risk Management и примена на наученото."
            checked={data.confirmResponsibility}
            onChange={(v) => set("confirmResponsibility", v)}
          />
          <ConfirmField
            id="mentorship-confirm-3"
            label="Се согласувам TradingLab.mk да ги користи информациите доставени во оваа форма за процена на мојата апликација и за да ме контактира во врска со 1-на-1 Mentorship програмата."
            checked={data.confirmContact}
            onChange={(v) => set("confirmContact", v)}
          />
          <div className="form-nav">
            <button className="form-back" type="button" onClick={() => setSection(4)} disabled={isSubmitting}>
              Назад
            </button>
            <button className="form-submit" type="button" onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Се праќа..." : "ИСПРАТИ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
