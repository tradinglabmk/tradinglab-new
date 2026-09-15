// Reusable field primitives for the multi-step application form, styled to
// match this site's existing .form-field / modal design (see styles.css).

interface RadioFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function RadioField({ label, hint, value, onChange, options }: RadioFieldProps) {
  return (
    <div className="form-field">
      <label>{label}</label>
      {hint && <p className="form-hint">{hint}</p>}
      <div className="option-group">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`option-chip${value === option ? " selected" : ""}`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

interface CheckboxGroupFieldProps {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
}

export function CheckboxGroupField({
  label,
  hint,
  values,
  onChange,
  options,
}: CheckboxGroupFieldProps) {
  const toggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className="form-field">
      <label>{label}</label>
      {hint && <p className="form-hint">{hint}</p>}
      <div className="option-group">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`option-chip${values.includes(option) ? " selected" : ""}`}
            onClick={() => toggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
  min?: number;
  max?: number;
}

export function SliderField({
  label,
  value,
  onChange,
  minLabel,
  maxLabel,
  min = 1,
  max = 10,
}: SliderFieldProps) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="slider-field">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="slider-value">{value}</div>
        <div className="slider-labels">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextAreaField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div className="form-field">
      <label>{label}</label>
      {hint && <p className="form-hint">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface ConfirmFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ConfirmField({ id, label, checked, onChange }: ConfirmFieldProps) {
  return (
    <div className="confirm-field">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="step-progress">
      <div className="step-progress-track">
        <div
          className="step-progress-fill"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <span className="step-progress-label">
        Чекор {step} од {total}
      </span>
    </div>
  );
}
