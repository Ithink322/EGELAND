import { type FormEvent, useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { COURSE_OPTIONS } from "../data/mockStudents";
import type { CreateStudentInput, Student } from "../types/students";
import { PanelHero } from "./uiKit/PanelHero";

interface StudentCreateFormProps {
  onCreate: (input: CreateStudentInput) => Promise<Student>;
  onCreated: (student: Student) => void;
}

type Errors = Partial<Record<keyof CreateStudentInput, string>>;

const PHONE_PATTERN = /^7\d{10}$/;

const INITIAL_FORM: CreateStudentInput = {
  name: "",
  email: "",
  phone: "",
  course: "",
  status: "active",
};

const formatRussianPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (!PHONE_PATTERN.test(digits)) {
    return value;
  }

  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
};

const validate = (values: CreateStudentInput): Errors => {
  const nextErrors: Errors = {};

  if (!values.name.trim()) {
    nextErrors.name = "Введите имя ученика.";
  }

  if (!values.email.trim()) {
    nextErrors.email = "Введите email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = "Укажите корректный email.";
  }

  if (!values.phone.trim()) {
    nextErrors.phone = "Введите телефон.";
  } else if (!PHONE_PATTERN.test(values.phone)) {
    nextErrors.phone = "Используйте формат +7 (951) 322-42-54.";
  }

  if (!values.course.trim()) {
    nextErrors.course = "Выберите курс.";
  }

  if (!values.status) {
    nextErrors.status = "Выберите статус.";
  }

  return nextErrors;
};

export const StudentCreateForm = ({
  onCreate,
  onCreated,
}: StudentCreateFormProps) => {
  const [values, setValues] = useState<CreateStudentInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormDirty = useMemo(
    () =>
      values.name !== INITIAL_FORM.name ||
      values.email !== INITIAL_FORM.email ||
      values.phone !== INITIAL_FORM.phone ||
      values.course !== INITIAL_FORM.course ||
      values.status !== INITIAL_FORM.status,
    [values],
  );

  const updateField = <K extends keyof CreateStudentInput>(field: K, value: CreateStudentInput[K]) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdStudent = await onCreate({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: formatRussianPhone(values.phone),
      });

      setValues(INITIAL_FORM);
      onCreated(createdStudent);
    } catch {
      setSubmitError("Не удалось создать ученика.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="detail-stack" onSubmit={handleSubmit}>
      <PanelHero
        aside={
          <span className={`draft-indicator ${isFormDirty ? "draft-indicator--active" : ""}`}>
            {isFormDirty ? "Черновик" : "Новый"}
          </span>
        }
        description="После создания ученик сразу появится в общем списке."
        eyebrow="Новый ученик"
        title="Создание карточки"
      />

      <section className="detail-section form-grid">
        <label className="field">
          <span>Имя</span>
          <input
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Анна Смирнова"
          />
          {errors.name ? <small className="field-error">{errors.name}</small> : null}
        </label>

        <label className="field">
          <span>Email</span>
          <input
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="student@example.com"
            type="email"
          />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>

        <label className="field phone-field">
          <span>Телефон</span>
          <PhoneInput
            buttonClass="phone-field__button"
            country="ru"
            countryCodeEditable={false}
            disableCountryGuess
            disableDropdown
            inputClass="phone-field__input"
            inputProps={{
              name: "phone",
              required: true,
            }}
            masks={{ ru: "(...) ...-..-.." }}
            onChange={(value) => updateField("phone", value)}
            placeholder="+7 (951) 322-42-54"
            specialLabel=""
            value={values.phone}
          />
          {errors.phone ? <small className="field-error">{errors.phone}</small> : null}
        </label>

        <label className="field">
          <span>Курс</span>
          <select
            value={values.course}
            onChange={(event) => updateField("course", event.target.value)}
          >
            <option value="">Выберите курс</option>
            {COURSE_OPTIONS.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course ? <small className="field-error">{errors.course}</small> : null}
        </label>

        <label className="field">
          <span>Статус</span>
          <select
            value={values.status}
            onChange={(event) =>
              updateField("status", event.target.value as CreateStudentInput["status"])
            }
          >
            <option value="active">Активный</option>
            <option value="excluded">Исключен</option>
          </select>
          {errors.status ? <small className="field-error">{errors.status}</small> : null}
        </label>
      </section>

      {submitError ? <div className="inline-message inline-message--error">{submitError}</div> : null}

      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Создаем..." : "Создать ученика"}
      </button>
    </form>
  );
};
