import { useState } from "react";
import { toast } from "sonner";
import { MentorshipForm, type MentorshipData } from "./MentorshipForm";
import { GroupCoachingForm, type GroupCoachingData } from "./GroupCoachingForm";
import { TradingSignalsForm, type TradingSignalsData } from "./TradingSignalsForm";

const ageGroups = [
  "Под 18 години",
  "Од 18 до 24 години",
  "Од 25 до 34 години",
  "Од 35 до 44 години",
  "Од 45 до 54 години",
  "Над 55 години",
];

const contactMethods = ["Е-пошта", "Instagram", "Discord"];

const serviceOptions = [
  {
    title: "1-на-1 индивидуално Mentorship",
    description: "Персонализирано водство, целосно прилагодено на вас.",
  },
  {
    title: "Group Coaching во мала група",
    description: "Едукација и поддршка заедно со мала група трговци.",
  },
  {
    title: "Trading Signals",
    description: "Аналитички trading идеи со Entry, SL и TP нивоа.",
  },
];

const additionalContactMeta: Record<string, { label: string; placeholder: string }> = {
  Instagram: { label: "Instagram профил *", placeholder: "@instagram_profil" },
  Discord: { label: "Discord корисничко име *", placeholder: "@discord_username" },
  "Е-пошта": { label: "Е-пошта адреса *", placeholder: "example@gmail.com" },
};

interface Step1Fields {
  fullName: string;
  email: string;
  ageGroup: string;
  country: string;
  city: string;
  contactMethod: string;
  additionalContact: string;
}

const initialStep1: Step1Fields = {
  fullName: "",
  email: "",
  ageGroup: "",
  country: "",
  city: "",
  contactMethod: "",
  additionalContact: "",
};

export function ApplicationForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fields, setFields] = useState<Step1Fields>(initialStep1);
  const [service, setService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof Step1Fields>(key: K, value: Step1Fields[K]) =>
    setFields((f) => ({ ...f, [key]: value }));

  const contactMeta = additionalContactMeta[fields.contactMethod];

  const handleStep1Next = () => {
    if (
      !fields.fullName.trim() ||
      !fields.email.trim() ||
      !fields.ageGroup ||
      !fields.country.trim() ||
      !fields.city.trim() ||
      !fields.contactMethod ||
      (contactMeta && !fields.additionalContact.trim())
    ) {
      toast.error("Ве молиме пополнете ги задолжителните полиња.");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!service) {
      toast.error("Ве молиме изберете услуга.");
      return;
    }
    setStep(3);
  };

  const submitApplication = async (
    formData?: MentorshipData | GroupCoachingData | TradingSignalsData,
  ) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          service,
          ...(formData && service === "1-на-1 индивидуално Mentorship"
            ? { mentorshipData: formData }
            : {}),
          ...(formData && service === "Group Coaching во мала група"
            ? { groupCoachingData: formData }
            : {}),
          ...(formData && service === "Trading Signals"
            ? { tradingSignalsData: formData }
            : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка при испраќање");

      toast.success("Успешно ја испративте апликацијата. Ви благодариме!🔥");
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Имаше грешка при испраќање на апликацијата. Ве молиме обидете се повторно!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    if (service === "Group Coaching во мала група") {
      return (
        <GroupCoachingForm
          onSubmit={(data) => submitApplication(data)}
          onBack={() => setStep(2)}
          isSubmitting={isSubmitting}
        />
      );
    }
    if (service === "Trading Signals") {
      return (
        <TradingSignalsForm
          onSubmit={(data) => submitApplication(data)}
          onBack={() => setStep(2)}
          isSubmitting={isSubmitting}
        />
      );
    }
    return (
      <MentorshipForm
        onSubmit={(data) => submitApplication(data)}
        onBack={() => setStep(2)}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (step === 2) {
    return (
      <div className="join-form">
        <div className="form-field">
          <label>За која услуга сте заинтересирани? *</label>
          <div className="service-options">
            {serviceOptions.map(({ title, description }) => (
              <button
                key={title}
                type="button"
                className={`service-option${service === title ? " selected" : ""}`}
                onClick={() => setService(title)}
              >
                <strong>{title}</strong>
                <span>{description}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="form-nav">
          <button className="form-back" type="button" onClick={() => setStep(1)}>
            Назад
          </button>
          <button className="form-submit" type="button" onClick={handleStep2Next}>
            СЛЕДНО
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-form">
      <div className="form-field">
        <label htmlFor="fullName">Име и презиме</label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          value={fields.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="email">Е-пошта</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(e) => setField("email", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="ageGroup">Возрасна група</label>
        <select
          id="ageGroup"
          value={fields.ageGroup}
          onChange={(e) => setField("ageGroup", e.target.value)}
        >
          <option value="" disabled>
            Изберете одговор
          </option>
          {ageGroups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="country">Држава</label>
        <input
          id="country"
          type="text"
          value={fields.country}
          onChange={(e) => setField("country", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="city">Град</label>
        <input
          id="city"
          type="text"
          value={fields.city}
          onChange={(e) => setField("city", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="contactMethod">Преферирен начин на контакт</label>
        <select
          id="contactMethod"
          value={fields.contactMethod}
          onChange={(e) => setField("contactMethod", e.target.value)}
        >
          <option value="" disabled>
            Изберете одговор
          </option>
          {contactMethods.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      {contactMeta && (
        <div className="form-field">
          <label htmlFor="additionalContact">{contactMeta.label}</label>
          <input
            id="additionalContact"
            type="text"
            placeholder={contactMeta.placeholder}
            value={fields.additionalContact}
            onChange={(e) => setField("additionalContact", e.target.value)}
          />
        </div>
      )}
      <button className="form-submit" type="button" onClick={handleStep1Next}>
        СЛЕДНО
      </button>
    </div>
  );
}
