import React from "react";
import ReactDOM from "react-dom";
import { useFormik, FormikProvider, Form, useField } from "formik";
import "./styles.css";
import * as Yup from "yup";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TextInputLiveFeedback = ({ label, helpText, ...props }) => {
  const [field, meta] = useField(props);
  const [didFocus, setDidFocus] = React.useState(false);
  const handleFocus = () => setDidFocus(true);
  const showFeedback =
    (!!didFocus && field.value.trim().length > 2) || meta.touched;

  return (
    <div
      className={`form-control ${
        showFeedback ? (meta.error ? "invalid" : "valid") : ""
      }`}
    >
      <div className="flex items-center space-between">
        <label htmlFor={props.id}>{label}</label>
        {showFeedback ? (
          <div
            id={`${props.id}-feedback`}
            aria-live="polite"
            className="feedback text-sm"
          >
            {meta.error ? meta.error : "✓"}
          </div>
        ) : null}
      </div>
      <input
        {...props}
        {...field}
        aria-describedby={`${props.id}-feedback ${props.id}-help`}
        onFocus={handleFocus}
      />
      <div className="text-xs" id={`${props.id}-help`} tabIndex="-1">
        {helpText}
      </div>
    </div>
  );
};

const Example = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      await sleep(500);
      alert(JSON.stringify(values, null, 2));
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <TextInputLiveFeedback
          label="Email"
          id="email"
          name="email"
          helpText="Enter a valid email address."
          type="email"
        />
        <div>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </Form>
    </FormikProvider>
  );
};

ReactDOM.render(
  <div className="app">
    <h1 className="text-4xl">Accessible instant feedback with Formik 2</h1>
    <p className="text-lg">
      This example provides instant feedback for email validation. When users
      type, they receive feedback on whether their input is valid.
    </p>
    <div className="example">
      <Example />
    </div>
  </div>,
  document.getElementById("root")
);
