import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  getAggregateRating,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  getDefaultRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  BackgroundProvider,
} from "@yext/visual-editor";
import {
  AnalyticsScopeProvider,
  HoursStatus,
  type ComplexImageType,
  type HoursType,
  type ImageType,
  type StatusParams,
} from "@yext/pages-components";

const heroTypographyScopeClass = "yer-hero-typography";

const heroTypographyStyles = `
  .${heroTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${heroTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${heroTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${heroTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${heroTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${heroTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${heroTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${heroTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${heroTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${heroTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${heroTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

type HeroHoursStyles = {
  showCurrentStatus: boolean;
  timeFormat: "12h" | "24h";
  dayOfWeekFormat: "short" | "long";
  showDayNames: boolean;
};

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type HeroProps = {
  heroImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  hours: YextEntityField<HoursType>;
  hoursStyles: HeroHoursStyles;
  primaryCta: ComprehensiveCTAValue;
  secondaryCta: ComprehensiveCTAValue;
  section: {
    visibleOnLivePage: boolean;
  };
};

const buildTextStyle = (
  styles: StyledTextValue,
  defaultVars: {
    family: string;
    size: string;
    weight: string;
    transform: string;
  },
  color?: ThemeColor,
) => ({
  color: getThemeColorCssValue(color),
  fontFamily:
    styles.fontFamily === "default" ? defaultVars.family : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? defaultVars.size : styles.fontSize,
  fontWeight:
    styles.fontWeight === "default" ? defaultVars.weight : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default"
      ? defaultVars.transform
      : styles.textTransform,
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

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="m12 2.8 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2L12 17.1 6.3 20l1.1-6.2-4.5-4.4 6.3-.9L12 2.8Z" />
  </svg>
);

const heroFields: YextFields<HeroProps> = {
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
    },
  },
  heroImage: {
    label: "Hero Image",
    type: "object",
    objectFields: {
      image: {
        type: "entityField",
        label: "Image",
        filter: {
          types: ["type.image"],
        },
      },
    },
  },
  hours: {
    type: "entityField",
    label: "Hours",
    filter: {
      types: ["type.hours"],
    },
    disableConstantValueToggle: true,
  },
  hoursStyles: {
    label: "Hours Styles",
    type: "object",
    objectFields: {
      showCurrentStatus: {
        label: "Show Current Status",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      timeFormat: {
        label: "Time Format",
        type: "select",
        options: [
          { label: "12 Hour", value: "12h" },
          { label: "24 Hour", value: "24h" },
        ],
      },
      dayOfWeekFormat: {
        label: "Day Of Week Format",
        type: "select",
        options: [
          { label: "Short", value: "short" },
          { label: "Long", value: "long" },
        ],
      },
      showDayNames: {
        label: "Show Day Names",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
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
  body: {
    label: "Body",
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: "Text",
        filter: {
          types: ["type.rich_text_v2"],
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
  primaryCta: {
    label: "Primary Call to Action",
    type: "comprehensiveCTA",
  },
  secondaryCta: {
    label: "Secondary Call to Action",
    type: "comprehensiveCTA",
  },
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

export const EssentialRetailHeroSectionComponent: PuckComponent<
  HeroProps
> = ({
  id,
  heroImage,
  heading,
  body,
  hours,
  hoursStyles,
  primaryCta,
  secondaryCta,
  section,
  puck,
}) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailHeroSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeroImage = resolveComponentData(
    heroImage.image,
    locale,
    streamDocument,
  );
  const hasResolvedHeroImage = Boolean(
    resolvedHeroImage &&
    typeof resolvedHeroImage === "object" &&
    (("url" in resolvedHeroImage &&
      typeof resolvedHeroImage.url === "string" &&
      resolvedHeroImage.url.trim()) ||
      ("image" in resolvedHeroImage &&
        resolvedHeroImage.image &&
        typeof resolvedHeroImage.image === "object" &&
        "url" in resolvedHeroImage.image &&
        typeof resolvedHeroImage.image.url === "string" &&
        resolvedHeroImage.image.url.trim())),
  );
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const bodyOverrides = {
    ...buildRichTextStyleOverrides(
      body.styles,
      {
        family: "var(--fontFamily-body-fontFamily)",
        size: "var(--fontSize-body-fontSize)",
        weight: "var(--fontWeight-body-fontWeight)",
      },
      body.fontColor,
    ),
    lineHeight: 1.2,
    letterSpacing: "0.01em",
  };
  const resolvedBody = resolveComponentData(body.text, locale, streamDocument, {
    richTextStyleOverrides: bodyOverrides,
  });
  const resolvedHours = resolveComponentData(hours, locale, streamDocument);
  const { averageRating, reviewCount } = getAggregateRating(streamDocument) ?? {
    averageRating: 0,
    reviewCount: 0,
  };

  const statusTemplate = (params: StatusParams) => {
    if (!hoursStyles.showCurrentStatus) {
      return null;
    }
    if (params.currentInterval?.is24h()) {
      return "Open 24 Hours";
    }

    const interval = params.isOpen
      ? params.currentInterval
      : params.futureInterval;
    const time = params.isOpen
      ? (interval?.getEndTime(locale, {
          hour12: hoursStyles.timeFormat === "12h",
        }) ?? "")
      : (interval?.getStartTime(locale, {
          hour12: hoursStyles.timeFormat === "12h",
        }) ?? "");
    const prefix = params.isOpen ? "Open Now" : "Closed";
    const suffix = time
      ? params.isOpen
        ? `Closes at ${time}`
        : `Opens at ${time}`
      : "";

    return <span>{suffix ? `${prefix}: ${suffix}` : prefix}</span>;
  };

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          className={`yer-hero ${heroTypographyScopeClass}`}
          as="section"
          style={getSurfaceColorStyle(
            { selectedColor: "[#000000]", contrastingColor: "[#FFFFFF]" },
            streamDocument,
          )}
        >
          <style>
            {`
              .yer-hero {
                position: relative;
                width: 100%;
                max-width: 100%;
                overflow: hidden;
              }

              .yer-hero__bg,
              .yer-hero__overlay {
                position: absolute;
                inset: 0;
                max-width: 100%;
              }

              .yer-hero__bg {
                z-index: 0;
                overflow: hidden;
              }

              .yer-hero__bgFrame {
                position: absolute;
                inset: 0;
                overflow: hidden;
              }

              .yer-hero__bgImage {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                display: block;
                max-width: none;
              }

              .yer-hero__overlay {
                z-index: 1;
                background: rgba(0, 0, 0, 0.65);
              }

              .yer-hero__inner {
                position: relative;
                z-index: 2;
                width: 100%;
                max-width: 100%;
                max-width: 1440px;
                margin: 0 auto;
                padding: 40px 15px;
              }

                .yer-hero__content {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  max-width: 500px;
                }

                .yer-hero__status {
                  font-size: 16px;
                  letter-spacing: 0.01em;
                  text-transform: uppercase;
                }

                .yer-hero__title {
                  margin: 0;
                  line-height: 1.1;
                  letter-spacing: 0.01em;
                }

                .yer-hero__rating {
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  gap: 8px;
                  font-size: 16px;
                  letter-spacing: 0.01em;
                }

                .yer-hero__star {
                  width: 20px;
                  height: 20px;
                }

                .yer-hero__actions {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 12px;
                }

                @media (min-width: 768px) {
                  .yer-hero__inner {
                    padding-right: 32px;
                    padding-left: 32px;
                  }
                }

                @media (min-width: 990px) {
                  .yer-hero__inner {
                    padding: 80px 60px;
                  }

                  .yer-hero__actions {
                    flex-direction: row;
                    gap: 16px;
                    padding-top: 32px;
                  }
                }
              `}
          </style>
          <style>{heroTypographyStyles}</style>
          <div className="yer-hero__bg">
            {hasResolvedHeroImage && resolvedHeroImage ? (
              <EntityField
                displayName="Hero Image"
                fieldId={heroImage.image.field}
                constantValueEnabled={heroImage.image.constantValueEnabled}
              >
                <div className="yer-hero__bgFrame">
                  <Image
                    image={resolvedHeroImage}
                    className="yer-hero__bgImage"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </EntityField>
            ) : null}
          </div>
          <div className="yer-hero__overlay" />
          <div className="yer-hero__inner">
            <div className="yer-hero__content">
              {resolvedHours ? (
                <EntityField
                  displayName="Hours"
                  fieldId={hours.field}
                  constantValueEnabled={hours.constantValueEnabled}
                >
                  <div className="yer-hero__status">
                    <HoursStatus
                      hours={resolvedHours}
                      timezone={streamDocument.timezone ?? "UTC"}
                      comingSoon={streamDocument.comingSoon}
                      timeOptions={{
                        hour12: hoursStyles.timeFormat === "12h",
                      }}
                      dayOptions={{ weekday: hoursStyles.dayOfWeekFormat }}
                      statusTemplate={statusTemplate}
                    />
                  </div>
                </EntityField>
              ) : null}
              <EntityField
                displayName="Heading"
                fieldId={heading.text.field}
                constantValueEnabled={heading.text.constantValueEnabled}
              >
                <h1
                  className="yer-hero__title"
                  style={buildTextStyle(
                    heading.styles,
                    {
                      family: "var(--fontFamily-h1-fontFamily)",
                      size: "var(--fontSize-h1-fontSize)",
                      weight: "var(--fontWeight-h1-fontWeight)",
                      transform: "var(--textTransform-h1-textTransform)",
                    },
                    heading.fontColor,
                  )}
                >
                  {resolvedHeading}
                </h1>
              </EntityField>
              {reviewCount ? (
                <div
                  className="yer-hero__rating"
                  aria-label={`Overall rating: ${averageRating} out of 5 from ${reviewCount} reviews`}
                >
                  <StarIcon className="yer-hero__star" />
                  <span>{`${averageRating.toFixed(1)} stars from ${reviewCount} customer reviews`}</span>
                </div>
              ) : null}
              <EntityField
                displayName="Body"
                fieldId={body.text.field}
                constantValueEnabled={body.text.constantValueEnabled}
              >
                {typeof resolvedBody === "string" ? (
                  <MaybeRTF
                    data={resolvedBody}
                    richTextStyleOverrides={bodyOverrides}
                  />
                ) : (
                  resolvedBody
                )}
              </EntityField>
              <BackgroundProvider
                value={{
                  selectedColor: "[#000000]",
                  contrastingColor: "[#FFFFFF]",
                  isDarkColor: true,
                }}
              >
                <div className="yer-hero__actions">
                  <EntityField
                    displayName="Primary Call to Action"
                    fieldId={primaryCta.data.cta.field}
                    constantValueEnabled={
                      primaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={primaryCta as Partial<ComprehensiveCTAValue>}
                    />
                  </EntityField>
                  <EntityField
                    displayName="Secondary Call to Action"
                    fieldId={secondaryCta.data.cta.field}
                    constantValueEnabled={
                      secondaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={secondaryCta as Partial<ComprehensiveCTAValue>}
                    />
                  </EntityField>
                </div>
              </BackgroundProvider>
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailHeroSection: YextComponentConfig<HeroProps> = {
  label: "Hero Section",
  fields: toPuckFields(heroFields),
  defaultProps: {
    heroImage: {
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
          width: 1900,
          height: 1267,
        },
        constantValueEnabled: true,
      },
    },
    heading: {
      text: {
        field: "name",
        constantValue: {
          defaultValue: "",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: false,
      },
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
    },
    body: {
      text: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "[[name]] - [[address.city]] is a clothing retail location offering a curated selection of contemporary apparel, premium denim, and seasonal essentials for men, women and children. Experience personalized styling services and an unmatched collection of designer-inspired fashion in the heart of [[address.city]].",
          ),
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
    },
    hours: {
      field: "hours",
      constantValue: {},
      constantValueEnabled: false,
    },
    hoursStyles: {
      showCurrentStatus: true,
      timeFormat: "12h",
      dayOfWeekFormat: "long",
      showDayNames: false,
    },
    primaryCta: makeCtaValue(
      "Get Directions",
      "#",
      "primary",
      {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
      "primaryCta",
    ),
    secondaryCta: makeCtaValue(
      "Book Personal Stylist",
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
    },
  },
  render: EssentialRetailHeroSectionComponent,
};

export const config: SectionConfig = {
  id: "EssentialRetailHeroSection",
  displayName: "Hero Section",
  description: "Hero Section",
  pageSetTypes: ["ENTITY"],
};
