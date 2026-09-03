import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  EntityField,
  MaybeRTF,
  VisibilityWrapper,
  createItemSource,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  getDefaultRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

const faqTypographyScopeClass = "yer-faq-typography";

const faqTypographyStyles = `
  .${faqTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${faqTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${faqTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${faqTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${faqTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${faqTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${faqTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${faqTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${faqTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${faqTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${faqTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
  .${faqTypographyScopeClass} summary,
  .${faqTypographyScopeClass} .yer-faq__answer {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type FaqItem = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

type FaqProps = {
  heading: StyledTextProps;
  items: typeof faqItemsSource.value;
  questionStyles: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  answerStyles: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const buildTextStyle = (
  styles: StyledTextValue,
  vars: { family: string; size: string; weight: string; transform: string },
  color?: ThemeColor,
) => ({
  color: getThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? vars.family : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? vars.size : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? vars.weight : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? vars.transform : styles.textTransform,
});

const buildRichTextStyleOverrides = (
  styles: StyledTextValue,
  vars: { family: string; size: string; weight: string },
  color?: ThemeColor,
) => ({
  color: getThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? vars.family : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? vars.size : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? vars.weight : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform: (styles.textTransform === "default"
    ? "default"
    : styles.textTransform) as
    "default" | "none" | "uppercase" | "lowercase" | "capitalize",
});

const makeFaqItem = (question: string, answer: string): FaqItem => ({
  question: {
    field: "",
    constantValue: {
      defaultValue: question,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  answer: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(answer),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
});

const faqItemsSource = createItemSource({
  label: "FAQ Items",
  mappingFields: {
    question: {
      type: "entityField",
      label: "Question",
      filter: { types: ["type.string"] },
    },
    answer: {
      type: "entityField",
      label: "Answer",
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    makeFaqItem(
      "Do I need an appointment for a stylist?",
      "Walk-ins are welcome, but we recommend booking an appointment in advance to ensure a dedicated stylist and a prepared fitting room.",
    ),
    makeFaqItem(
      "Where is the best place to park?",
      "Street parking is available near [[address.line1]], and the North Parking Garage (Level 2) offers the closest covered access.",
    ),
    makeFaqItem(
      "Can I return items I bought online at this store?",
      "Yes, we accept returns for all online purchases at our customer service desk or any checkout station.",
    ),
    makeFaqItem(
      "Do you offer contactless pickup?",
      "Yes, we offer curbside pickup. Select [[address.city]] at checkout and call the store when you arrive.",
    ),
    makeFaqItem(
      "Is tailoring available for clothes bought elsewhere?",
      "Our tailoring services are reserved for [[name]] merchandise to ensure the highest quality standards.",
    ),
  ],
});

const faqFields: YextFields<FaqProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: "Text",
        filter: { types: ["type.string"] },
      },
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  items: faqItemsSource.field,
  questionStyles: {
    label: "Question Styles",
    type: "object",
    objectFields: {
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  answerStyles: {
    label: "Answer Styles",
    type: "object",
    objectFields: {
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
};

export const EssentialRetailFaqSectionComponent: PuckComponent<
  FaqProps
> = ({ id, heading, items, questionStyles, answerStyles, section, puck }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailFaqSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedItems = faqItemsSource.resolveItems(items, streamDocument);

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          className={`yer-faq ${faqTypographyScopeClass}`}
          as="section"
          background={section.backgroundColor}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
              .yer-faq {
                padding: 40px 0;
              }

              .yer-faq__inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 15px;
              }

              .yer-faq__heading {
                margin: 0;
                line-height: 1.2;
                letter-spacing: 0.01em;
              }

              .yer-faq__list {
                margin-top: 32px;
                border-top: 1px solid currentColor;
              }

              .yer-faq__item {
                border-bottom: 1px solid currentColor;
              }

              .yer-faq__summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                padding: 24px 0;
                cursor: pointer;
                list-style: none;
              }

              .yer-faq__summary::-webkit-details-marker {
                display: none;
              }

              .yer-faq__icon {
                position: relative;
                width: 20px;
                height: 20px;
                flex-shrink: 0;
              }

              .yer-faq__icon::before,
              .yer-faq__icon::after {
                content: "";
                position: absolute;
                background: currentColor;
                transition: transform 0.2s ease;
              }

              .yer-faq__icon::before {
                top: 50%;
                left: 10%;
                right: 10%;
                height: 2px;
                margin-top: -1px;
              }

              .yer-faq__icon::after {
                top: 10%;
                bottom: 10%;
                left: 50%;
                width: 2px;
                margin-left: -1px;
              }

              .yer-faq__item[open] .yer-faq__icon::after {
                transform: scaleY(0);
              }

              .yer-faq__answer {
                padding-bottom: 24px;
              }

              @media (min-width: 768px) {
                .yer-faq__inner {
                  padding-right: 32px;
                  padding-left: 32px;
                }
              }

              @media (min-width: 990px) {
                .yer-faq {
                  padding: 80px 0;
                }

                .yer-faq__inner {
                  padding-right: 60px;
                  padding-left: 60px;
                }
              }
            `}
          </style>
          <style>{faqTypographyStyles}</style>
          <div className="yer-faq__inner">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
                className="yer-faq__heading"
                style={buildTextStyle(
                  heading.styles,
                  {
                    family: "var(--fontFamily-h2-fontFamily)",
                    size: "var(--fontSize-h2-fontSize)",
                    weight: "var(--fontWeight-h2-fontWeight)",
                    transform: "var(--textTransform-h2-textTransform)",
                  },
                  heading.fontColor,
                )}
              >
                {resolvedHeading}
              </h2>
            </EntityField>
            <EntityField
              displayName="FAQ Items"
              fieldId={items.field}
              constantValueEnabled={items.constantValueEnabled}
            >
              <div className="yer-faq__list">
                {resolvedItems.map((item, index) => {
                  const resolvedQuestion =
                    resolveComponentData(
                      item.question,
                      locale,
                      streamDocument,
                      {
                        output: "plainText",
                      },
                    ) ?? "";
                  const answerOverrides = {
                    ...buildRichTextStyleOverrides(
                      answerStyles.styles,
                      {
                        family: "var(--fontFamily-body-fontFamily)",
                        size: "20px",
                        weight: "400",
                      },
                      answerStyles.fontColor,
                    ),
                    lineHeight: 1.2,
                    letterSpacing: "0.01em",
                  };
                  const resolvedAnswer = item.answer
                    ? resolveComponentData(
                        item.answer,
                        locale,
                        streamDocument,
                        {
                          richTextStyleOverrides: answerOverrides,
                        },
                      )
                    : undefined;

                  return (
                    <details
                      key={index}
                      className="yer-faq__item"
                      open={index === 0}
                    >
                      <summary
                        className="yer-faq__summary"
                        data-ya-track={`faqToggle${index}`}
                      >
                        <span
                          style={buildTextStyle(
                            questionStyles.styles,
                            {
                              family: "var(--fontFamily-h3-body)",
                              size: "20px",
                              weight: "700",
                              transform: "unset",
                            },
                            questionStyles.fontColor,
                          )}
                        >
                          {resolvedQuestion}
                        </span>
                        <span className="yer-faq__icon" aria-hidden="true" />
                      </summary>
                      <div className="yer-faq__answer">
                        {typeof resolvedAnswer === "string" ? (
                          <MaybeRTF
                            data={resolvedAnswer}
                            richTextStyleOverrides={answerOverrides}
                          />
                        ) : (
                          resolvedAnswer
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </EntityField>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailFaqSection: YextComponentConfig<FaqProps> = {
  label: "FAQ Section",
  fields: toPuckFields(faqFields),
  defaultProps: {
    heading: {
      text: {
        field: "",
        constantValue: {
          defaultValue: "FAQ",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      fontColor: undefined,
    },
    questionStyles: {
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      fontColor: undefined,
    },
    answerStyles: {
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      fontColor: undefined,
    },
    items: faqItemsSource.defaultValue,
    section: {
      visibleOnLivePage: true,
      backgroundColor: {
        selectedColor: "white",
        contrastingColor: "black",
      },
    },
  },
  render: EssentialRetailFaqSectionComponent,
};

export const config: SectionConfig = {
  id: "EssentialRetailFaqSection",
  displayName: "FAQ Section",
  description: "FAQ Section",
  pageSetTypes: ["ENTITY"],
};
