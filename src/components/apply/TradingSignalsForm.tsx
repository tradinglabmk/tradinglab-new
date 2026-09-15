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

export interface TradingSignalsData {
  tradingDuration: string;
  knowledgeLevel: number;
  previousSignals: string;
  previousExperience: string;
  accountType: string;
  markets: string[];
  signalType: string;
  checkFrequency: string;
  weeklySignals: string;
  signalContent: string[];
  signalBenefits: string[];
  analysisDepth: string;
  importantResult: string;
  capital: string;
  deposit: string;
  affordableCapital: string;
  riskPerSignal: string;
  maxDrawdown: string;
  positionSize: string;
  losingStreak: string;
  expectedResults: string;
  investment: string;
  communication: string[];
  startTime: string;
  additionalInfo: string;
  confirmRisk: boolean;
  confirmPastResults: boolean;
  confirmResponsibility: boolean;
  confirmAccountManagement: boolean;
  confirmAffordableCapital: boolean;
  confirmContact: boolean;
}

const initialData: TradingSignalsData = {
  tradingDuration: "",
  knowledgeLevel: 5,
  previousSignals: "",
  previousExperience: "",
  accountType: "",
  markets: [],
  signalType: "",
  checkFrequency: "",
  weeklySignals: "",
  signalContent: [],
  signalBenefits: [],
  analysisDepth: "",
  importantResult: "",
  capital: "",
  deposit: "",
  affordableCapital: "",
  riskPerSignal: "",
  maxDrawdown: "",
  positionSize: "",
  losingStreak: "",
  expectedResults: "",
  investment: "",
  communication: [],
  startTime: "",
  additionalInfo: "",
  confirmRisk: false,
  confirmPastResults: false,
  confirmResponsibility: false,
  confirmAccountManagement: false,
  confirmAffordableCapital: false,
  confirmContact: false,
};

interface Props {
  onSubmit: (data: TradingSignalsData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function TradingSignalsForm({ onSubmit, onBack, isSubmitting }: Props) {
  const [section, setSection] = useState(1);
  const [data, setData] = useState<TradingSignalsData>(initialData);
  const set = <K extends keyof TradingSignalsData>(key: K, value: TradingSignalsData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const validateSection = (): boolean => {
    if (section === 1) {
      return Boolean(
        data.tradingDuration &&
          data.previousSignals &&
          data.accountType &&
          data.markets.length &&
          data.signalType &&
          data.checkFrequency,
      );
    }
    if (section === 2) {
      return Boolean(
        data.weeklySignals &&
          data.signalContent.length &&
          data.signalBenefits.length &&
          data.analysisDepth &&
          data.importantResult.trim(),
      );
    }
    if (section === 3) {
      return Boolean(
        data.capital &&
          data.deposit &&
          data.affordableCapital &&
          data.riskPerSignal &&
          data.maxDrawdown &&
          data.positionSize,
      );
    }
    if (section === 4) {
      return Boolean(
        data.losingStreak &&
          data.expectedResults &&
          data.investment &&
          data.communication.length,
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
    if (!data.startTime) {
      toast.error("Ве молиме пополнете ги задолжителните полиња.");
      return;
    }
    if (
      !data.confirmRisk ||
      !data.confirmPastResults ||
      !data.confirmResponsibility ||
      !data.confirmAccountManagement ||
      !data.confirmAffordableCapital ||
      !data.confirmContact
    ) {
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
          <h3 className="form-section-title">Искуство и Trading сметка</h3>
          <RadioField
            label="В1. Колку долго се занимавате со trading?"
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
            label="В2. Како би го оцениле вашето моментално знаење?"
            value={data.knowledgeLevel}
            onChange={(v) => set("knowledgeLevel", v)}
            minLabel="Целосен почетник"
            maxLabel="Напредно знаење"
          />
          <RadioField
            label="В3. Дали претходно сте користеле Trading Signals?"
            value={data.previousSignals}
            onChange={(v) => set("previousSignals", v)}
            options={[
              "Да, сè уште користам",
              "Да, но повеќе не ги користам",
              "Сум пробал краток период",
              "Никогаш не сум користел",
              "Не сум сигурен како функционираат",
            ]}
          />
          <TextAreaField
            label="В4. Какво е вашето претходно искуство со Trading Signals?"
            hint="Објаснете што ви се допаднало, што не функционирало и дали сте имале позитивно или негативно искуство."
            value={data.previousExperience}
            onChange={(v) => set("previousExperience", v)}
            placeholder="Опционално"
          />
          <RadioField
            label="В5. На каква сметка планирате да ги користите сигналите?"
            value={data.accountType}
            onChange={(v) => set("accountType", v)}
            options={[
              "Demo сметка",
              "Лична Live сметка",
              "Prop Firm Challenge",
              "Funded Prop Firm сметка",
              "На повеќе видови сметки",
              "Сè уште немам отворено сметка",
            ]}
          />
          <CheckboxGroupField
            label="В6. За кои пазари сте најмногу заинтересирани?"
            values={data.markets}
            onChange={(v) => set("markets", v)}
            options={["Forex", "Indices", "Commodities", "Gold и Silver", "Stocks", "Futures", "Crypto", "Отворен сум за повеќе пазари"]}
          />
          <RadioField
            label="В7. Каков тип Trading Signals најмногу ви одговара?"
            value={data.signalType}
            onChange={(v) => set("signalType", v)}
            options={[
              "Scalping сигнали",
              "Day Trading сигнали",
              "Swing Trading сигнали",
              "Подолгорочни Position Trading идеи",
              "Комбинација од повеќе стилови",
              "Не сум сигурен",
            ]}
          />
          <RadioField
            label="В8. Колку често можете да ги проверувате сигналите и отворените позиции?"
            value={data.checkFrequency}
            onChange={(v) => set("checkFrequency", v)}
            options={[
              "Можам да реагирам веднаш",
              "Можам да проверувам неколку пати во текот на денот",
              "Можам да проверувам еднаш дневно",
              "Најмногу ми одговараат Swing сигнали без потреба од брза реакција",
              "Не сум сигурен",
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
          <h3 className="form-section-title">Очекувања од сигналите</h3>
          <RadioField
            label="В9. Колку Trading Signals неделно очекувате?"
            value={data.weeklySignals}
            onChange={(v) => set("weeklySignals", v)}
            options={[
              "Од 1 до 3 квалитетни сигнали",
              "Од 3 до 5 сигнали",
              "Најмалку еден сигнал дневно",
              "Колку што дозволува пазарот",
              "Не ми е важна количината, туку квалитетот",
              "Не сум сигурен",
            ]}
          />
          <CheckboxGroupField
            label="В10. Што очекувате да содржи еден Trading Signal?"
            values={data.signalContent}
            onChange={(v) => set("signalContent", v)}
            options={[
              "Точен Entry",
              "Entry зона",
              "Stop Loss",
              "Еден Take Profit",
              "Повеќе Take Profit Targets",
              "Препоручан Risk Percentage",
              "Risk-to-Reward Ratio",
              "Техничко објаснување",
              "Fundamental и Macro контекст",
              "COT и позиционирање",
              "Инструкции за управување со позицијата",
              "Известување за затворање или промена на позицијата",
              "Кратка едукативна анализа",
            ]}
          />
          <CheckboxGroupField
            label="В11. Што најмногу очекувате да добиете од сигналите?"
            values={data.signalBenefits}
            onChange={(v) => set("signalBenefits", v)}
            options={[
              "Јасна trading насока",
              "Подобри Entry можности",
              "Заштеда на време при анализа",
              "Подобра дисциплина",
              "Помош при управување со позициите",
              "Подобро разбирање на пазарот",
              "Дополнителна потврда за сопствената анализа",
              "Можност постепено да учам од анализите",
              "Краткорочна заработка",
              "Долгорочна конзистентност",
              "Подготовка за Prop Firm Challenge",
              "Друго",
            ]}
          />
          <RadioField
            label="В12. Дали сакате само да ги следите сигналите или сакате да ја разбирате анализата зад нив?"
            value={data.analysisDepth}
            onChange={(v) => set("analysisDepth", v)}
            options={[
              "Сакам само јасни Entry, Stop Loss и Targets",
              "Сакам сигнал со кратко објаснување",
              "Сакам детална анализа и едукативен контекст",
              "Сакам со текот на времето самостојно да научам да анализирам",
              "Не сум сигурен",
            ]}
          />
          <TextAreaField
            label="В13. Кој е најважниот резултат што го очекувате од сигналите?"
            hint="Наведете дали очекувате дополнителна насока, подобра дисциплина, учење, помош со Prop Firm, долгорочна конзистентност или друг конкретен резултат."
            value={data.importantResult}
            onChange={(v) => set("importantResult", v)}
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
          <h3 className="form-section-title">Капитал и Risk Management</h3>
          <RadioField
            label="В14. Колкав сопствен trading капитал планирате да користите?"
            hint="Висината на капиталот не влијае врз прифаќањето и не претставува услов за користење на услугата. Информацијата се користи исклучиво за подобро разбирање на вашиот Risk Management и очекувања."
            value={data.capital}
            onChange={(v) => set("capital", v)}
            options={[
              "Во почетокот ќе користам само Demo сметка",
              "Помалку од 250 €",
              "Од 250 до 500 €",
              "Од 500 до 1.000 €",
              "Од 1.000 до 2.500 €",
              "Од 2.500 до 5.000 €",
              "Повеќе од 5.000 €",
              "Ќе користам Prop Firm сметка",
              "Сè уште не сум одлучил",
            ]}
          />
          <RadioField
            label="В15. Доколку сè уште немате Live сметка, колку би биле подготвени да депонирате кога ќе започнете?"
            hint="Никогаш не треба да депонирате средства што не можете да си дозволите да ги изгубите."
            value={data.deposit}
            onChange={(v) => set("deposit", v)}
            options={[
              "Не планирам да депонирам и прво ќе користам Demo",
              "До 250 €",
              "Од 250 до 500 €",
              "Од 500 до 1.000 €",
              "Од 1.000 до 2.500 €",
              "Повеќе од 2.500 €",
              "Зависи од резултатите и мојата подготвеност",
              "Сè уште не сум одлучил",
            ]}
          />
          <RadioField
            label="В16. Дали капиталот што планирате да го користите е капитал што можете да си дозволите да го изгубите?"
            value={data.affordableCapital}
            onChange={(v) => set("affordableCapital", v)}
            options={["Да", "Да, но би започнал со многу мал ризик", "Не сум сигурен", "Не"]}
          />
          <RadioField
            label="В17. Колкав ризик би користеле по еден Trading Signal?"
            value={data.riskPerSignal}
            onChange={(v) => set("riskPerSignal", v)}
            options={[
              "До 0,25% од сметката",
              "До 0,50% од сметката",
              "До 1% од сметката",
              "Од 1% до 2% од сметката",
              "Повеќе од 2% од сметката",
              "Не знам како се пресметува ризикот",
              "Би го следел препорачаниот Risk Management",
            ]}
          />
          <RadioField
            label="В18. Колкав максимален месечен Drawdown можете психолошки и финансиски да го прифатите?"
            value={data.maxDrawdown}
            onChange={(v) => set("maxDrawdown", v)}
            options={["До 2%", "Од 2% до 5%", "Од 5% до 10%", "Повеќе од 10%", "Не сум сигурен", "Не знам што значи Drawdown"]}
          />
          <RadioField
            label="В19. Дали знаете самостојно да ја пресметате големината на позицијата?"
            value={data.positionSize}
            onChange={(v) => set("positionSize", v)}
            options={[
              "Да, знам правилно да го пресметам ризикот",
              "Да, но ми е потребен Position Size Calculator",
              "Делумно, но ми е потребна дополнителна насока",
              "Не знам како се пресметува големината на позицијата",
              "Очекувам точната големина на позицијата да биде дадена во сигналот",
            ]}
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
          <h3 className="form-section-title">Реални очекувања</h3>
          <RadioField
            label="В20. Како би реагирале доколку добиеме серија од 3 до 5 загубени сигнали?"
            value={data.losingStreak}
            onChange={(v) => set("losingStreak", v)}
            options={[
              "Би продолжил да го следам системот со ист ризик",
              "Би го намалил ризикот",
              "Би направил пауза и би ја разгледал анализата",
              "Би престанал да ги следам сигналите",
              "Би го зголемил ризикот за да ги вратам загубите",
              "Не сум сигурен",
            ]}
          />
          <RadioField
            label="В21. Какви резултати реално очекувате од Trading Signals?"
            value={data.expectedResults}
            onChange={(v) => set("expectedResults", v)}
            options={[
              "Немам фиксен процент и разбирам дека резултатите варираат",
              "Очекувам позитивен резултат на долг рок",
              "Просечно од 1% до 3% месечно",
              "Просечно од 3% до 5% месечно",
              "Просечно од 5% до 10% месечно",
              "Повеќе од 10% месечно",
              "Очекувам брзо да го зголемам капиталот",
              "Не сум сигурен што е реално",
            ]}
          />
          <RadioField
            label="В22. Колку сте подготвени да инвестирате месечно за квалитетна Trading Signals услуга?"
            value={data.investment}
            onChange={(v) => set("investment", v)}
            options={["До 50 € со твој личен брокер", "До 0 € со брокер препорачан од Trading Lab"]}
          />
          <CheckboxGroupField
            label="В23. Кој начин на комуникација најмногу ви одговара за добивање сигнали?"
            values={data.communication}
            onChange={(v) => set("communication", v)}
            options={["Discord", "Telegram"]}
          />
          <RadioField
            label="В24. Кога би биле подготвени да започнете?"
            value={data.startTime}
            onChange={(v) => set("startTime", v)}
            options={[
              "Веднаш",
              "Во следните 7 дена",
              "Во следните 30 дена",
              "Во следните 2–3 месеци",
              "Прво би сакал повеќе информации",
              "Само собирам информации",
            ]}
          />
          <TextAreaField
            label="В25. Дали има нешто дополнително што треба да знаеме за вашето искуство, капитал или очекувања?"
            value={data.additionalInfo}
            onChange={(v) => set("additionalInfo", v)}
            placeholder="Опционално"
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
          <h3 className="form-section-title">Потврди и согласност</h3>
          <ConfirmField
            id="signals-confirm-1"
            label="Разбирам дека Trading Signals не претставуваат гаранција за заработка и дека секој trading систем може да има загубени позиции и периоди на Drawdown."
            checked={data.confirmRisk}
            onChange={(v) => set("confirmRisk", v)}
          />
          <ConfirmField
            id="signals-confirm-2"
            label="Разбирам дека минатите резултати не гарантираат идни резултати."
            checked={data.confirmPastResults}
            onChange={(v) => set("confirmPastResults", v)}
          />
          <ConfirmField
            id="signals-confirm-3"
            label="Разбирам дека моите резултати зависат од мојата дисциплина, Risk Management и правилна примена на сигналите."
            checked={data.confirmResponsibility}
            onChange={(v) => set("confirmResponsibility", v)}
          />
          <ConfirmField
            id="signals-confirm-4"
            label="Разбирам дека сум единствено одговорен/на за управувањето со мојата trading сметка и извршувањето на позициите."
            checked={data.confirmAccountManagement}
            onChange={(v) => set("confirmAccountManagement", v)}
          />
          <ConfirmField
            id="signals-confirm-5"
            label="Потврдувам дека капиталот со кој планирам да тргувам е капитал што можам да си дозволам да го изгубам."
            checked={data.confirmAffordableCapital}
            onChange={(v) => set("confirmAffordableCapital", v)}
          />
          <ConfirmField
            id="signals-confirm-6"
            label="Се согласувам TradingLab.mk да ги користи информациите доставени во оваа форма за процена на мојата апликација и за да ме контактира."
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
