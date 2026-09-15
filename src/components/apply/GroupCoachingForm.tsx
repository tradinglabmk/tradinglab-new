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

export interface GroupCoachingData {
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
  whyGroup: string[];
  groupSize: string;
  programContent: string[];
  sessionFrequency: string;
  sessionDuration: string;
  individualFeedbackImportance: number;
  investment: string;
  paymentMethod: string;
  startTime: string;
  mentorExpectations: string;
  additionalInfo: string;
  confirmRealistic: boolean;
  confirmResponsibility: boolean;
  confirmContact: boolean;
}

const initialData: GroupCoachingData = {
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
  whyGroup: [],
  groupSize: "",
  programContent: [],
  sessionFrequency: "",
  sessionDuration: "",
  individualFeedbackImportance: 5,
  investment: "",
  paymentMethod: "",
  startTime: "",
  mentorExpectations: "",
  additionalInfo: "",
  confirmRealistic: false,
  confirmResponsibility: false,
  confirmContact: false,
};

interface Props {
  onSubmit: (data: GroupCoachingData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function GroupCoachingForm({ onSubmit, onBack, isSubmitting }: Props) {
  const [section, setSection] = useState(1);
  const [data, setData] = useState<GroupCoachingData>(initialData);
  const set = <K extends keyof GroupCoachingData>(key: K, value: GroupCoachingData[K]) =>
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
        data.whyGroup.length &&
          data.groupSize &&
          data.programContent.length &&
          data.sessionFrequency &&
          data.sessionDuration &&
          data.investment &&
          data.paymentMethod,
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
            label="Б1. Колку долго се занимавате со trading?"
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
            label="Б2. Како би го оцениле вашето моментално знаење?"
            value={data.knowledgeLevel}
            onChange={(v) => set("knowledgeLevel", v)}
            minLabel="Целосен почетник"
            maxLabel="Напредно знаење"
          />
          <CheckboxGroupField
            label="Б3. Со кои пазари имате искуство?"
            values={data.markets}
            onChange={(v) => set("markets", v)}
            options={["Forex", "Indices", "Commodities", "Stocks", "Futures", "Crypto", "Немам практично искуство", "Друго"]}
          />
          <RadioField
            label="Б4. Кој trading стил најмногу го користите?"
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
            label="Б5. На каква сметка моментално тргувате?"
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
            label="Б6. Кои концепти моментално ги познавате или користите?"
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
            label="Б7. Дали имате јасно дефиниран Trading Plan?"
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
          <h3 className="form-section-title">Проблеми и очекувања</h3>
          <CheckboxGroupField
            label="Б8. Кои се вашите најголеми проблеми во trading?"
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
            label="Б9. Објаснете ја вашата моментална ситуација."
            hint="Што сте учеле досега, што сте пробале, какви резултати сте имале и каде сметате дека најмногу заглавувате?"
            value={data.currentSituation}
            onChange={(v) => set("currentSituation", v)}
          />
          <CheckboxGroupField
            label="Б10. Што очекувате да добиете од Group Coaching?"
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
              "Анализа на trades од учесниците",
              "Feedback од менторот",
              "Подготовка за Prop Firm",
              "Trading Journal и Review процес",
              "Подобра дисциплина и конзистентност",
              "Учење од прашањата и грешките на другите",
              "Долгорочна насока и структура",
              "Друго",
            ]}
          />
          <TextAreaField
            label="Б11. Кој е најважниот резултат што сакате да го постигнете?"
            value={data.importantResult}
            onChange={(v) => set("importantResult", v)}
          />
          <TextAreaField
            label="Б12. Што за вас би претставувало успешно завршен Group Coaching процес?"
            value={data.successDefinition}
            onChange={(v) => set("successDefinition", v)}
          />
          <RadioField
            label="Б13. Во кој период очекувате да забележите напредок?"
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
            label="Б14. Колку време неделно можете реално да посветите на учење, анализа и задачи?"
            value={data.weeklyTime}
            onChange={(v) => set("weeklyTime", v)}
            options={["Помалку од 2 часа", "Од 2 до 4 часа", "Од 5 до 7 часа", "Од 8 до 10 часа", "Повеќе од 10 часа"]}
          />
          <CheckboxGroupField
            label="Б15. Во кој период најчесто сте слободни за Group Coaching сесии?"
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
            label="Б16. Дали сте подготвени да учите и да работите на процесот најмалку 5–6 месеци?"
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
            label="Б17. Дали сте подготвени да водите Trading Journal, да извршувате задачи и да ги следите правилата на групата?"
            value={data.journalReadiness}
            onChange={(v) => set("journalReadiness", v)}
            options={["Да, целосно", "Да, но ќе ми биде потребна насока", "Не сум сигурен", "Не"]}
          />
          <SliderField
            label="Б18. Колку сте подготвени да преземете лична одговорност за сопствениот напредок?"
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
          <h3 className="form-section-title">Group Coaching формат</h3>
          <CheckboxGroupField
            label="Б19. Зошто го преферирате Group Coaching форматот?"
            values={data.whyGroup}
            onChange={(v) => set("whyGroup", v)}
            options={[
              "Попристапна цена",
              "Учење и размена на искуства со други ученици",
              "Групна мотивација и дисциплина",
              "Заеднички анализи",
              "Можност да учам од туѓи прашања и грешки",
              "Не ми е потребен целосно индивидуален пристап",
              "Друго",
            ]}
          />
          <RadioField
            label="Б20. Колкава група најмногу би ви одговарала?"
            value={data.groupSize}
            onChange={(v) => set("groupSize", v)}
            options={[
              "До 5 ученици",
              "Од 6 до 10 ученици",
              "Од 11 до 15 ученици",
              "Не ми е важна големината доколку програмата е квалитетна",
            ]}
          />
          <CheckboxGroupField
            label="Б21. Што очекувате да содржи Group Coaching програмата?"
            values={data.programContent}
            onChange={(v) => set("programContent", v)}
            options={[
              "Неделни Live сесии",
              "Детално изучување на trading концептот",
              "Заедничка Market анализа",
              "Домашни задачи",
              "Trading Journal и Review",
              "Анализа на trades од учениците",
              "Q&A сесии",
              "Приватна Discord или Telegram група",
              "Снимки од сите сесии",
              "Краток индивидуален feedback",
              "Материјали и Trading Plan",
              "Друго",
            ]}
          />
          <RadioField
            label="Б22. Колку често би сакале да се одржуваат групните сесии?"
            value={data.sessionFrequency}
            onChange={(v) => set("sessionFrequency", v)}
            options={["Еднаш неделно", "Двапати неделно", "Трипати месечно", "Двапати месечно", "Не сум сигурен"]}
          />
          <RadioField
            label="Б23. Колкаво времетраење на една Group Coaching сесија најмногу би ви одговарало?"
            value={data.sessionDuration}
            onChange={(v) => set("sessionDuration", v)}
            options={["60 минути", "90 минути", "120 минути", "Не ми е важно доколку сесијата е квалитетна"]}
          />
          <SliderField
            label="Б24. Колку ви е важен краток индивидуален feedback во рамки на групната програма?"
            value={data.individualFeedbackImportance}
            onChange={(v) => set("individualFeedbackImportance", v)}
            minLabel="Воопшто не ми е важен"
            maxLabel="Исклучително ми е важен"
          />
          <RadioField
            label="Б25. Колку сте подготвени да инвестирате во Group Coaching?"
            value={data.investment}
            onChange={(v) => set("investment", v)}
            options={[
              "Од 50 до 100 € месечно",
              "Би преферирал еднократна уплата за целата програма",
              "Би платил 3 месеци унапред со попуст",
              "Би платил 6 месеци унапред со попуст",
              "Зависи од времетраењето, содржината и поддршката",
            ]}
          />
          <RadioField
            label="Б26. Кој начин на плаќање најмногу би ви одговарал?"
            value={data.paymentMethod}
            onChange={(v) => set("paymentMethod", v)}
            options={["Месечна уплата", "Еднократна уплата за повеќе месеци"]}
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
            label="Б27. Кога би биле подготвени да започнете?"
            value={data.startTime}
            onChange={(v) => set("startTime", v)}
            options={[
              "Веднаш",
              "Во следните 7 дена",
              "Во следните 30 дена",
              "Во следните 2–3 месеци",
              "Само собирам информации",
              "Не сум сигурен",
            ]}
          />
          <TextAreaField
            label="Б28. Што очекувате од менторот и групата, а што сте подготвени вие да направите?"
            value={data.mentorExpectations}
            onChange={(v) => set("mentorExpectations", v)}
          />
          <TextAreaField
            label="Б29. Дали има нешто дополнително што треба да знаеме за вас?"
            value={data.additionalInfo}
            onChange={(v) => set("additionalInfo", v)}
            placeholder="Опционално"
          />
          <ConfirmField
            id="group-confirm-1"
            label="Разбирам дека менторството е едукативен процес и дека не постои гаранција за заработка, профитабилност или успешно поминување на Prop Firm Challenge."
            checked={data.confirmRealistic}
            onChange={(v) => set("confirmRealistic", v)}
          />
          <ConfirmField
            id="group-confirm-2"
            label="Разбирам дека моите резултати зависат од мојата работа, дисциплина, Risk Management и примена на наученото."
            checked={data.confirmResponsibility}
            onChange={(v) => set("confirmResponsibility", v)}
          />
          <ConfirmField
            id="group-confirm-3"
            label="Се согласувам TradingLab.mk да ги користи информациите доставени во оваа форма за процена на мојата апликација и за да ме контактира во врска со Group Coaching програмата."
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
