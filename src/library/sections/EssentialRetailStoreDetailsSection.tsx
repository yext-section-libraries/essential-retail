import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  HoursTable,
  Link,
  type AddressType,
  type DayOfWeekNames,
  type HoursType,
} from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";

const storeDetailsTypographyScopeClass = "yer-store-details-typography";

const storeDetailsTypographyStyles = `
  .${storeDetailsTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${storeDetailsTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${storeDetailsTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${storeDetailsTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${storeDetailsTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${storeDetailsTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${storeDetailsTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: 16px;
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${storeDetailsTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${storeDetailsTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${storeDetailsTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${storeDetailsTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
  .${storeDetailsTypographyScopeClass} address,
  .${storeDetailsTypographyScopeClass} .yer-store-details__bodyText,
  .${storeDetailsTypographyScopeClass} .yer-store-details__hoursTable,
  .${storeDetailsTypographyScopeClass} .yer-store-details__hoursTable th,
  .${storeDetailsTypographyScopeClass} .yer-store-details__hoursTable td,
  .${storeDetailsTypographyScopeClass} .yer-store-details__hoursTable span,
  .${storeDetailsTypographyScopeClass} .yer-store-details__hoursTable div {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${storeDetailsTypographyScopeClass} a.yer-store-details__phoneLink {
    text-decoration: underline;
  }
  .${storeDetailsTypographyScopeClass} a.yer-store-details__phoneLink:hover {
    text-decoration: none;
  }
`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledTextListProps = {
  text: YextEntityField<TranslatableString[]>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StoreDetailsHeadingsProps = {
  column1Heading: YextEntityField<TranslatableString>;
  column2Heading: YextEntityField<TranslatableString>;
  column3Heading: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  heading: StyledTextProps;
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type AddressFieldProps = {
  heading: StyledTextProps;
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
};

type HoursTableStyles = {
  startOfWeek: keyof DayOfWeekNames | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
};

type HoursFieldProps = {
  hours: YextEntityField<HoursType>;
  styles: HoursTableStyles;
};

type StoreDetailsProps = {
  heading: StyledTextProps;
  address: AddressFieldProps;
  phones: PhoneFieldProps;
  hours: HoursFieldProps;
  services: StyledTextListProps;
  headings: StoreDetailsHeadingsProps;
  websiteCta: ComprehensiveCTAValue;
  directionsCta: ComprehensiveCTAValue;
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

const makeSubheadingDefault = (text: string): StyledTextProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue: text,
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
});

const getTranslatableStringValue = (value: TranslatableString) => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value.defaultValue === "string") {
    return value.defaultValue;
  }

  return (
    Object.values(value).find(
      (entry): entry is string => typeof entry === "string",
    ) ?? ""
  );
};

const storeDetailsFields: YextFields<StoreDetailsProps> = {
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
    label: "Section Heading",
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: "Text",
        filter: {
          types: ["type.string"],
        },
      },
      styles: { label: "Text Styles", type: "styledText" },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  headings: {
    label: "Column Headings",
    type: "object",
    objectFields: {
      column1Heading: {
        type: "entityField",
        label: "Column 1 Heading",
        filter: {
          types: ["type.string"],
        },
      },
      column2Heading: {
        type: "entityField",
        label: "Column 2 Heading",
        filter: {
          types: ["type.string"],
        },
      },
      column3Heading: {
        type: "entityField",
        label: "Column 3 Heading",
        filter: {
          types: ["type.string"],
        },
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
  address: {
    label: "Address",
    type: "object",
    objectFields: {
      heading: {
        label: "Subheading",
        type: "object",
        objectFields: {
          text: {
            type: "entityField",
            label: "Text",
            filter: {
              types: ["type.string"],
            },
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
      address: {
        type: "entityField",
        label: "Address",
        filter: {
          types: ["type.address"],
        },
      },
      showRegion: {
        label: "Show Region",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showCountry: {
        label: "Show Country",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  phones: {
    label: "Phones",
    type: "object",
    objectFields: {
      heading: {
        label: "Subheading",
        type: "object",
        objectFields: {
          text: {
            type: "entityField",
            label: "Text",
            filter: {
              types: ["type.string"],
            },
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
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          number: {
            type: "entityField",
            label: "Number",
            filter: {
              types: ["type.phone"],
            },
          },
          label: {
            label: "Label",
            type: "text",
          },
        },
        defaultItemProps: {
          number: {
            field: "",
            constantValue: "",
            constantValueEnabled: true,
          } as YextEntityField<string>,
          label: "",
        },
        getItemSummary: (item) => item.label || item.number.field || "Phone",
      },
      phoneFormat: {
        label: "Phone Format",
        type: "radio",
        options: [
          { label: "Domestic", value: "domestic" },
          { label: "International", value: "international" },
        ],
      },
      includeHyperlink: {
        label: "Include Hyperlink",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  websiteCta: {
    label: "Primary Call to Action",
    type: "comprehensiveCTA",
  },
  directionsCta: {
    label: "Secondary Call to Action",
    type: "comprehensiveCTA",
  },
  hours: {
    label: "Hours",
    type: "object",
    objectFields: {
      hours: {
        type: "entityField",
        label: "Hours",
        filter: {
          types: ["type.hours"],
        },
        disableConstantValueToggle: true,
      },
      styles: {
        label: "Hours Styles",
        type: "object",
        objectFields: {
          startOfWeek: {
            label: "Start Of Week",
            type: "select",
            options: [
              { label: "Monday", value: "monday" },
              { label: "Tuesday", value: "tuesday" },
              { label: "Wednesday", value: "wednesday" },
              { label: "Thursday", value: "thursday" },
              { label: "Friday", value: "friday" },
              { label: "Saturday", value: "saturday" },
              { label: "Sunday", value: "sunday" },
              { label: "Today", value: "today" },
            ],
          },
          collapseDays: {
            label: "Collapse Days",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          showAdditionalHoursText: {
            label: "Show Additional Hours Text",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
        },
      },
    },
  },
  services: {
    label: "Services",
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: "Text List",
        filter: {
          types: ["type.string"],
          includeListsOnly: true,
        },
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
};

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic",
) => {
  const cleaned = phoneNumberString.replace(/(?!^\+)\+|[^\d+]/g, "");
  const parsed = parsePhoneNumber(cleaned);

  if (!parsed.valid || !parsed.number) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const getPhoneLink = (phoneNumberString: string): string | undefined => {
  const cleaned = phoneNumberString.replace(/(?!^\+)\+|[^\d+]/g, "");
  const telDigits = cleaned.replace(/\D/g, "");

  if (!telDigits) {
    return undefined;
  }

  const parsed = parsePhoneNumber(cleaned);
  if (!parsed.valid || !parsed.number) {
    return undefined;
  }

  return telDigits;
};

const makeCtaValue = (
  label: string,
  link: string,
  variant: "primary" | "secondary",
  color: ThemeColor,
  eventName: string,
): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        label,
        link,
        linkType: "URL",
        ctaType: label === "Get Directions" ? "getDirections" : "textAndLink",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
  },
  styles: {
    variant,
    color,
    button: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      borderRadius: "default",
      letterSpacing: "default",
    },
  },
  eventName,
});

export const EssentialRetailStoreDetailsSectionComponent: PuckComponent<
  StoreDetailsProps
> = (props) => {
  const {
    id,
    heading,
    address,
    phones,
    hours,
    services,
    headings,
    websiteCta,
    directionsCta,
    section,
    puck,
  } = props;
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailStoreDetailsSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedAddressHeading =
    resolveComponentData(address.heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedPhoneHeading =
    resolveComponentData(phones.heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedAddress = resolveComponentData(
    address.address,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    hours.hours,
    locale,
    streamDocument,
  );
  const resolvedServices =
    resolveComponentData(services.text, locale, streamDocument) ?? [];
  const resolvedColumn1Heading =
    resolveComponentData(headings.column1Heading, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedColumn2Heading =
    resolveComponentData(headings.column2Heading, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedColumn3Heading =
    resolveComponentData(headings.column3Heading, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const phoneItems = (phones.items ?? [])
    .map((item) => {
      const resolvedNumber = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const normalized =
        typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";

      if (!normalized) {
        return null;
      }

      return {
        label: item.label?.trim() ?? "",
        originalNumber: normalized,
        formattedNumber: formatPhoneNumber(normalized, phones.phoneFormat),
        phoneLink: getPhoneLink(normalized),
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          as="section"
          className={`yer-store-details ${storeDetailsTypographyScopeClass}`}
          background={section.backgroundColor}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
                .yer-store-details {
                  padding: 40px 0;
                }

                .yer-store-details__inner {
                  max-width: 1440px;
                  margin: 0 auto;
                  padding: 0 15px;
                }

                .yer-store-details__grid {
                  display: grid;
                  gap: 32px;
                  margin-top: 32px;
                }

                .yer-store-details__title,
                .yer-store-details__cardTitle {
                  margin: 0;
                  font-family: var(--fontFamily-h2-fontFamily);
                  font-size: var(--fontSize-h2-fontSize);
                  font-weight: var(--fontWeight-h2-fontWeight);
                  text-transform: uppercase;
                  line-height: 1.3;
                  letter-spacing: 0.01em;
                }

                .yer-store-details__cardTitle {
                  font-size: 20px;
                  margin-bottom: 24px;
                }

                .yer-store-details__label {
                  margin: 0 0 12px;
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 1.3;
                  letter-spacing: 0.01em;
                }

                .yer-store-details__block + .yer-store-details__block {
                  margin-top: 12px;
                }

                .yer-store-details__bodyText,
                .yer-store-details__services {
                  font-size: 20px;
                  line-height: 1.4;
                  letter-spacing: 0.01em;
                }

                .yer-store-details__actions {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 12px;
                  margin-top: 24px;
                }

                .yer-store-details__services {
                  margin: 0;
                  padding-left: 30px;
                  list-style: disc;
                }

                .yer-store-details__hours {
                  font-size: 20px;
                  line-height: 1.4;
                  min-width: 0;
                  max-width: 100%;
                  overflow-x: hidden;
                }

                .yer-store-details__hoursTable {
                  display: block;
                  width: 100%;
                  min-width: 0;
                  max-width: 100%;
                  overflow-x: hidden;
                }

                .yer-store-details__hoursTable * {
                  min-width: 0;
                }

                .yer-store-details__hoursTable .HoursTable-interval,
                .yer-store-details__hoursTable [class*="HoursTable-interval"] {
                  min-width: 0;
                  max-width: 100%;
                  white-space: normal;
                  overflow-wrap: anywhere;
                  word-break: break-word;
                }

                .yer-store-details__hoursTable .HoursTable-interval *,
                .yer-store-details__hoursTable [class*="HoursTable-interval"] * {
                  min-width: 0;
                }

                .yer-store-details__phone {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                  line-height: 1.4;
                }

                .yer-store-details__phoneLink {
                  color: inherit;
                  text-decoration: underline;
                }

                .yer-store-details__phoneLink:hover {
                  text-decoration: none;
                }

                @media (min-width: 768px) {
                  .yer-store-details__inner {
                    padding-right: 32px;
                    padding-left: 32px;
                  }
                }

                @media (max-width: 989px) {
                  .yer-store-details__grid > article:nth-child(2),
                  .yer-store-details__grid > article:nth-child(2) > div,
                  .yer-store-details__grid > article:nth-child(2) > div > div,
                  .yer-store-details__grid > article:nth-child(2) .yer-store-details__hours,
                  .yer-store-details__grid > article:nth-child(2) .yer-store-details__hoursTable {
                    width: 100%;
                    max-width: none;
                  }

                  .yer-store-details__grid > article:nth-child(2) .yer-store-details__hoursTable.HoursTable {
                    display: block;
                    width: 100% !important;
                    max-width: none !important;
                  }

                  .yer-store-details__grid > article:nth-child(2) .yer-store-details__hoursTable.HoursTable .HoursTable-row {
                    display: grid !important;
                    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    width: 100% !important;
                  }

                  .yer-store-details__grid > article:nth-child(2) .yer-store-details__hoursTable.HoursTable .HoursTable-intervals {
                    text-align: right;
                  }
                }

                @media (min-width: 990px) {
                  .yer-store-details {
                    padding: 80px 0;
                  }

                  .yer-store-details__inner {
                    padding-right: 60px;
                    padding-left: 60px;
                  }

                  .yer-store-details__grid {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                  }

                  .yer-store-details__actions {
                    flex-direction: row;
                    gap: 16px;
                  }
                }
              `}
          </style>
          <style>{storeDetailsTypographyStyles}</style>
          <div className="yer-store-details__inner">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
                className="yer-store-details__title"
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
            <div className="yer-store-details__grid">
              <article>
                <EntityField
                  displayName="Column 1 Heading"
                  fieldId={headings.column1Heading.field}
                  constantValueEnabled={
                    headings.column1Heading.constantValueEnabled
                  }
                >
                  <h3
                    className="yer-store-details__cardTitle"
                    style={buildTextStyle(
                      headings.styles,
                      {
                        family: "var(--fontFamily-h3-fontFamily)",
                        size: "var(--fontSize-h3-fontSize)",
                        weight: "var(--fontWeight-h3-fontWeight)",
                        transform: "var(--textTransform-h3-textTransform)",
                      },
                      headings.fontColor,
                    )}
                  >
                    {resolvedColumn1Heading}
                  </h3>
                </EntityField>

                <div className="yer-store-details__block">
                  <EntityField
                    displayName="Address Subheading"
                    fieldId={address.heading.text.field}
                    constantValueEnabled={
                      address.heading.text.constantValueEnabled
                    }
                  >
                    <h4
                      className="yer-store-details__label"
                      style={buildTextStyle(
                        address.heading.styles,
                        {
                          family: "var(--fontFamily-h4-fontFamily)",
                          size: "var(--fontSize-h4-fontSize)",
                          weight: "var(--fontWeight-h4-fontWeight)",
                          transform: "var(--textTransform-h4-textTransform)",
                        },
                        address.heading.fontColor,
                      )}
                    >
                      {resolvedAddressHeading}
                    </h4>
                  </EntityField>
                  {resolvedAddress ? (
                    <EntityField
                      displayName="Address"
                      fieldId={address.address.field}
                      constantValueEnabled={
                        address.address.constantValueEnabled
                      }
                    >
                      <div className="yer-store-details__bodyText">
                        <Address
                          address={resolvedAddress}
                          showRegion={address.showRegion}
                          showCountry={address.showCountry}
                        />
                      </div>
                    </EntityField>
                  ) : null}
                </div>
                <div className="yer-store-details__block">
                  <EntityField
                    displayName="Phone Subheading"
                    fieldId={phones.heading.text.field}
                    constantValueEnabled={
                      phones.heading.text.constantValueEnabled
                    }
                  >
                    <h4
                      className="yer-store-details__label"
                      style={buildTextStyle(
                        phones.heading.styles,
                        {
                          family: "var(--fontFamily-h4-fontFamily)",
                          size: "var(--fontSize-h4-fontSize)",
                          weight: "var(--fontWeight-h4-fontWeight)",
                          transform: "var(--textTransform-h4-textTransform)",
                        },
                        phones.heading.fontColor,
                      )}
                    >
                      {resolvedPhoneHeading}
                    </h4>
                  </EntityField>
                  <div className="yer-store-details__phone">
                    {phoneItems.map((item, index) => {
                      const content = item.label
                        ? `${item.label} ${item.formattedNumber}`
                        : item.formattedNumber;
                      const phoneLink = item.phoneLink;

                      return (
                        <EntityField
                          key={`${item.originalNumber}-${index}`}
                          displayName="Phone Number"
                          fieldId={item.fieldId}
                          constantValueEnabled={item.constantValueEnabled}
                        >
                          {!phones.includeHyperlink || !phoneLink ? (
                            <div className="yer-store-details__bodyText">
                              {content}
                            </div>
                          ) : (
                            <Link
                              cta={{
                                link: phoneLink,
                                linkType: "PHONE",
                              }}
                              className="yer-store-details__phoneLink yer-store-details__bodyText"
                            >
                              {content}
                            </Link>
                          )}
                        </EntityField>
                      );
                    })}
                  </div>
                </div>
                <div className="yer-store-details__actions">
                  <EntityField
                    displayName="Website Call to Action"
                    fieldId={websiteCta.data.cta.field}
                    constantValueEnabled={
                      websiteCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={websiteCta as Partial<ComprehensiveCTAValue>}
                    />
                  </EntityField>
                  <EntityField
                    displayName="Directions Call to Action"
                    fieldId={directionsCta.data.cta.field}
                    constantValueEnabled={
                      directionsCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={directionsCta as Partial<ComprehensiveCTAValue>}
                    />
                  </EntityField>
                </div>
              </article>
              <article>
                <EntityField
                  displayName="Column 2 Heading"
                  fieldId={headings.column2Heading.field}
                  constantValueEnabled={
                    headings.column2Heading.constantValueEnabled
                  }
                >
                  <h3
                    className="yer-store-details__cardTitle"
                    style={buildTextStyle(
                      headings.styles,
                      {
                        family: "var(--fontFamily-h3-fontFamily)",
                        size: "var(--fontSize-h3-fontSize)",
                        weight: "var(--fontWeight-h3-fontWeight)",
                        transform: "var(--textTransform-h3-textTransform)",
                      },
                      headings.fontColor,
                    )}
                  >
                    {resolvedColumn2Heading}
                  </h3>
                </EntityField>
                {resolvedHours ? (
                  <EntityField
                    displayName="Hours"
                    fieldId={hours.hours.field}
                    constantValueEnabled={hours.hours.constantValueEnabled}
                  >
                    <div className="yer-store-details__hours">
                      <HoursTable
                        hours={resolvedHours}
                        comingSoon={streamDocument.comingSoon}
                        startOfWeek={hours.styles.startOfWeek}
                        collapseDays={hours.styles.collapseDays}
                        className="yer-store-details__hoursTable"
                      />
                      {hours.styles.showAdditionalHoursText &&
                      typeof streamDocument.additionalHoursText === "string" &&
                      streamDocument.additionalHoursText.trim() ? (
                        <p
                          className="yer-store-details__bodyText"
                          style={{ marginTop: 12 }}
                        >
                          {streamDocument.additionalHoursText.trim()}
                        </p>
                      ) : null}
                    </div>
                  </EntityField>
                ) : null}
              </article>
              <article>
                <EntityField
                  displayName="Column 3 Heading"
                  fieldId={headings.column3Heading.field}
                  constantValueEnabled={
                    headings.column3Heading.constantValueEnabled
                  }
                >
                  <h3
                    className="yer-store-details__cardTitle"
                    style={buildTextStyle(
                      headings.styles,
                      {
                        family: "var(--fontFamily-h3-fontFamily)",
                        size: "var(--fontSize-h3-fontSize)",
                        weight: "var(--fontWeight-h3-fontWeight)",
                        transform: "var(--textTransform-h3-textTransform)",
                      },
                      headings.fontColor,
                    )}
                  >
                    {resolvedColumn3Heading}
                  </h3>
                </EntityField>
                <EntityField
                  displayName="Services"
                  fieldId={services.text.field}
                  constantValueEnabled={services.text.constantValueEnabled}
                >
                  <ul
                    className="yer-store-details__services"
                    style={buildTextStyle(
                      services.styles,
                      {
                        family: "var(--fontFamily-body-fontFamily)",
                        size: "var(--fontSize-body-fontSize)",
                        weight: "var(--fontWeight-body-fontWeight)",
                        transform: "var(--textTransform-body-textTransform)",
                      },
                      services.fontColor,
                    )}
                  >
                    {resolvedServices.map((item, index) => (
                      <li key={`${index}-${getTranslatableStringValue(item)}`}>
                        {getTranslatableStringValue(item)}
                      </li>
                    ))}
                  </ul>
                </EntityField>
              </article>
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailStoreDetailsSection: YextComponentConfig<StoreDetailsProps> =
  {
    label: "Store Details Section",
    fields: toPuckFields(storeDetailsFields),
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "[[address.city]] Store Details",
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
      address: {
        heading: makeSubheadingDefault("Address"),
        address: {
          field: "address",
          constantValue: {
            line1: "",
            city: "",
            postalCode: "",
            countryCode: "",
            region: "",
          },
          constantValueEnabled: false,
        },
        showRegion: true,
        showCountry: false,
      },
      phones: {
        heading: makeSubheadingDefault("Phone Number"),
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            },
            label: "",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      hours: {
        hours: {
          field: "hours",
          constantValue: {},
          constantValueEnabled: false,
        },
        styles: {
          startOfWeek: "monday",
          collapseDays: false,
          showAdditionalHoursText: false,
        },
      },
      headings: {
        column1Heading: {
          field: "",
          constantValue: {
            defaultValue: "Location Information",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        column2Heading: {
          field: "",
          constantValue: {
            defaultValue: "Store Hours",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        column3Heading: {
          field: "",
          constantValue: {
            defaultValue: "Services",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "uppercase",
        },
        fontColor: undefined,
      },
      services: {
        text: {
          field: "",
          constantValue: [
            "Complimentary Personal Styling",
            "Digital Fitting Room Requests",
            "In-Store WiFi",
            "Mobile Checkout",
            "Gift Wrapping Station",
          ],
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
      websiteCta: makeCtaValue(
        "Visit Website",
        "#",
        "primary",
        {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        "primaryCta",
      ),
      directionsCta: makeCtaValue(
        "Get Directions",
        "#",
        "secondary",
        {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        "secondaryCta",
      ),
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
      },
    },
    render: EssentialRetailStoreDetailsSectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailStoreDetailsSection",
  displayName: "Store Details Section",
  description: "Store Details Section",
  pageSetTypes: ["ENTITY"],
};
